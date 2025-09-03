Rhema Health Care — static demo site

This is a small static website scaffold for a UK healthcare provider called "Rhema Health Care".

What’s included

- index.html — Home
- about.html — About
- services.html — Services
- contact.html — Contact (client-side validation only)
- privacy.html — Privacy
- 404.html — Not found
- assets/css/styles.css — small custom CSS
- assets/js/app.js — mobile nav toggle and contact form demo logic

How to view

1. Open the project folder in your file manager.
2. Open `index.html` in a browser (double-click or right-click -> Open with).

Notes

- Tailwind CSS is loaded from CDN (no build step required). For production, consider installing and building Tailwind to purge unused styles.
- The contact form is client-side only and does not send emails. Wire it to your backend or an email provider for production.

Added features

- Node/Express server with `/api/contact` endpoint (uses nodemailer). See `server/index.js`.
- Tailwind build setup (Tailwind CLI). Source CSS in `src/styles.css`. Run `npm run build:css` to produce `assets/css/styles.css`.
- robots.txt and sitemap.xml placed at project root.
- Favicons and simple SVG logo in `assets/icons`.

Run locally (development)

1. Install dependencies:

```bash
# from project root
npm install
```

2. Set environment variables for email (example):

```bash
export SMTP_HOST=smtp.example.com
export SMTP_PORT=587
export SMTP_USER=you@example.com
export SMTP_PASS=yourpassword
export CONTACT_EMAIL=info@rhemacares.uk
```

3. Build Tailwind CSS (optional during development if you prefer local CSS instead of CDN):

```bash
npm run build:css
```

4. Start server:

```bash
npm run start
```

Open http://localhost:3000

Security note: Do not commit real SMTP credentials. Use environment variables or a secret manager in production.

Next steps you might want me to do

- Add a build setup with Tailwind CLI or Vite
- Add SVG assets, sitemap and SEO meta tags
- Add simple accessibility audit and fixes
- Create a small Node/Express endpoint to accept contact form submissions

If you want any of the above, tell me which and I’ll implement it.

Accessibility and CI

- Run the programmatic axe-core scan locally (requires Chrome/Chromium):

  1.  Install dev dependencies: `npm ci`
  2.  Start the local server: `npm run start`
  3.  Run the axe scan: `npm run a11y:axe`

- CI now contains a Node matrix and caches npm; it runs HTMLHint, multiple pa11y checks and the axe script.

# rhemacare

# rhemacare

# rhemacare

# rhemacare
