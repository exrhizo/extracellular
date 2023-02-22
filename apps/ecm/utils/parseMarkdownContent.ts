// TODO: what are all the link types? Non bar? Images, etc

/* There are three link types we want to handle
    1. ![[imagePath]] -> ![](imagePath)
    2. [[fileKey|name]] -> [name](wrappedFunction(fileKey))
    3. [[fileKey]] -> [fileKey](wrappedFunction(fileKey))
*/

export default function parseMarkdownContent(content: string, fileKeyToPathMap: Record<string, string>): string {
    let modifiedContent = content;

    // pattern 1: ![[imagePath]]
    modifiedContent = modifiedContent.replace(/!\[\[([^\]]+)\]\]/g, (_, fileKey) => `![](/${fileKey})`);

    // pattern 2: [[fileKey|name]]
    modifiedContent = modifiedContent.replace(
        /\[\[([^|\]]+)\|([^\]]+)\]\]/g,
        (_, fileKey, name) => `[${name}](${fileKeyToPathMap[fileKey]})`
    );

    // pattern 3: [[fileKey]]
    modifiedContent = modifiedContent.replace(
        /\[\[([^\]]+)\]\]/g,
        (_, fileKey) => `[${fileKey}](${fileKeyToPathMap[fileKey]})`
    );

    return modifiedContent;
}

// export default function parseMarkdownContent(content: string, fileKeyToPathMap: Record<string, string>): string {
//     // For each Obsidian link in the content blob, we want to replace it with a markdown link,
//     // where the fileKey is replaced with a path
//     // e.g. [[fileKey|name]] -> [name](path)

//     const obsidianLinkRegex = /\[\[(.*?)\]\]/g; // regex to match Obsidian links

//     return content.replace(obsidianLinkRegex, (match, link) => {
//         const [fileKey, name] = link.split('|'); // split the link into fileKey and name

//         // construct the path based on the fileKey
//         const path = fileKeyToPathMap[fileKey];

//         // return the markdown link with the updated path
//         return `[${name}](${path})`;
//     });
// }
