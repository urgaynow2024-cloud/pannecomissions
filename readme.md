# Panne Commissions

**Panne Commissions** is a VRChat avatar commission website for **pannecomissions.shop**.

The site is mainly used to showcase Panne's work, give potential clients somewhere to look through previous avatars, and provide an easy way to send a commission enquiry.

The design is built around a **black and purple** colour scheme with the avatar work being the main focus of the site.

## What Panne Offers

Panne works primarily with VRChat avatars and can take on different types of avatar work depending on the project.

Current services include:

* Clothing additions
* Avatar customisation
* Complete avatars assembled from premade assets
* Avatar toggles
* Outfit and accessory options
* Custom textures
* Blender work
* Unity setup
* More advanced modelling work depending on the project

Not every project is the same, so the final price depends on what actually needs to be done.

## Pricing

Current price ranges:

| Service          | Price    |
| ---------------- | -------- |
| Textures         | $5–$25   |
| Complete Avatars | $55–$100 |
| Models           | $65–$150 |

These are not fixed prices for every possible commission. A more complicated project may cost more depending on the amount of work involved.

### Asset Costs

Paid assets are **not included** in the commission price.

If an avatar needs an asset that has to be purchased, the cost of that asset is added separately to the commission.

Any assets used for a commission must also be used in accordance with the original creator's terms.

## Payment

Panne's preferred payment method is **Cash App**.

**PayPal** is also available.

Payment details are agreed upon before work starts.

### Trades

Art trades may be considered on a case-by-case basis.

Other trades may also be considered, including things such as FBT equipment or other useful VRChat-related items.

Trades are not guaranteed to be accepted. Panne decides whether a proposed trade is suitable for the requested work.

## Portfolio

The portfolio is where Panne's previous VRChat work is showcased.

The goal is to keep this section simple and let the actual work speak for itself rather than filling the page with unnecessary information.

Portfolio content is managed through the admin side of the website.

Images are stored separately from the database, while the database keeps track of the portfolio information and image URLs.

## Reviews

Clients can leave a review after their commission.

New reviews are kept private until they have been checked and approved.

Once approved, they can appear on the public reviews page.

The review system supports:

* Client name
* Rating
* Review text
* Pending reviews
* Approved reviews
* Review management

## Commission Enquiries

The main purpose of the site is making it easy for someone to start a commission.

The commission form asks for:

* Name
* Email
* Service
* Description of the requested work

When someone submits the form, the commission is saved and a notification is sent to the private Discord webhook.

The email address is kept with the submission so Panne can contact the client about their request.

### Commission Flow

```text
Client
   │
   ▼
Commission Form
   │
   ▼
Server
   │
   ├──► Save commission
   │        │
   │        ▼
   │     Database
   │
   ├──► Discord notification
   │
   └──► Email notification
```

The Discord notification is not handled by the browser. The webhook is called from the server so the webhook URL stays private.

## Support

There is also a separate support page for people who already have a commission or need help with something related to the site or their work.

Support requests can include:

* Questions about an existing commission
* Problems with a delivered avatar
* Commission issues
* Website problems
* General questions

Support submissions are kept private and can also notify Panne through Discord.

## NSFW

The site has a separate **18+ NSFW section** for adult VRChat avatar work.

NSFW content is kept separate from the normal portfolio.

The NSFW page uses an age gate before adult portfolio content is displayed.

The NSFW section can have its own:

* Portfolio
* Commission examples
* Pricing
* Project information

NSFW portfolio images should never appear in the normal SFW portfolio.

NSFW commission enquiries use the same commission system as normal enquiries, while being clearly identified as NSFW in private notifications.

## Admin

The website has a private admin area for managing the content on the site.

The admin area is used for things such as:

### Portfolio

* Uploading work
* Removing work
* Reordering portfolio items
* Updating portfolio information

### Reviews

* Viewing new reviews
* Approving reviews
* Rejecting reviews
* Editing reviews
* Removing reviews

### Commissions

* Viewing incoming enquiries
* Checking the client's email
* Viewing the requested service
* Reading the commission description
* Updating the status of an enquiry

### Support

* Viewing support requests
* Reading client messages
* Managing support requests

### NSFW Portfolio

* Uploading NSFW work
* Removing NSFW work
* Reordering NSFW work
* Managing NSFW portfolio content

## Data & Storage

The website is hosted on **Vercel**.

The project currently uses **Supabase PostgreSQL** for its database.

Portfolio and other uploaded images are stored separately from the database.

The database is used for things such as:

* Commission enquiries
* Client email addresses
* Reviews
* Portfolio information
* Support requests
* Website settings
* Admin data

The actual image files are handled through storage rather than being placed directly into PostgreSQL.

## Environment Variables

The production environment uses the following variables:

```env
DATABASE_URL=...
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

ADMIN_PASSWORD=...

RESEND_API_KEY=...

DISCORD_WEBHOOK_URL=...

NEXT_PUBLIC_SITE_URL=https://pannecomissions.shop
```

