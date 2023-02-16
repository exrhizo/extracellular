import { readVault, Vault } from '@dubin/obsidian-vault-parser';
import { CURRENT_SITE_NAME } from '../pages/[[...route]]';
import { stripDirectoryPathAndMDFromFileNames } from '../utils/vaultUtils';
import { LANDING_PAGE_DIRECTORY_NAME } from './constants';
import { VaultFiles } from './types';

export async function onBuild(): Promise<{
    vaultFilesCleanedUp: VaultFiles;
    staticPaths: { params: { route: string[] } }[];
    pathToFileKeyMap: any;
    fileKeyToPathMap: any;
}> {
    const pathToFileKeyMap = {};
    // the inverse of the above, for reverse lookup. maybe replace with lookup table at some point, we'll see
    const fileKeyToPathMap = {};

    // use isPublished param?
    const vault = await readVault('./matrix');

    const vaultFiles = vault.files;
    const vaultFilesCleanedUp = stripDirectoryPathAndMDFromFileNames(vaultFiles, vault.path);

    const staticPaths = [];

    Object.keys(vaultFilesCleanedUp).forEach((fileKey) => {
        let path = fileKey.split('/');

        // Do not make routes for the config files
        if (path[0] === LANDING_PAGE_DIRECTORY_NAME) {
            return;
            // If this is a route corresponding to the current site, we will top level it
        } else if (path[0] === CURRENT_SITE_NAME) {
            path.shift();

            // console.log({ path });

            // tslint:disable-next-line
            if (path[0] === 'Home' && path.length === 1) {
                // And if it's the Home page for the current site, we want to return an empty array, which represents the '/' route

                path = ['', ''];
            }
        }

        // we also want to map the path to fileKey so we can look it up later
        pathToFileKeyMap[path.join('/')] = fileKey;
        fileKeyToPathMap[fileKey] = path.join('/');

        staticPaths.push({ params: { route: path } });
    });

    return { vaultFilesCleanedUp, staticPaths, pathToFileKeyMap, fileKeyToPathMap };
}
