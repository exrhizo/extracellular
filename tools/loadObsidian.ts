const fs = require('fs');
const marked = require('marked');


// Read the contents of the directory
fs.readdir('./matrix', (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  // Initialize an empty JSON object to represent the directory structure
  const json = {};

  // Iterate over the array of files and directories
  for (const file of files) {
    // Check if the file is a markdown file
    if (file.endsWith('.md')) {
      // Read the contents of the file
      fs.readFile(`./matrix/${file}`, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          return;
        }

        // Parse the markdown content using marked
        const html = marked(data);

        // Add the parsed markdown content to the JSON object as a node
        json[file] = {
          name: file,
          content: html
        };
      });
    } else {
      // If the file is not a markdown file, add it as a directory node to the JSON object
      json[file] = {
        name: file,
        type: 'directory'
      };
    }
  }
});
