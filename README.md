# PsychoDiagnostic — static site

A simple, responsive one-page website inspired by a psychodiagnostic landing page.

## Structure

- index.html — content and layout
- styles.css — styles and responsive rules
- script.js — interactions (mobile menu, accordion, validation)

## Local preview

Open `index.html` in your browser.

Or start a tiny local server:

```bash
python3 -m http.server 5173
# then open http://localhost:5173
```

## Deploy

- GitHub Pages: push this folder as a repo, enable Pages (root)
- Netlify: drag-and-drop the folder or connect repository
- Vercel: import as static project, output directory is the project root
- GitHub Actions → SFTP/SSH deploy to hosting (adm.tools)

### CI/CD to hosting (SFTP/SSH)

This repo contains `.github/workflows/deploy.yml` that uploads files to your server on each push to `main`.

Add repository Secrets in GitHub → Settings → Secrets and variables → Actions:

- `SFTP_HOST` = `toyarik.ftp.tools`
- `SFTP_PORT` = `22`
- `SFTP_USERNAME` = `toyarik`
- `SFTP_PASSWORD` = your SFTP/SSH password (or app password)
- `SMTP_PASSWORD` = your email/SMTP password for contact form
- `SFTP_REMOTE_DIR` = absolute path to site root on the server, e.g. `/home/toyarik/psychodiagnostic.online/www`

Then push to `main` to trigger deploy. You can also run it manually via `Actions → Deploy to server via SCP`.

## Troubleshooting

### Authentication Issues
If deployment fails with authentication errors:

1. **Check GitHub Secrets** - Ensure all required secrets are set:
   - `SFTP_HOST` = `toyarik.ftp.tools`
   - `SFTP_PORT` = `22`
   - `SFTP_USERNAME` = `toyarik`
   - `SFTP_PASSWORD` = your SFTP/SSH password
   - `SMTP_PASSWORD` = your email password

2. **Test Connection Manually:**
   ```bash
   ./deploy-simple.sh
   ```

3. **Server Requirements:**
   - SSH service must be running
   - Password authentication must be enabled
   - No firewall blocking SSH (port 22)

### Alternative Deployment
If automated deployment fails, use:
```bash
./deploy-simple.sh
```

## Notes

- The contact form demonstrates client-side validation only.
- Replace email/phone with your real contacts.
