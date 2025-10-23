const fs = require('fs');
const path = require('path');

console.log('🔧 Enabling contact API permissions...');

// This script will be run manually to configure permissions
// Instructions for manual configuration:
console.log(`
📋 Manual Configuration Steps:

1. Open your browser and go to: http://localhost:1337/admin
2. Log in to the Strapi admin panel
3. Navigate to: Settings > Users & Permissions Plugin > Roles
4. Click on "Public" role
5. Scroll down to find "Contact" in the permissions list
6. Check the "create" permission for Contact
7. Click "Save" at the top right

Alternatively, you can run this SQL query directly on your database:

INSERT INTO up_permissions (action, subject, properties, conditions, role, created_at, updated_at) 
VALUES ('api::contact.contact.create', NULL, '{}', '[]', 
  (SELECT id FROM up_roles WHERE type = 'public'), 
  datetime('now'), datetime('now'));

🎯 After enabling permissions, test the API with:
curl -X POST http://localhost:1337/api/contacts \\
  -H "Content-Type: application/json" \\
  -d '{"data":{"name":"Test","email":"test@example.com","subject":"Test","message":"Test message","formType":"consultation"}}'
`);

console.log('✅ Instructions provided above');