Server notes

- Endpoint: POST /api/contact

  - body: { name, email, message }
  - returns 200 { ok: true } on success

- Configure SMTP via environment variables:

  - SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_EMAIL

- Start: `npm run start` (or `npm run dev` for nodemon)
