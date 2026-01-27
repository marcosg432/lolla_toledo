module.exports = {
  apps: [{
    name: 'lolla-toledo',
    script: 'npm',
    args: 'run start',
    env: { PORT: 3001 },
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
  }],
};
