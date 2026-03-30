const fs = require('fs');
const path = require('path');

function findFiles(dir, filter, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findFiles(filePath, filter, fileList);
    } else if (filter.test(filePath)) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const baseDir = path.resolve('C:/Users/Admin/Documents/EdTech/Copilot/xtars/src/x-tars/courses');
const filesToProcess = findFiles(baseDir, /(Wrappers?\.tsx)$/i);

const importRegex = /^import\s+([A-Z][a-zA-Z0-9_]*)\s+from\s+["'](\.\.?\/[^"']+)["'];?\r?$/gm;

let changedFiles = 0;

for (const file of filesToProcess) {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  content = content.replace(importRegex, (match, componentName, importPath) => {
    return `const ${componentName} = React.lazy(() => import("${importPath}"));`;
  });

  if (content !== originalContent) {
    if (!content.includes('import React')) {
      content = `import React from "react";\n` + content;
    }
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated: ${file}`);
    changedFiles++;
  }
}

console.log(`\nProcessing complete. Modified ${changedFiles} files.`);
