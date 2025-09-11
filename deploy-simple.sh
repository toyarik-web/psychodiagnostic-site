#!/bin/bash

# Simple deployment script for psychodiagnostic-site
# Usage: ./deploy-simple.sh

echo "=== Simple Deployment Script ==="
echo "Deploying to psychodiagnostic.online"
echo ""

# Configuration
SFTP_HOST="toyarik.ftp.tools"
SFTP_PORT="22"
SFTP_USER="toyarik"
REMOTE_DIR="/home/toyarik/psychodiagnostic.online/www"

echo "Configuration:"
echo "Host: $SFTP_HOST:$SFTP_PORT"
echo "User: $SFTP_USER"
echo "Remote directory: $REMOTE_DIR"
echo ""

# Test connection first
echo "Testing connection..."
ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no -p $SFTP_PORT $SFTP_USER@$SFTP_HOST "echo 'Connection successful!'"

if [ $? -ne 0 ]; then
    echo "❌ Connection failed!"
    echo ""
    echo "Please check:"
    echo "1. Your SSH password is correct"
    echo "2. Server allows password authentication"
    echo "3. No firewall blocking the connection"
    echo "4. SSH service is running on the server"
    exit 1
fi

echo "✅ Connection successful!"
echo ""

# Create deployment package
echo "Creating deployment package..."
tar -czf deploy.tar.gz \
    --exclude='.git' \
    --exclude='.github' \
    --exclude='deploy-*.sh' \
    --exclude='README.md' \
    --exclude='psychodiagnostic-site.zip' \
    --exclude='*.log' \
    --exclude='.DS_Store' \
    --exclude='config.php' \
    --exclude='config.php.example' \
    .

echo "Package created: deploy.tar.gz"
echo ""

# Upload and extract
echo "Uploading package..."
scp -P $SFTP_PORT deploy.tar.gz $SFTP_USER@$SFTP_HOST:$REMOTE_DIR/

if [ $? -eq 0 ]; then
    echo "✅ Upload successful!"
    echo ""

    # Extract on server
    echo "Extracting on server..."
    ssh -p $SFTP_PORT $SFTP_USER@$SFTP_HOST << EOF
cd $REMOTE_DIR
echo "Current directory: \$(pwd)"
echo "Extracting files..."
tar -xzf deploy.tar.gz
echo "Files extracted successfully!"
ls -la | head -10
echo ""
echo "Creating config.php..."
cat > config.php << 'EOL'
<?php
return [
  'host' => 'mail.adm.tools',
  'port' => 587,
  'secure' => 'tls',
  'username' => 'info@psychodiagnostic.online',
  'password' => 'ВАШ_ПАРОЛЬ_ТУТ',
  'from_email' => 'info@psychodiagnostic.online',
  'from_name' => 'PsychoDiagnostic'
];
EOL
echo "config.php created!"
echo ""
echo "Setting permissions..."
chmod 644 *.php *.html *.css *.js
echo "Permissions set!"
echo ""
echo "Cleaning up..."
rm deploy.tar.gz
echo "✅ Deployment completed successfully!"
EOF

else
    echo "❌ Upload failed!"
    exit 1
fi

# Cleanup local
rm deploy.tar.gz
echo "Local cleanup completed."
