const fs = require('fs');
const path = require('path');

console.log('🔍 Checking home content type registration...');

// Check if home API directory exists
const homeApiPath = path.join(__dirname, 'src/api/home');
console.log('Home API directory exists:', fs.existsSync(homeApiPath));

// Check schema file
const schemaPath = path.join(homeApiPath, 'content-types/home/schema.json');
console.log('Schema file exists:', fs.existsSync(schemaPath));

if (fs.existsSync(schemaPath)) {
  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
  console.log('Schema kind:', schema.kind);
  console.log('Schema info:', schema.info);
}

// Check routes file
const routesPath = path.join(homeApiPath, 'routes/home.js');
console.log('Routes file exists:', fs.existsSync(routesPath));

if (fs.existsSync(routesPath)) {
  console.log('Routes file content:');
  console.log(fs.readFileSync(routesPath, 'utf8'));
}

// List all API directories
const apiPath = path.join(__dirname, 'src/api');
const apiDirs = fs.readdirSync(apiPath);
console.log('All API directories:', apiDirs);