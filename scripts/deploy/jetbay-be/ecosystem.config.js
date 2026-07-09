// PM2 — Jet-Bay Backend (production)
// cwd: /var/www/jetbay-be

module.exports = {
  apps: [
    {
      name: 'jetbay-be',
      script: './dist/src/main.js',
      cwd: '/var/www/jetbay-be',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_restarts: 10,
      min_uptime: '10s',
      restart_delay: 5000,
      max_memory_restart: '768M',
      node_args: '--max-old-space-size=768',
      env: {
        NODE_ENV: 'production',
      },
      error_file: '/var/www/jetbay-be/logs/pm2-error.log',
      out_file: '/var/www/jetbay-be/logs/pm2-out.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
};
