#!/usr/bin/env node

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

async function checkContentTypes() {
  console.log('🔍 Checking registered content types in database...\n');
  
  const dbPath = path.join(__dirname, '../.tmp/data.db');
  const db = new sqlite3.Database(dbPath);
  
  try {
    // Check what tables exist
    console.log('📋 Database tables:');
    const tables = await new Promise((resolve, reject) => {
      db.all("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name", (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    
    tables.forEach(table => {
      console.log(`  - ${table.name}`);
    });
    
    console.log('\n🔧 Checking for content type tables:');
    const contentTypeTables = tables.filter(table => 
      table.name.includes('private_dining') || 
      table.name.includes('booking') || 
      table.name.includes('gallery') ||
      table.name.includes('payment_option')
    );
    
    if (contentTypeTables.length === 0) {
      console.log('❌ No content type tables found!');
    } else {
      contentTypeTables.forEach(table => {
        console.log(`  ✅ ${table.name}`);
      });
    }
    
    // Check permissions
    console.log('\n🔐 Checking permissions:');
    const permissions = await new Promise((resolve, reject) => {
      db.all("SELECT action FROM up_permissions WHERE action LIKE 'api::%'", (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    
    if (permissions.length === 0) {
      console.log('❌ No API permissions found!');
    } else {
      permissions.forEach(perm => {
        console.log(`  ✅ ${perm.action}`);
      });
    }
    
    // Check roles
    console.log('\n👥 Checking roles:');
    const roles = await new Promise((resolve, reject) => {
      db.all("SELECT * FROM up_roles", (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    
    roles.forEach(role => {
      console.log(`  - ${role.name} (${role.type}) - ID: ${role.id}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    db.close();
  }
}

checkContentTypes();