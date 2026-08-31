const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('alert(')) {
        console.log('Modifying:', fullPath);
        
        // Very basic replace for 'Settings saved successfully!' and others
        content = content.replace(/alert\((['"`].*?successfully.*?['"`])\)/ig, 'toast.success($1)');
        content = content.replace(/alert\((['"`]Failed.*?['"`])\)/ig, 'toast.error($1)');
        content = content.replace(/alert\((['"`]Error.*?['"`])\)/ig, 'toast.error($1)');
        content = content.replace(/alert\((.*?)\)/g, 'toast.error($1)'); // Fallback to error
        
        // If not already imported, import toast
        if (!content.includes("import toast from 'react-hot-toast'")) {
           content = "import toast from 'react-hot-toast';\n" + content;
        }
        
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

processDir(path.join(__dirname, 'src'));
console.log('Done replacing alerts!');
