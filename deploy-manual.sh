#!/bin/bash

# Manual deployment script for psychodiagnostic-site
# Usage: ./deploy-manual.sh

echo "=== Manual Deployment Script ==="
echo "Deploying to psychodiagnostic.online"
echo ""

# Configuration
SFTP_HOST="toyarik.ftp.tools"
SFTP_PORT="22"
SFTP_USER="toyarik"
REMOTE_DIR="/home/toyarik/www/psychodiagnostic.online/"
LOCAL_DIR="."

echo "Configuration:"
echo "Host: $SFTP_HOST:$SFTP_PORT"
echo "User: $SFTP_USER"
echo "Remote directory: $REMOTE_DIR"
echo ""

# Check if files exist
if [ ! -f "index.html" ]; then
    echo "Error: index.html not found. Run this script from the project root."
    exit 1
fi

# Create tar archive
echo "Creating deployment archive..."
tar -czf deploy.tar.gz \
    --exclude='.git' \
    --exclude='.github' \
    --exclude='deploy-manual.sh' \
    --exclude='README.md' \
    --exclude='psychodiagnostic-site.zip' \
    --exclude='*.log' \
    --exclude='.DS_Store' \
    --exclude='config.php' \
    --exclude='config.php.example' \
    .

echo "Archive created: deploy.tar.gz"
echo ""

# Deploy via SCP
echo "Starting deployment..."
echo "Enter your SFTP/SSH password when prompted:"
scp -P $SFTP_PORT deploy.tar.gz $SFTP_USER@$SFTP_HOST:$REMOTE_DIR/

if [ $? -eq 0 ]; then
    echo "✅ File uploaded successfully!"
    echo ""
    echo "Next steps on server:"
    echo "1. SSH to server: ssh $SFTP_USER@$SFTP_HOST -p $SFTP_PORT"
    echo "2. Extract files: cd $REMOTE_DIR && tar -xzf deploy.tar.gz"
    echo "3. Create config.php with correct credentials"
    echo "4. Set proper permissions: chmod 644 *.php *.html *.css *.js"
    echo "5. Clean up: rm deploy.tar.gz"
else
    echo "❌ Upload failed!"
    echo ""
    echo "Alternative: Upload files manually via FTP/SFTP client"
    echo "- Host: $SFTP_HOST"
    echo "- Port: $SFTP_PORT"
    echo "- User: $SFTP_USER"
    echo "- Directory: $REMOTE_DIR"
fi

# Cleanup
rm deploy.tar.gz
echo "Local cleanup completed."
