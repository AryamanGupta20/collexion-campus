# Collexion Campus

A semester project for students moving into college and tech degrees.

Includes the Midnight Observatory welcome/login, Hologram Lab student dashboard, and admin dashboard. Five areas: College Courses, Social & Confidence, Entrepreneurship, Student Money, and Service Studio.

## Run on your computer

Install Node.js 24 or later, then run:

```
node server/local.mjs
```

Open http://127.0.0.1:4173 and keep the terminal open. No npm packages are needed for this version.

Create an account using your email and a password of at least 10 characters. Save the recovery code shown after signup. Email delivery and email verification are not configured.

## Admin

The project owner's email is reserved for admin signup. The private setup code is printed in the local terminal. Never commit that code, passwords, database files or student uploads. Admins can see account details, login counts and help requests. Private expenses and private portfolios are not included in the admin dashboard.

## Data

Local SQLite records and uploads are stored in `.campus-data/`. Back up the whole directory. It is excluded from Git. Do not deploy this local SQLite version on a host that deletes its disk on restart.

## Checks

```
node tests/api.test.mjs
node tests/screens.test.cjs
node tests/admin-screens.test.cjs
```

API tests use real in-memory SQLite. Screen tests use a DOM stub; they are not browser visual tests.

## Current status

Source uploaded for deployment preparation. Not a confirmed live website. Hosting, production storage and browser checks still need to be completed. A GitHub repository URL is not the application URL.

The course material is a general guide with curated external video links, not a verified university-specific syllabus. The WhatsApp link opens a channel, not a discussion group. Portfolios are private unless students choose to share them.

## Free Cloudflare deployment

[Deploy to Cloudflare](https://deploy.workers.cloudflare.com/?url=https://github.com/AryamanGupta20/Collection-Campus)

Sign in to Cloudflare, stay on the Free plan, and connect GitHub. The deployment flow creates a repository copy and a D1 database. Choose your own private ADMIN_SETUP_TOKEN in the secret field. Never paste it into a public file or chat. The placeholder database ID is replaced by Cloudflare during resource setup.

Use the default deploy command from package.json. It applies the database migrations and then publishes the Worker and page assets. After deployment, open the workers.dev URL Cloudflare returns. Create the admin account using the reserved owner email, your own password, and the private setup code.

The free deployment stores small attachments in D1 along with accounts. Each file is limited to 1 MB; no paid R2 subscription is required. D1 Free currently limits each database to 500 MB and has daily usage limits. If a free limit is reached, service can become unavailable; this configuration does not opt into a paid plan. This is intended for a small class project. Monitor database use and keep backups.

Official setup reference: https://developers.cloudflare.com/workers/platform/deploy-buttons/
Free database limits: https://developers.cloudflare.com/d1/platform/limits/

Deployment has not yet been verified. Before sharing widely, test registration, login, admin-only access, a file upload/download and saving data after logout.
