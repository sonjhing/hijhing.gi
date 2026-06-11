const fs = require('fs');
const s1 = fs.readFileSync('c:/Users/user/Desktop/sonjhing.github.io/s1py.md', 'utf8');
const s2 = fs.readFileSync('c:/Users/user/Desktop/sonjhing.github.io/s2py.md', 'utf8');
let html = fs.readFileSync('c:/Users/user/Desktop/sonjhing.github.io/s1py.html', 'utf8');

// Replace fetch logic with reading from DOM
const newScript = `
    async function loadFile(filename) {
      const editorContent = document.getElementById('editor-content');
      document.getElementById('status-filename').textContent = filename;
      
      let text = '';
      if (filename === 's1py.md') text = document.getElementById('raw-s1').value;
      else if (filename === 's2py.md') text = document.getElementById('raw-s2').value;
      else text = '// Content not available offline for ' + filename;
      
      const result = renderMarkdownAsCode(text);
      editorContent.innerHTML = result.html;
      document.getElementById('status-lines').textContent = result.lineCount;
    }
`;

html = html.replace(/async function loadFile\(filename\) \{[\s\S]*?\}\n\n    function activateFile/, newScript + '\n\n    function activateFile');

const textareas = `<textarea id="raw-s1" style="display:none;">${s1.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</textarea>
<textarea id="raw-s2" style="display:none;">${s2.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</textarea>\n</body>`;

html = html.replace('</body>', textareas);
fs.writeFileSync('c:/Users/user/Desktop/sonjhing.github.io/s1py.html', html);
console.log('Fixed s1py.html to use embedded content');
