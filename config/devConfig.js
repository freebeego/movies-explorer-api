module.exports = {
  server: {
    port: 3003,
  },
  db: {
    host: 'localhost',
    port: 27017,
    name: 'bitfilmsdb',
  },
  jwt: {
    secretKey: 'devSecret',
    expiresIn: 3600000 * 24 * 3,
  },
  pass: {
    salt: 10,
  },
};
