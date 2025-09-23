#!/bin/bash

# Production deployment script using FTP
# Usage: FTP_REMOTE_DIR=/path PASSWORDFTP=password USERFTP=username FTPSERVER=server FTPPORT=21 ./deploy-prod.sh

set -e

echo "🚀 Starting production deployment via FTP..."

# Check if required environment variables are set
if [ -z "$FTP_REMOTE_DIR" ] || [ -z "$PASSWORDFTP" ] || [ -z "$USERFTP" ] || [ -z "$FTPSERVER" ] || [ -z "$FTPPORT" ]; then
    echo "❌ Error: Missing required environment variables!"
    echo "Required: FTP_REMOTE_DIR, PASSWORDFTP, USERFTP, FTPSERVER, FTPPORT"
    echo "Usage: FTP_REMOTE_DIR=/path PASSWORDFTP=password USERFTP=username FTPSERVER=server FTPPORT=21 $0"
    exit 1
fi

echo "📋 Configuration:"
echo "  Server: $FTPSERVER:$FTPPORT"
echo "  User: $USERFTP"
echo "  Remote dir: $FTP_REMOTE_DIR"

# Create FTP batch file
cat > ftp_batch.txt << EOF
open $FTPSERVER $FTPPORT
user $USERFTP $PASSWORDFTP
cd $FTP_REMOTE_DIR
pwd
ls -la
mdelete *
mput *
bye
EOF

echo "📤 Uploading files via FTP..."
ftp -n < ftp_batch.txt

# Cleanup
rm ftp_batch.txt

echo "✅ Production deployment completed successfully!"
echo "🌐 Site should be available at your production URL"
