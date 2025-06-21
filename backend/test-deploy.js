console.log('=== Deployment Test ===');
console.log('Current working directory:', process.cwd());
console.log('__dirname:', __dirname);
console.log('File structure test:');
console.log('- package.json exists:', require('fs').existsSync('./package.json'));
console.log('- src/index.js exists:', require('fs').existsSync('./src/index.js'));
console.log('=== Test Complete ==='); 