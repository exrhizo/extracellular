import { Vault, VaultPage } from '@dubin/obsidian-vault-parser';
import { CURRENT_SITE_NAME } from '../pages/[[...route]]';
import { LANDING_PAGE_DIRECTORY_NAME } from './constants';

type ExtendedFile = {
    file: VaultPage;
    sitePath: string[];
};

export type ExtendedFileMap = Record<string, ExtendedFile>;

function getSitePathFromFilePath(filePath: string, vaultPath: string): string[] {
    const vaultPathLength = vaultPath.length;
    const truncatedFilePath = [filePath]
        // Chops off the prefix that is the vault's path (i.e. "./matrix/")
        .map((filePath) => filePath.slice(vaultPathLength + 1))
        // Chops off the .md file extension
        .map((filePath) => filePath.slice(0, filePath.length - 3))[0];

    const filePathAsArr = truncatedFilePath.split('/');

    // If the file is in the landing page directory, we want to not publish the page unless it is the root page, so null file path

    if (filePathAsArr[0] === LANDING_PAGE_DIRECTORY_NAME) {
        if (filePathAsArr[1] == CURRENT_SITE_NAME) {
            return [];
        }
        return null;
    }

    // If the file is in the directory of the site we are currently on, we want to privledge it with a top
    // level page name

    if (filePathAsArr[0] === CURRENT_SITE_NAME) {
        filePathAsArr.shift();
    }

    // console.log('cleaned up');
    // console.log({ filePathAsArr, filePath });

    return filePathAsArr;
}

// this function takes the Record of Obsidian files and returns a map where
// each key is a file name and each value is an object that contains the file object (from the parser),
//  and the path we want it to have on the site
export function extendFiles(files: Record<string, VaultPage>, vaultPath: string): ExtendedFileMap {
    // console.log('ayyy');
    const extendedFileMap: ExtendedFileMap = {};

    Object.entries(files).forEach(([key, file]) => {
        const path = file.path;
        const sitePath = getSitePathFromFilePath(path, vaultPath);

        console.log({ path, sitePath });

        extendedFileMap[key] = {
            file,
            sitePath,
        };
    });

    return extendedFileMap;
}

type StaticPaths = { params: { route: string[] } }[];

// This function takes the Obsidian vault and returns an object containing all the paths
// we need to setup for the site.

// Returns something that looks like this
/*
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
export default function getPathsFromVault(vault: Vault): StaticPaths {
    const extendedFileMap = extendFiles(vault.files, vault.path);

    console.log('ayyyy');
    const files = Object.values(vault.files);

    const filePaths = files.map((file) => file.path);
    console.log({ filePaths });

    // Todo filter out the nulls?

    const paths = Object.values(extendedFileMap).map((file) => {
        console.log(file.sitePath);
        return { params: { route: file.sitePath } };
    });

    console.log({ paths });
    return paths;
}
