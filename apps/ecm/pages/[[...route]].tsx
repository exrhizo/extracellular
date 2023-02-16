// import React, { useEffect } from 'react';

import { useRouter } from 'next/router';

import { readVault, Vault } from '@dubin/obsidian-vault-parser';

// import { useRemark } from 'react-remark';
import ReactMarkdown from 'react-markdown';

export const CURRENT_SITE_NAME = 'Exrhizo';

import React from 'react';
import { getSiteConfig } from '../utils/pages';
import { VaultFiles } from '../utils/types';
import { onBuild } from '../utils/onBuild';

function getNavLinks(str: string) {
    // console.log({str})
    const regex = /\s*\[\[[^\]]*\]\]/g;
    const matches = str.match(regex);
    return matches.map((match) => match.trim());
}

function parseObsidianLink(link: string, fileKeyToPathMap: any) {
    // Takes a string that's formatted like this "[[fileKey|name]]" and returns an object formatted like this
    // { path, name }

    const regex = /\[\[(.*)\|(.*)\]\]/;
    const matches = link.match(regex);

    const fileKey = matches[1];

    // console.log({fileKeyToPathMap, fileKey})
    const path = fileKeyToPathMap[fileKey];

    return { path, name: matches[2] };
}

// Route
// Path
// ...

export function PageWrapper({
    vaultFiles,
    route,
    pathToFileKeyMap,
    fileKeyToPathMap,
}: {
    vaultFiles: VaultFiles;
    route: string[];
    pathToFileKeyMap: any;
    fileKeyToPathMap: any;
}) {
    const siteConfig = getSiteConfig(vaultFiles, CURRENT_SITE_NAME);
    const navLinks = getNavLinks(siteConfig.content);

    // TODO: MAYBE TOO SLOW FOR RENDER?
    const parsedNavLinks = navLinks.map((link) => {
        return parseObsidianLink(link, fileKeyToPathMap);
    });

    console.log({ navLinks });
    console.log({ parsedNavLinks });

    // const parsedNavLinks = [
    //     { path: '/', name: 'Home' },
    //     { path: 'Human_Factor', name: 'The Human Factor' },
    //     { path: 'Play_Space', name: 'Play Space' },
    //     { path: 'Resume', name: 'Resume' },
    // ];

    const fileKey = pathToFileKeyMap[route.length === 0 ? '/' : route.join('/')];
    const file = vaultFiles[fileKey];
    const pageContent = file.content;

    // console.log({fileKey});
    // console.log({file});
    console.log({ pageContent });

    // If the route is empty, redirect to the Home page
    // if (route.length == 0) {
    //   // const homePage = getHomePage(vaultFiles, CURRENT_SITE_NAME);

    //   // pageContent = homePage.content;
    // } else {

    // }

    // const [reactContent, setMarkdownSource] = useRemark();

    // setMarkdownSource(pageContent);
    // const links = getLinks(pageContent);

    return (
        <div className="container mx-auto max-w-3xl pt-5">
            {parsedNavLinks.map((parsedLink) => {
                return (
                    <a key={parsedLink.name} style={{ paddingRight: 10 }} href={parsedLink.path}>
                        {parsedLink.name}
                    </a>
                );
            })}

            <div className="pt-5">
                <ReactMarkdown>{pageContent}</ReactMarkdown>
            </div>
        </div>
    );
}

export async function getStaticProps({ params }) {
    // Root returns no route key for some reason, use empty array to keep things consistent
    const route = params?.route || [];

    const { pathToFileKeyMap, fileKeyToPathMap, vaultFilesCleanedUp } = await onBuild();

    // console.log({fileKeyToPathMap})

    return {
        props: {
            route,

            vaultFiles: vaultFilesCleanedUp,
            pathToFileKeyMap,
            fileKeyToPathMap,
        },
    };
}

// TODO: add back the static path mapping

// function createStaticPathsFromVaultFiles(vaultFiles: VaultFiles) {
//   // const paths = Object.keys(vaultFiles).map((file) => {
//   //   return {
//   //     params: {
//   //       route: fileName.split('/'),
//   //     },
//   //   };
//   // });

//   return paths;
// }

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
    const { staticPaths, pathToFileKeyMap } = await onBuild();

    // console.log({pathToFileKeyMap: pathToFileKeyMap})

    // console.log({staticPaths: JSON.stringify(staticPaths)});
    // const staticPaths = createStaticPathsFromVaultFiles(vaultFilesCleanedUp);
    // console.log({staticPaths: staticPaths.forEach(path => console.log(path.params))});

    return { paths: staticPaths, fallback: false };

    // const paths = getPathsFromVault(vault);

    // console.log('yooo');
    // console.log({vaultFilesCleanedUp: vaultFilesCleanedUp});
    // // console.log({paths: paths.forEach(path => console.log(path.params)) });

    // return {
    //   paths,
    //   fallback: false, // can also be true or 'blocking'
    // }
}

export default PageWrapper;
