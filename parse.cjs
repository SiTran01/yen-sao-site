const fs = require('fs'); 
const content = fs.readFileSync('C:\\Users\\quocs\\.gemini\\antigravity\\brain\\6ce517f0-ae17-47f8-b0b2-891dd121b1d1\\.system_generated\\steps\\1109\\content.md', 'utf-8'); 
const urls = content.match(/https:\/\/[\w.-]+\/(?:[^\"\s]+)?/g);
if (urls) {
  const uniqueUrls = [...new Set(urls)].filter(u => u.includes('googleusercontent.com') || u.includes('sitesv-images-rt'));
  console.log(uniqueUrls.join('\n'));
}
console.log(text);
