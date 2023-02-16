// An obsidian link is something like
// [[exrhizo/Home|Home]]
// [[exrhizo/Human_Factor|The Human Factor]]
// [[exrhizo/Play_Space|Play Space]]
// [[exrhizo/Resume|Resume]]

// We want to turn it into something like "Home" or "The Human Factor" or "Play Space" or "Resume"
// function getRouteFromObsidianLink(link: string): string {
//     const linkRegex = /\[\[(.+)\|(.+)\]\]/;
//     const match = link.match(linkRegex);
//     if (match) {
//         return match[2];
//     }
//     return '';
// }

export default {};
