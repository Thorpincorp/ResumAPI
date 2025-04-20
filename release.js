#!/usr/bin/env node
/* eslint-disable no-console */

const { exec } = require('node:child_process');
const util = require('node:util');
// const path = require('path');
// const fs = require('fs');
// const readline = require('readline');
const { Command } = require('commander');
const execPromise = util.promisify(exec);

const validTypes = ['major', 'minor', 'patch', 'alpha'];

// function askConfirmation(question) {
//   return new Promise((resolve) => {
//     const rl = readline.createInterface({
//       input: process.stdin,
//       output: process.stdout,
//     });

//     rl.question(question, (answer) => {
//       rl.close();
//       resolve(answer.toLowerCase() === 'y');
//     });
//   });
// }

async function handleRelease(type, { releaseNotes }) {
  if (!validTypes.includes(type)) {
    console.error(`❌ Invalid release type: ${type}`);
    console.error(`Valid types are: ${validTypes.join(', ')}`);
    process.exit(1);
  }

  try {
    console.log(`Releasing '${type}' version...`);

    let command = `npx commit-and-tag-version ${type}`;

    if (type === 'alpha') {
      // Skip release notes generation for alpha
      command += ' --release-as prerelease --prerelease-id alpha --skip.changelog';
    }

    // Execute the release command
    await execPromise(command);

    // Push tags and commits to remote
    console.log('📤 Pushing changes to origin...');
    // await execPromise('git push --atomic --no-verify --follow-tags origin main');

    console.log('✅ Release completed!');
  } catch (error) {
    console.error('❌ Release failed:', error.message);
    process.exit(1);
  }
}

const program = new Command();

program
  .command('release')
  .description('Release a new version of the software')
  .argument('<type>', 'release version type (major, minor, patch, alpha)')
  // .option('--release-notes', 'Generate release notes')
  .action(handleRelease);

program.parse(process.argv);
