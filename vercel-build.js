import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('Starting Vercel build process...');

// Navigate to the backend directory
process.chdir(path.join(process.cwd(), 'backend'));

// Install dependencies
console.log('Installing dependencies...');
execSync('npm ci', { stdio: 'inherit' });

// Generate Prisma client
console.log('Generating Prisma client...');
execSync('npx prisma generate', { stdio: 'inherit' });

// Build the application
console.log('Building the application...');
execSync('npm run build', { stdio: 'inherit' });

console.log('Build completed successfully!');
