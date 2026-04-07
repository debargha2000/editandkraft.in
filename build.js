#!/usr/bin/env node

/**
 * Build wrapper that suppresses warnings and Rolldown compatibility errors
 */

import { spawn } from 'child_process';
import { env } from 'process';

const vite = spawn('vite', ['build'], {
  stdio: ['inherit', 'pipe', 'pipe'],
  shell: process.platform === 'win32',
  env: { ...env, NODE_NO_WARNINGS: '1' }
});

const filterLine = (line) => {
  // Filter Node.js deprecation warnings
  if (line.includes('[DEP0190] DeprecationWarning')) return false;
  if (line.includes('Passing args to a child process')) return false;
  if (line.includes('Use `node --trace-deprecation')) return false;
  
  // Filter vite-plugin-pwa Rolldown warnings
  if (line.includes('[plugin vite-plugin-pwa:build] Error')) return false;
  if (line.includes('This is discouraged by Rollup')) return false;
  if (line.includes('rollupjs.org/plugin-development')) return false;
  if (line.includes('at Object.set')) return false;
  if (line.includes('at _generateBundle')) return false;
  if (line.includes('bindingify-input-options')) return false;
  
  return true;
};

vite.stdout.on('data', (data) => {
  const lines = data.toString().split('\n');
  const filtered = lines.filter(filterLine).join('\n');
  if (filtered.trim()) process.stdout.write(filtered + '\n');
});

vite.stderr.on('data', (data) => {
  const lines = data.toString().split('\n');
  const filtered = lines.filter(filterLine).join('\n');
  if (filtered.trim()) process.stderr.write(filtered + '\n');
});

vite.on('close', (code) => process.exit(code || 0));
