import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Clean dist directory
console.log('Cleaning dist directory...');
if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true });
}
fs.mkdirSync('dist');

// Build main AIDA app
console.log('\nBuilding main AIDA app...');
execSync('vite build', { stdio: 'inherit' });

// Build niche analyzer
console.log('\nBuilding niche analyzer...');
process.chdir('niche-analyzer');
execSync('vite build', { stdio: 'inherit' });
process.chdir('..');

// Build affiliate marketing calculator
console.log('\nBuilding affiliate marketing calculator...');
process.chdir('affiliate-marketing-calculator');
execSync('vite build', { stdio: 'inherit' });
process.chdir('..');

// Copy 404 page to dist
console.log('\nCopying 404 page...');
fs.copyFileSync('public/404.html', 'dist/404.html');

// Create _headers file for Netlify
console.log('\nCreating _headers file...');
const headersContent = `/*
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin

/*.js
  Content-Type: application/javascript; charset=utf-8

/*.css
  Content-Type: text/css; charset=utf-8

/assets/*
  Cache-Control: public, max-age=31536000

/niche-analyzer/assets/*
  Cache-Control: public, max-age=31536000

/affiliate-marketing-calculator/assets/*
  Cache-Control: public, max-age=31536000`;

fs.writeFileSync(path.join('dist', '_headers'), headersContent);

// List the contents of all build directories
console.log('\nBuild complete! Directory structure:');
execSync('ls -la dist/', { stdio: 'inherit' });
execSync('ls -la dist/niche-analyzer/', { stdio: 'inherit' });
execSync('ls -la dist/affiliate-marketing-calculator/', { stdio: 'inherit' });

// Verify assets
console.log('\nVerifying assets:');
execSync('ls -la dist/assets/', { stdio: 'inherit' });
execSync('ls -la dist/niche-analyzer/assets/', { stdio: 'inherit' });
execSync('ls -la dist/affiliate-marketing-calculator/assets/', { stdio: 'inherit' });
