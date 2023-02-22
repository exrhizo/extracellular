/* There are three link types we want to handle
    1. ![[imagePath]] -> ![](imagePath)
    2. [[fileKey|name]] -> [name](path)
    3. [[fileKey]] -> [fileKey](path)
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
