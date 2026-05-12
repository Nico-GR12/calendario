// Script de prueba para verificar la API
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/reservas',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);

  res.on('data', (chunk) => {
    console.log('Data:', chunk.toString());
  });

  res.on('end', () => {
    console.log('Response ended');
  });
});

req.on('error', (e) => {
  console.error(`Error: ${e.message}`);
});

req.end();