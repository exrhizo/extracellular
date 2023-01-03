import type { ExecutorContext } from '@nrwl/devkit';

import iti from 'itiriri';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { readFileSync, writeFileSync, readFile } from 'fs';
import { join } from 'path';
import { parseToStructure, parseToAst } from '../../../libs/roam-wrangler/src';

// TODO:
// npm install jq-web
// const jq = require('jq-web');

const example = {
  uid: '',
  'edit-time': 888,
  title: 'thing',
  children: null ?? [
    {
      string: 'I got a app and have started practicing!!!',
      uid: '5zWBHxKpM',
      heading: null ?? 3,
      'create-time': 1576303943052,
      'edit-time': 1576311611227,
    },
  ],
};

// Then there is refs and embeds
// and how to create the ideal data format

export interface ExecutorOptions {
  port?: number;
  output: string;
  unfiltered?: boolean;
}

interface RawRoamPage {
  ':create/time': number;
  ':node/title': string;
  ':create/user': {
    ':db/id': number;
  };
  ':block/open': boolean;
  ':edit/time': number;
  ':block/uid': string;
  ':db/id': number;
  ':block/children'?: { ':db/id': number }[];
  ':edit/user': { ':db/id': number }[];
}

interface RawRoamBlock {
  ':block/parents': { ':db/id': number }[];
  ':block/string': string;
  ':block/heading'?: number;
  ':create/time': number;
  ':create/user': { ':db/id': number };
  ':block/order': number;
  ':block/open': boolean;
  ':edit/time': number;
  ':block/uid': string;
  ':db/id': number;
  ':block/page': { ':db/id': number };
  ':edit/user': { ':db/id': number };
}

type RawRoamData = { pages: RawRoamPage[]; blocks: RawRoamBlock[] };

export default async function roamCaptureExecutor(
  { port, ...options }: ExecutorOptions,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  const outputBase = join(context.cwd, options.output);
  const output = outputBase + '.json';
  const outputRaw = outputBase + '-raw.json';

  // const outputRaw = join(context.cwd, options.outputRaw);
  // const output = join(context.cwd, options.output);

  if (port) {
    await runZexportCaputureServer({ outputRaw, output, port });
  } else {
    console.log(`Reading file ${outputRaw}`);
    const rawData = JSON.parse(readFileSync(outputRaw, 'utf8')) as RawRoamData;

    const processData = processRoamData(rawData, options.unfiltered);

    console.log('writing to ', output);
    //   const s = jq.json(processData, '.');
    writeFileSync(output, JSON.stringify(processData, null, 2), {
      flag: 'w',
    });
  }

  return { success: true };
}

async function runZexportCaputureServer({
  outputRaw,
  output,
  port,
}: {
  outputRaw: string;
  output: string;
  port: number;
}) {
  console.log(`Starting server on port ${port}`);

  const server = createServer(async (req: IncomingMessage, resp: ServerResponse) => {
    console.log(`Received ${req.method}`);

    // The for await of looks the best, but I don't know how to get types in typescript.
    // https://nodejs.dev/learn/get-http-request-body-data-using-nodejs
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });

    req.on('end', () => {
      captureRoamData({ output, outputRaw, data });
      resp.writeHead(200, {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
      });
      resp.end();
      console.log('Connection closed');
    });
  });

  function captureRoamData({ outputRaw, output, data }: { outputRaw: string; output: string; data: string }) {
    console.log('writing to ', outputRaw);
    // const s = jq.json(processData, '.');
    // const s = JSON.stringify(data, null, 2)
    writeFileSync(outputRaw, data, { flag: 'w' });

    const dataObj = JSON.parse(data) as RawRoamData;
    const processData = processRoamData(dataObj);

    console.log('writing to ', output);

    writeFileSync(output, JSON.stringify(processData, null, 2), { flag: 'w' });
  }

  // @ts-ignore
  server.listen(port, (err: Error) => {
    if (err) {
      console.error(err);
      return;
    }
    console.info(`Server is listening on port ${port}`);
  });

  while (true) {
    console.info('Press Ctrl+C to stop');
    if (await stdinQuit()) {
      break;
    }
  }
}

type AthensParsedAtom =
  'paragraph'
  | ['text-run', string | ['failure', string]]
  | ['hashtag', { from: string }, string]
  | ['page-link', { from: string }, string]
  | ['typed-block-ref', { from: string }, [ 'ref-type', '[[embed]]'], ['block-ref', { from: string }, string]]
  | ['typed-block-ref', { from: string }, [ 'ref-type', 'embed'], ['block-ref', { from: string }, string]];

type AthensParsedStructure = AthensParsedAtom[];

