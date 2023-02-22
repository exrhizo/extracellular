import ReactMarkdown from 'react-markdown';

export const CURRENT_SITE_NAME = 'Exrhizo';

import { getSiteConfig } from '../utils/pages';
import { VaultFiles } from '../utils/types';
import { onBuild } from '../utils/onBuild';
import parseMarkdownContent from '../utils/parseMarkdownContent';

function getNavLinks(str: string): string[] | null {
    const regex = /\s*\[\[[^\]]*\]\]/g;
    const matches = str.match(regex);
    if (!matches) {
        return null;
    }
    
    return matches.map((match) => match.trim());
}

// Takes a string that's formatted like this "[[fileKey|name]]" and returns an object formatted like this
// { path, name }
function parseObsidianLink(link: string, fileKeyToPathMap: Record<string, string>) {
    const regex = /\[\[(.*)\|(.*)\]\]/;
    const matches = link.match(regex);

    if (!matches) {
        console.log({link})
        throw new Error(`Could not parse Obsidian link: ${link}`);
    }

    const fileKey = matches[1];

    // console.log({fileKeyToPathMap, fileKey})
    const path = fileKeyToPathMap[fileKey];

    return { path, name: matches[2] };
}

/* Some terminology:*/
// Route. e.g. [] or ["Human_Factor"], ["Ford_Crossing", "Home"]   <-- What next.js uses for routing
// Path e.g. '/', Human_Factor, Ford_Crossing/Home   <-- what you see in the url bar, and what we use for hrefs/links
// fileKey e.g. Exrhizo/Home, Exrhizo/Human_Factor, Ford_Crossing/Home 
export function PageWrapper({
    vaultFiles,
    route,
    pathToFileKeyMap,
    fileKeyToPathMap,
}: {
    vaultFiles: VaultFiles;
    route: string[];
    pathToFileKeyMap: Record<string, string>;
    fileKeyToPathMap: Record<string, string>;
}) {
    // TODO: add title to page?

    const siteConfig = getSiteConfig(vaultFiles, CURRENT_SITE_NAME);
    const navLinks = getNavLinks(siteConfig.content);

    // TODO: MAYBE TOO SLOW FOR RENDER? On second thought, I think fine.
    const parsedNavLinks = navLinks ? navLinks.map((link) => {
        return parseObsidianLink(link, fileKeyToPathMap);
    }) : undefined;

    console.log({ navLinks });
    console.log({ parsedNavLinks });

    // Example. Possibly useful to leave around for testing. Likely delete.
    // const parsedNavLinks = [
    //     { path: '/', name: 'Home' },
    //     { path: 'Human_Factor', name: 'The Human Factor' },
    //     { path: 'Play_Space', name: 'Play Space' },
    //     { path: 'Resume', name: 'Resume' },
    // ];

    console.log({pathToFileKeyMap, fileKeyToPathMap})

    const fileKey = pathToFileKeyMap[route.length === 0 ? '/' : '/' + route.join('/')];
    const file = vaultFiles[fileKey];
    const pageContent = file.content;

    const pageContentParsed = parseMarkdownContent(pageContent, fileKeyToPathMap);

    return (
        <div className="container mx-auto max-w-3xl pt-5">
            {parsedNavLinks && parsedNavLinks.map((parsedLink) => {
                console.log({path: parsedLink.path})
                return (
                    <a key={parsedLink.name} style={{ paddingRight: 10 }} href={parsedLink.path} className="no-underline">
                        {parsedLink.name}
                    </a>
                );                
            })}

            <div className="pt-5">
                <ReactMarkdown>{pageContentParsed}</ReactMarkdown>
            </div>
        </div>
    );
}

export async function getStaticProps({ params }) {
    // Root returns no route key for some reason, use empty array to keep things consistent
    const route = params?.route || [];

    const { pathToFileKeyMap, fileKeyToPathMap, vaultFiles } = await onBuild();

    return {
        props: {
            route,

            vaultFiles,
            pathToFileKeyMap,
            fileKeyToPathMap,
        },
    };
}

/* We need to return an object like the following, where each route is an array of strings 
// that corresponds to a route we'll have on the site. This all needs to be statically declared 
// (i.e. known at build time)

[
  {
      params: { route: [] },
  },
  {
      params: { route: ['home'] },
  },
  {
      params: { route: ['home', 'page'] },
  },
];
*/

export async function getStaticPaths() {
    const { staticPaths } = await onBuild();

    return { paths: staticPaths, fallback: false };
}

export default PageWrapper;
