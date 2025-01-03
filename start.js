const { spawn } = require('child_process');

// Start Angular app
const angular = spawn('ng', ['serve'], {
  stdio: 'inherit',
  shell: true, // Ensures compatibility across platforms
});

// Start Node.js backend using nodemon
const backend = spawn('npx', ['nodemon', 'backend/server.js'], {
  stdio: 'inherit',
  shell: true,
});

// Handle Angular process close
angular.on('close', (code) => {
  console.log(`Angular process exited with code ${code}`);
  process.exit(code); // Exit if Angular process stops
});

// Handle backend process close
backend.on('close', (code) => {
  console.log(`Backend process exited with code ${code}`);
  process.exit(code); // Exit if backend process stops
});
