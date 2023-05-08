module.exports = {
  apps: [{
    script: 'dist/app.js',
    watch: '.',
    env: {
      NODE_ENV: 'development',
    }
  }]
}
