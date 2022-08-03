import type { ExecutorContext } from '@nrwl/devkit';

import iti from 'itiriri';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { readFileSync, writeFileSync, readFile } from 'fs';
import { join } from 'path';
import { roamWrangler } from '../../../libs/roam-wrangler/src';

// TODO:
// npm install jq-web
// const jq = require('jq-web');

// GOAL:
// First get one level closer to the standard JSON
// that means nested children
//

const example = {
  uid: '',
  'edit-time': 888,
  title: 'thing',
  children: null ?? [
    {
      string: 'I got a kagle app and have started practicing!!!',
      uid: '5zWBHxKpM',
      heading: null ?? 3,
      'create-time': 1576303943052,
      'edit-time': 1576311611227,
    },
  ],
};

// Then there is refs and embeds
// and how to create the ideal data format

export interface EchoExecutorOptions {
  port: number;
  output: string;
  outputRaw: string;
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

export default async function echoExecutor(
  options: EchoExecutorOptions,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  const fullPath = join(context.cwd, options.output);
  const fullRawPath = join(context.cwd, options.outputRaw);

  console.log('roamWrangler', roamWrangler);
  console.log('process.versions', process.versions);

  console.log(`Reading file ${fullRawPath}`);
  const rawData = JSON.parse(readFileSync(fullRawPath, 'utf8')) as RawRoamData;

  const processData = processRoamData(rawData);

  console.log('writing to ', fullPath);
  //   const s = jq.json(processData, '.');

  writeFileSync(fullPath, JSON.stringify(processData, null, 2), { flag: 'w' });

  return { success: true };
}

async function runZexportCaputureServer(output: string, port: number) {
  console.log(`Starting server on port ${port}`);

  const server = createServer(
    async (req: IncomingMessage, resp: ServerResponse) => {
      console.log(`Received ${req.method}`);

      // The for await of looks the best, but I don't know how to get types in typescript.
      // https://nodejs.dev/learn/get-http-request-body-data-using-nodejs
      let data = '';
      req.on('data', (chunk) => {
        data += chunk;
      });

      req.on('end', () => {
        captureRoamData(output, data);
        resp.writeHead(200, {
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
        });
        resp.end();
        console.log('Connection closed');
      });
    }
  );

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

function processRoamData(data: RawRoamData) {
  const blockByDbId = iti(data.blocks).toMap((b) => b[':db/id']);
  const pageByDbId = iti(data.pages).toMap((p) => p[':db/id']);

  const getParentsUids = (ps: { ':db/id': number }[]) => {
    const pageId = ps[0][':db/id'];
    const blocks = ps.slice(1, ps.length).map((b) => b[':db/id']);
    return [
      pageByDbId.get(pageId)?.[':block/uid']!,
      ...blocks.map((b) => blockByDbId.get(b)?.[':block/uid']!),
    ];
  };

  const hasPage = (b: RawRoamBlock) => {
    return pageByDbId.get(b[':block/page'][':db/id']) !== undefined;
  };

  const blocks = iti(data.blocks)
    .filter((b) => hasPage(b))
    .map((b) => ({
      uid: b[':block/uid'],
      parents: getParentsUids(b[':block/parents']),
      content: b[':block/string'],
      // markdownTree: md.parse(b[':block/string'], {}),
      heading: b[':block/heading'],
      order: b[':block/order'],
      pageUid: pageByDbId.get(b[':block/page'][':db/id'])![':block/uid'],
      pageTitle: pageByDbId.get(b[':block/page'][':db/id'])![':node/title'],
    }))
    .toMap((block) => block.uid);

  const pages = iti(data.pages)
    .map((p) => ({
      uid: p[':block/uid'],
      title: p[':node/title'],
      children: (p[':block/children'] ?? []).map(
        (c) => blockByDbId.get(c[':db/id'])![':block/uid']
      ),
    }))
    .toMap((p) => p.uid);

  const zexportTaggedBlocksUids = iti(blocks.values())
    .filter((b) => /^#zexport\b/.test(b.content))
    .map((b) => b.uid)
    .toSet();

  const zexportBlocks = iti(blocks.values())
    .filter((b) => b.parents.some((puid) => zexportTaggedBlocksUids.has(puid)))
    .toArray();

  const zexportBlockUids = iti(zexportBlocks)
    .map((b) => b.uid)
    .toSet();

  const zexportPagesUids = iti(zexportBlocks)
    .map((b) => b.pageUid)
    .toSet();

  const zexportPages = iti(zexportPagesUids)
    .map((p) => {
      const page = pages.get(p)!;
      console.log(
        page,
        page.children.filter((c) => zexportBlockUids.has(c))
      );
      return {
        ...page,
        children: page.children.filter((c) => zexportBlockUids.has(c)),
      };
    })
    .toArray();

  // console.log(zexportBlockUids);

  return {
    pages: zexportPages,
    blocks: zexportBlocks,
  };
}

function captureRoamData(output: string, data: string) {}

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
