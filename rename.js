const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const directoriesToScan = ['frontend', 'backend', '.'];

function scanAndReplace(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        if (file === 'node_modules' || file === '.git' || file === 'dist' || file === 'rename.js') {
            continue; // skip
        }
        
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            scanAndReplace(fullPath);
        } else if (stat.isFile()) {
            try {
                let content = fs.readFileSync(fullPath, 'utf8');
                let newContent = content;
                
                // Replace strings
                newContent = newContent.replace(/Smart Event & Exam Management System/g, 'CampusSync');
                newContent = newContent.replace(/Smart Event Management System/g, 'CampusSync');
                newContent = newContent.replace(/SmartEvents/gi, 'CampusSync');
                newContent = newContent.replace(/Smart Event/gi, 'CampusSync');
                newContent = newContent.replace(/SmartEvent/gi, 'CampusSync');
                
                if (content !== newContent) {
                    fs.writeFileSync(fullPath, newContent, 'utf8');
                    console.log('Updated: ' + fullPath);
                }
            } catch (err) {
                // Not a text file or error reading
            }
        }
    }
}

directoriesToScan.forEach(dir => {
    scanAndReplace(path.join(rootDir, dir));
});

console.log("Renaming complete!");
