import { VaultPage } from '@dubin/obsidian-vault-parser';

// vaultFiles is a Record, where each key is the file path and the value is a VaultPage. the library we're using
// includes the vault directory in the file path, so we strip it out for ease. for example, the library
// returns us something like './matrix/dir1/dir2/file.md', but we just want 'dir1/dir2/file.md'

export function stripDirectoryPathAndMDFromFileNames(vaultFiles: Record<string, VaultPage>, vaultPath: string) {
    const strippedFiles: Record<string, VaultPage> = {};

    Object.entries(vaultFiles).forEach(([key, file]) => {
        // First we strip the leading directory name, then we strip the ".md" from the end
        const strippedPath = key.slice(vaultPath.length + 1).slice(0, -3);
        strippedFiles[strippedPath] = file;
    });

    return strippedFiles;
}