The actual values belong in Vercel's environment variable settings and should never be committed to the repository.

### Local Development

For local development, create:

```text
.env.local
```

and add the required environment variables there.

Do not commit `.env.local`.

## Discord Notifications

Discord is used for private website notifications.

Notifications can be sent for:

* New commission enquiries
* New NSFW commission enquiries
* New reviews
* New support requests

Commission notifications should include enough information for Panne to know what has been submitted without needing to immediately open the admin panel.

For example:

```text
New Commission

Client: Example Name
Email: example@email.com
Service: Complete Avatar

Description:
Client's commission description here.

Status: Pending
```

The Discord webhook is a server-side secret.

It must not be exposed through client-side code or a `NEXT_PUBLIC_` variable.

## Email

The site uses **Resend** for email-related functionality.

Email is handled server-side.

The Resend API key is stored as an environment variable and is never sent to the browser.

## Tech Stack

* **Next.js**
* **React**
* **TypeScript**
* **Tailwind CSS**
* **Supabase PostgreSQL**
* **Vercel**
* **Resend**
* **Discord Webhooks**
* **Lucide React**

## Project Layout

```text
src/
├── app/
│   ├── page.tsx
│   ├── portfolio/
│   ├── reviews/
│   ├── contact/
│   ├── support/
│   ├── nsfw/
│   ├── admin/
│   └── api/
│
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── Portfolio.tsx
│   ├── Reviews.tsx
│   ├── CommissionForm.tsx
│   ├── ContactForm.tsx
│   ├── SupportForm.tsx
│   └── AgeVerifier.tsx
│
├── lib/
│   ├── supabase.ts
│   ├── auth.ts
│   ├── email.ts
│   └── discord.ts
│
└── styles/
    └── globals.css

supabase/
└── schema.sql
```

The exact files may change as the site develops. The important separation is between the public pages, admin tools, server-side API routes, and database/storage helpers.

## Design

Panne Commissions uses a **black and purple** theme throughout the site.

The design should stay consistent across the homepage, portfolio, reviews, contact, support, admin, and NSFW areas.

### Main visual direction

* Black / very dark backgrounds
* Purple primary accent
* Purple glow used sparingly
* Dark cards
* Subtle borders
* Rounded corners
* Clean text
* Simple animations
* Responsive layouts
* Large artwork
* Clear buttons
* Good spacing

Purple should be an accent rather than taking over the entire page.

The avatar artwork should always be the thing that stands out most.

## Security

There are several private values used by the site.

These must never be exposed publicly:

```text
DATABASE_URL
SUPABASE_SERVICE_ROLE_KEY
ADMIN_PASSWORD
RESEND_API_KEY
DISCORD_WEBHOOK_URL
```

The Supabase service-role key is especially important because it has elevated database permissions.

### Admin

Admin actions must be checked on the server.

The admin password should not be hardcoded into a page or React component.

### Database

Database operations that require elevated permissions must happen server-side.

The service-role key must never be included in client-side code.

### Client Information

Commission enquiries contain personal information, including email addresses.

That information should only be available to the people managing Panne Commissions.

It should never be returned through a public API or displayed on the public website.

### Uploads

Uploaded files should be checked before being accepted.

The server should validate file type and file size rather than trusting information supplied by the browser.

## Running Locally

Install the dependencies:

```bash
npm install
```

Create the local environment file:

```bash
cp .env.example .env.local
```

Add the required environment variables.

Start the development server:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Building

To create a production build:

```bash
npm run build
```

To run the production build locally:

```bash
npm run start
```

## Deployment

The production site runs on **Vercel**.

The production domain is:

**https://pannecomissions.shop**

The basic setup is:

```text
Panne Commissions
       │
       ▼
     Vercel
       │
       ├───────────────┐
       ▼               ▼
   Next.js          API Routes
                       │
              ┌────────┼────────┐
              ▼        ▼        ▼
          Supabase   Resend   Discord
          Database    Email    Webhook
```

### Vercel Environment Variables

The following variables need to be configured in the Vercel project:

```text
DATABASE_URL
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
ADMIN_PASSWORD
RESEND_API_KEY
DISCORD_WEBHOOK_URL
NEXT_PUBLIC_SITE_URL
```

After changing production environment variables, the project needs to be redeployed for the new values to be available to the deployment.

## Important

A few things should stay true as the project is developed:

* Don't put secrets in the frontend.
* Don't commit `.env.local`.
* Don't expose the Supabase service-role key.
* Don't expose the Discord webhook.
* Don't hardcode the admin password.
* Keep commission submissions private.
* Keep client email addresses private.
* Keep NSFW content separate from the normal portfolio.
* Don't show pending reviews publicly.
* Validate uploads server-side.
* Keep the website focused on Panne's actual work.

## Website

**Panne Commissions**

https://www.pannecomissions.shop/

VRChat avatar commissions, customisation, clothing additions, complete avatar setups, toggles, textures, and other avatar work.