function processRoamData(data: RawRoamData, unfiltered = false) {
  const blockByDbId = iti(data.blocks).toMap((b) => b[':db/id']);
  const pageByDbId = iti(data.pages).toMap((p) => p[':db/id']);

  const getParents = (ps: { ':db/id': number }[]) => {
    const pageId = ps[0][':db/id'];
    const blocks = ps.slice(1, ps.length).map((b) => b[':db/id']);
    return [pageByDbId.get(pageId)!, ...blocks.map((b) => blockByDbId.get(b)!)];
  }

  const getParentsUids = (ps: { ':db/id': number }[]) => {
    // Returning nulls?
    // TODO: get to the root cause, are they deleted items
    const pageId = ps[0][':db/id'];
    const blocks = ps.slice(1, ps.length).map((b) => b[':db/id']);
    return [pageByDbId.get(pageId)?.[':block/uid']!, ...blocks.map((b) => blockByDbId.get(b)?.[':block/uid']!)];
  };

  const getParentsDbIds = (ps: { ':db/id': number }[]) => {
    // Returning nulls?
    // TODO: get to the root cause, are they deleted items
    const pageId = ps[0][':db/id'];
    const blocks = ps.slice(1, ps.length).map((b) => b[':db/id']);
    return [pageId, ...blocks.map((b) => b[':db/id'])];
  };

  const hasPage = (b: RawRoamBlock) => {
    return pageByDbId.get(b[':block/page'][':db/id']) !== undefined;
  };

  const blocks = iti(data.blocks)
    .filter((b) => hasPage(b))
    .map((b) => {
      const parents = getParents(b[':block/parents']);
      const fallbackTime = parents.map(p => p?.[':create/time']).filter(t => t).reverse()?.[0];

      return ({
        uid: b[':block/uid'],
        parents: parents.map(p => p?.[':block/uid']!),
        parentsDbs: parents.map(p => p?.[':db/id']!),
        content: b[':block/string'],
        // toParse: console.log('parsing:', b[':block/string']),
        structure: parseToStructure(b[':block/string']),
        ast: parseToAst(b[':block/string']),
        heading: b[':block/heading'],
        order: b[':block/order'],
        pageUid: pageByDbId.get(b[':block/page'][':db/id'])![':block/uid'],
        pageTitle: pageByDbId.get(b[':block/page'][':db/id'])![':node/title'],
        createTime: b[':create/time'] ?? fallbackTime,
        editTime: b[':edit/time'] ?? fallbackTime
      })
    })
    .toMap((block) => block.uid);
  console.log('DONE PARSING');

  const pages = iti(data.pages)
    .map((p) => ({
      uid: p[':block/uid'],
      title: p[':node/title'],
      children: (p[':block/children'] ?? []).map((c) => blockByDbId.get(c[':db/id'])![':block/uid']),
      createTime: p[':create/time'],
      editTime: p[':edit/time']
    }))
    .toMap((p) => p.uid);
  
  const pageTitleToUid = iti(data.pages).toMap((p) => p[':node/title'], (p) => p[':block/uid']);

  const filteredBlocksUids = unfiltered ?
      iti(blocks.values()).toSet((b) => b.uid)
    : iti(blocks.values())
        .filter((b) => /^#zexport\b/.test(b.content))
        .map((b) => b.uid)
        .toSet();
    

  const zexportBlocks = unfiltered ?
      iti(blocks.values()).toArray()
    : iti(blocks.values())
      .filter((b) => b.parents.some((puid) => filteredBlocksUids.has(puid)))
      .toArray();

  const zexportBlockUids = iti(zexportBlocks)
    .map((b) => b.uid)
    .toSet();

  const zexportPagesUids = iti(zexportBlocks)
    .map((b) => b.pageUid)
    .toSet();

  // TODO: Fix children
  const zexportPages = unfiltered ?
      iti(pages.values()).toArray((p) => ({...p, children: []}))
    : iti(zexportPagesUids)
      .map((p) => {
        const page = pages.get(p)!;
        return {
          ...page,
          children: page.children.filter((c) => zexportBlockUids.has(c)),
        };
      })
      .toArray();

  // console.log(zexportBlockUids);

  const bs = iti(zexportBlocks)
    // .take(10)
    .map((x) => {
      const structure = x.structure as AthensParsedStructure;
      return {
        uid: x.uid,
        pageTitle: x.pageTitle,
        content: x.content,
        links: structureToLinks(structure.slice(1), pageTitleToUid),
        parents: x.parents,
        createTime: x.createTime,
        editTime: x.editTime,
        type: "block"
        // structure
        // ast: x.ast, AST is multilevel
      };
    })
    .toArray();

  // console.dir(bs, { depth: null });

  // For a graphistry plot, concat pages and blocks with same fields
  const nodes = iti(bs).concat(iti(zexportPages).map((p) => ({
    uid: p.uid,
    pageTitle: p.title,
    content: p.title,
    links: [],
    parents: [],
    createTime: p.createTime,
    editTime: p.editTime,
    type: 'page'
  }))).toArray()

  return {
    pages: zexportPages,
    blocks: zexportBlocks,
    parsed: bs,
    nodes 
  };
}

async function stdinQuit(): Promise<boolean> {
  process.stdin.setRawMode(true);
  return new Promise((resolve) =>
    process.stdin.once('data', (data) => {
      if (data.length > 0 && data.readUInt8(0) === 3) {
        console.log('^C');
        resolve(true);
      }
      process.stdin.setRawMode(false);
      resolve(false);
    })
  );
}

function structureToLinks(atoms: AthensParsedStructure, pageTitleToUid: Map<string, string>) {
  return (atoms?.map((a) => {
    switch (a[0]) {
      case 'text-run':
        return null;
      case 'page-link':
        return pageTitleToUid.get(a[2]);
      case 'hashtag':
        return pageTitleToUid.get(a[2]);
      case 'typed-block-ref':
        return a?.[3]?.[2];
      default:
        // Error with this style: ["block-ref",{"from":"(((khBMIidtC))"},"(khBMI
        // Errow with [failure, ]	
        return null; // JSON.stringify(a);
    }
  }).filter(i => typeof i == "string" && !/failure/.test(i)) ?? []) as string[];
}
