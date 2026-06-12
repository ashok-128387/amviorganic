#!/bin/bash
cd /var/www/amvi
git pull origin main
npm run build
pm2 restart amvi
echo "✅ Deploy complete"
