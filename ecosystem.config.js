module.exports = {
  apps : [{
    name: "app-optica",
    script: "./server/index.js",
    max_memory_restar: '1000M',
    env: {
      NODE_ENV: "development",
      PORT: "3000",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}
