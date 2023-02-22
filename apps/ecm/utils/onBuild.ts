import { readVault } from '@dubin/obsidian-vault-parser';
import { CURRENT_SITE_NAME } from '../pages/[[...route]]';
import { stripDirectoryPathAndMDFromFileNames } from '../utils/vaultUtils';
import { SITE_CONFIG_DIRECTORY_NAME } from './constants';
import { VaultFiles } from './types';

export async function onBuild(): Promise<{
    vaultFiles: VaultFiles;
    staticPaths: { params: { route: string[] } }[];
    pathToFileKeyMap: Record<string, string>;
    fileKeyToPathMap: Record<string, string>;
}> {
    // These two maps are mirrors/inverses of each other
    const pathToFileKeyMap = {};
    const fileKeyToPathMap = {};

    // TODO: use isPublished param?
    const vault = await readVault('./matrix');

    const vaultFilesCleanedUp = stripDirectoryPathAndMDFromFileNames(vault.files, vault.path);

    const staticPaths: any[] = [];

    /* 
      The three basic rules we are following here are
      1. If the file is in the directory for the current site (e.g. Exhrizo), we top-level it. So "Exhrizo/About" becomes /About
      2. If the file is in the directory for the current site and is the Home page, we top-level it to the root route, i.e. "/"
      3. Otherwise, we post as is (e.g. "Ford_Crossing/About" is /Ford_Crossing/About)
    */

    Object.keys(vaultFilesCleanedUp).forEach((fileKey) => {
        let path = fileKey.split('/');

        // Do not make routes for the config files
        if (path[0] === SITE_CONFIG_DIRECTORY_NAME) {
            return;
            // Rule 2
        } else if (path[0] === CURRENT_SITE_NAME) {
            // remove the site name from the path
            path = path.slice(1);

            if (path[0] === 'Home' && path.length === 1) {
                path = ['']; // this when joined will make it "/"
            }
        }

        const pathStr = '/' + path.join('/');

        // we also want to map the path to fileKey so we can look it up later
        pathToFileKeyMap[pathStr] = fileKey;
        fileKeyToPathMap[fileKey] = pathStr;

        staticPaths.push({ params: { route: path } });
    });

    return { vaultFiles: vaultFilesCleanedUp, staticPaths, pathToFileKeyMap, fileKeyToPathMap };
}
