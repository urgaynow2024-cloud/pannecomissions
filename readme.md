# Panne Commissions

Panne Commissions is a VRChat avatar commission service focused on avatar customisation, clothing additions, complete avatar setups, toggles, custom textures, and more advanced avatar work.

The website is available at:

**https://pannecomissions.shop**

The website is built around showcasing Panne's work and giving potential clients an easy way to view the portfolio, read reviews, submit a commission enquiry, and get support.

The entire website uses a **black and purple** colour theme, with purple used for accents, buttons, highlights, borders, glow effects, and interactive elements.

## Services

Panne offers a range of VRChat avatar services, from smaller texture work to complete avatar setups.

### Clothing Add-ons

Clothing and accessory additions for existing VRChat avatars.

This can include adding premade clothing, accessories, and other compatible assets to an avatar and setting everything up correctly.

### Complete Avatars

Complete VRChat avatars can be assembled using premade assets.

This includes putting the different parts together and configuring the finished avatar.

### Toggles & Options

Avatar toggles and other in-game options can be added to avatars.

This can include:

* Clothing toggles
* Outfit toggles
* Accessory toggles
* Avatar options
* Other requested toggle setups

### Custom Textures

Custom textures can be created for VRChat avatars.

Texture pricing depends on the complexity of the requested work.

### Models

More advanced modelling work may also be available depending on the project and budget.

Model pricing depends on the complexity of the requested work.

## Pricing

Current price ranges are:

| Service        |    Price |
| -------------- | -------: |
| Textures       |   $5–$25 |
| Entire Avatars | $55–$100 |
| Models         | $65–$150 |

Prices depend on the complexity of the work being requested.

These prices are starting ranges and the final price can change depending on what is required for the commission.

## Asset Costs

The listed commission prices **do not include the cost of assets that need to be purchased specifically for a commission**.

If a commission requires a paid asset, the cost of that asset is added to the commission total.

For example, if an avatar requires a paid clothing asset, the client will need to cover the cost of that asset in addition to the commission price.

All purchased assets must be used according to their original creator's terms and licensing.

## Payment & Trade Options

Panne accepts several different ways of paying for commissions.

### Cash App

**Cash App is the preferred payment method.**

Clients who are able to use Cash App should use it where possible.

### PayPal

**PayPal is also accepted.**

PayPal can be used if Cash App is not available or practical for the client.

Payment arrangements should be agreed upon before work begins.

### Art Trades

Art trades may also be considered.

Art trades are accepted on a **case-by-case basis** and are not guaranteed to be accepted.

The artwork being offered needs to be something Panne actually wants and considers a fair trade for the requested commission.

### Other Trades

Other trade arrangements may also be considered.

This can include things such as:

* FBT equipment
* VRChat-related items
* Other useful equipment
* Other items agreed upon by both parties

Alternative trades are considered individually and must be agreed upon before work begins.

Panne can decline any trade offer that does not make sense for the commission.

## Portfolio

The website includes a portfolio showing Panne's previous VRChat avatar work.

The portfolio is the main showcase for the service and is designed to let potential clients see the type and quality of work available before contacting Panne.

Portfolio features include:

* Avatar artwork
* Project images
* Full-size image viewing
* Project information
* Featured work
* Responsive gallery
* Mobile-friendly viewing

Portfolio images are managed through the admin dashboard.

## Reviews

Clients can submit reviews after their commission has been completed.

New reviews are stored as pending until they are checked and approved.

The review system supports:

* Client names
* Star ratings
* Review messages
* Pending reviews
* Approved reviews
* Review management

Only approved reviews are displayed publicly.

## Commission Enquiries

The website includes a dedicated commission enquiry system.

Potential clients can submit information about the work they want.

A commission submission can include:

* Client name
* Email address
* Requested service
* Commission description
* Additional information

The submission is stored privately in the database.

The client's email address allows Panne to contact them about their commission.

### Commission Notifications

Every successful commission submission is also sent to the configured Discord webhook.

The commission information is saved to the database first, then the website sends the notification.

The Discord notification can contain:

* New commission notification
* Client name
* Client email
* Requested service
* Commission description
* Submission date
* Commission ID
* Current status

The notification is sent server-side.

The Discord webhook URL is never exposed to website visitors.

## Support

The website includes a dedicated support page for existing clients and general website issues.

Support can be used for:

* Questions about an existing commission
* Problems with a delivered avatar
* Commission-related issues
* Website problems
* General questions

Support requests are stored privately and can be managed through the admin dashboard.

Support submissions can also trigger a Discord notification so Panne knows when someone needs assistance.

## Discord Notifications

The website uses a Discord webhook for private notifications.

Discord notifications are sent for important website events, including:

* New commission enquiries
* New reviews
* New support requests

### Commission Webhook

Commission enquiries are connected directly to the Discord webhook.

When a client submits a commission:

```text
Client submits commission
        ↓
Next.js API route
        ↓
Commission saved to Supabase
        ↓
Discord webhook notification
        ↓
Client receives confirmation
```

The Discord webhook should only be called from server-side code.

The webhook URL must never be included in:

* Client-side React components
* Browser JavaScript
* Public API responses
* GitHub source code
* `NEXT_PUBLIC_` environment variables

The webhook should be stored using:

```env
DISCORD_WEBHOOK_URL=your-discord-webhook-url
```

## Database

The website uses **PostgreSQL** hosted by **Supabase**.

Prisma is used as the database ORM.

The database stores the information needed to run the website, including:

* Portfolio information
* Reviews
* Commission enquiries
* Client email addresses
* Support requests
* Website settings
* Admin information

The actual image files are stored separately using Vercel Blob.

## Database Tables

### `portfolio_items`

Stores information about portfolio projects.

Information can include:

* Title
* Description
* Image URL
* Sort order
* Featured status
* Created date

### `reviews`

Stores client reviews.

Information can include:

* Client name
* Rating
* Review text
* Status
* Created date

### `commission_submissions`

Stores commission enquiries.

Information can include:

* Client name
* Client email
* Requested service
* Commission description
* Status
* Created date

### `support_requests`

Stores support enquiries.

Information can include:

* Client name
* Client email
* Message
* Status
* Created date

### `site_settings`

Stores editable website settings.

### `admin_users`

Stores administrator authentication information.

Passwords must never be stored as plain text.

## Image Storage

Portfolio images are stored using **Vercel Blob**.

The database stores the information needed to display each image, while Vercel Blob stores the actual image file.

The upload process works like this:

```text
Admin
  ↓
Admin Dashboard
  ↓
Next.js Server API
  ↓
Vercel Blob
  ↓
Image URL
  ↓
Supabase PostgreSQL
  ↓
Public Portfolio
```

This prevents large image files from being stored directly inside PostgreSQL.

## Authentication

The admin dashboard is protected using server-side authentication.

The admin password is not stored directly in the source code.

The password is provided through an environment variable:

```env
ADMIN_PASSWORD=your-secure-admin-password
```

Authentication should use:

* Server-side authentication
* Secure sessions
* HTTP-only cookies
* Secure cookies in production
* Server-side authorization checks
* Password hashing when passwords are stored in the database

Admin API routes must verify authentication before allowing protected actions.

## Admin Dashboard

The private admin dashboard allows Panne to manage the website without manually editing source code.

### Portfolio

The admin can:

* Upload images
* Delete images
* Reorder portfolio items
* Edit portfolio information
* Manage featured work

### Reviews

The admin can:

* View pending reviews
* Approve reviews
* Reject reviews
* Edit reviews
* Delete reviews

### Commissions

The admin can:

* View commission submissions
* View client information
* View client email addresses
* View requested services
* View commission descriptions
* Update commission status

### Support

The admin can:

* View support requests
* View client information
* View support messages
* Update support status
* Manage completed requests

## Environment Variables

Create a `.env.local` file in the root of the project.

```env
DATABASE_URL=your-supabase-postgresql-connection-string

SUPABASE_URL=your-supabase-project-url

SUPABASE_ANON_KEY=your-supabase-anon-key

SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

ADMIN_PASSWORD=your-secure-admin-password

DISCORD_WEBHOOK_URL=your-discord-webhook-url

NEXT_PUBLIC_SITE_URL=https://pannecomissions.shop
```

Private credentials must never be committed to GitHub.

The repository should contain:

```gitignore
.env
.env.local
.env.*.local
```

## Quick Start

Install dependencies:

```bash
npm install
```

Create the environment file:

```bash
cp .env.example .env.local
```

Add the required environment variables to `.env.local`.

Generate Prisma:

```bash
npx prisma generate
```

Run database migrations:

```bash
npx prisma migrate dev
```

Start the development server:

```bash
npm run dev
```

The website will be available at:

```text
http://localhost:3000
```

## Production

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

## Tech Stack

* **Framework:** Next.js 16
* **Language:** TypeScript
* **Frontend:** React
* **Styling:** Tailwind CSS
* **Database:** PostgreSQL
* **Database Provider:** Supabase
* **ORM:** Prisma
* **Image Storage:** Vercel Blob
* **Hosting:** Vercel
* **Notifications:** Discord Webhooks

## Project Structure

```text
src/
├── app/
│   ├── page.tsx
│   ├── portfolio/
│   │   └── page.tsx
│   ├── reviews/
│   │   └── page.tsx
│   ├── contact/
│   │   └── page.tsx
│   ├── support/
│   │   └── page.tsx
│   ├── admin/
│   │   └── page.tsx
│   └── api/
│       ├── portfolio/
│       ├── reviews/
│       ├── commissions/
│       ├── support/
│       ├── contact/
│       ├── auth/
│       ├── email/
│       └── discord/
│
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── Portfolio.tsx
│   ├── Reviews.tsx
│   ├── CommissionForm.tsx
│   ├── ContactForm.tsx
│   └── SupportForm.tsx
│
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── email.ts
│   ├── discord.ts
│   └── blob.ts
│
└── styles/
    └── globals.css

prisma/
└── schema.prisma
```

## Pages

### `/`

The main Panne Commissions homepage.

The homepage introduces the service and provides quick access to the portfolio, reviews, commission enquiries, and support.

### `/portfolio`

Displays completed VRChat avatar work.

### `/reviews`

Displays approved client reviews.

### `/contact`

Provides a general contact form for enquiries.

### `/support`

Provides a support form for existing clients and website issues.

### `/admin`

Private administration area for managing portfolio content, reviews, commissions, and support requests.

## VRChat Avatar Work

Panne Commissions is focused specifically on **VRChat avatar commissions**.

The portfolio can showcase work including:

* Avatar edits
* Avatar customisation
* Clothing
* Accessories
* Avatar assembly
* Toggles
* Custom textures
* Blender work
* Unity work
* Complete avatar setups
* Other VRChat avatar projects

The website should keep the focus on the actual avatar work and make it easy for potential clients to see what Panne can create.

## Design

The entire website uses a **black and purple colour theme**.

The design should feel modern, clean, and polished without becoming overly complicated.

### Colour Direction

**Primary background:**

Black and very dark tones.

**Accent colour:**

Purple.

Purple is used for:

* Buttons
* Links
* Highlights
* Borders
* Icons
* Hover states
* Active navigation
* Glow effects
* Important UI elements

The website should not be covered entirely in purple.

Dark backgrounds should provide the main visual foundation while purple provides the accent colour.

### Visual Style

The interface uses:

* Dark backgrounds
* Purple accents
* Subtle purple glow
* Dark cards
* Soft borders
* Rounded corners
* Clean typography
* Smooth transitions
* Subtle animations
* Large artwork
* Clear navigation
* Good spacing
* Responsive layouts

The portfolio artwork should remain the most important visual element on the site.

## Responsive Design

The website is designed for:

* Desktop
* Laptop
* Tablet
* Mobile

Portfolio images should adapt to different screen sizes without unnecessarily cropping the artwork.

Forms should remain simple and easy to use on smaller screens.

Navigation should also work properly on mobile.

## Security

Private information is handled server-side.

The following values must never be exposed to the client:

```text
DATABASE_URL
ADMIN_PASSWORD
DISCORD_WEBHOOK_URL
```

These values must remain private environment variables.

Only intentionally public values should use the `NEXT_PUBLIC_` prefix.

### Client Information

Commission submissions contain private client information such as names, email addresses, and commission details.

This information must only be available to authorized administration.

Client information must not be displayed publicly or returned through an unprotected API.

### Database Security

Prisma must only be used from server-side code.

Prisma must never be imported into client components.

### Admin Security

Admin API routes must verify the administrator's authenticated session before performing protected operations.

### Upload Security

Portfolio uploads must be validated server-side.

The server should validate:

* File type
* File size
* Authentication
* Upload request

Files should not be trusted simply because the browser reports them as valid.

## Deployment

The production website is hosted using **Vercel**.

The database is hosted using **Supabase PostgreSQL**.

Portfolio images are stored using **Vercel Blob**.

Email is handled through Discord notifications.

Discord notifications are handled through a private Discord webhook.

### Production Setup

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Create the Supabase PostgreSQL database.
4. Configure Vercel Blob.
5. Create the Discord webhook.
7. Add the production environment variables to Vercel.
8. Run the Prisma migrations.
9. Deploy the website.
10. Connect `pannecomissions.shop` to the Vercel project.

### Production Environment

```env
DATABASE_URL=supabase-postgresql-connection-string
ADMIN_PASSWORD=secure-admin-password
DISCORD_WEBHOOK_URL=discord-webhook-url
NEXT_PUBLIC_SITE_URL=https://pannecomissions.shop
```

## Data Flow

### Commission Enquiry

```text
Client
  ↓
Commission Form
  ↓
Next.js API Route
  ↓
Validate Submission
  ↓
Save to Supabase PostgreSQL
        ↓
Discord Webhook
        ↓
Client receives confirmation
```

The commission is stored in the database before notifications are sent.

This means the commission is not lost if Discord or email notification temporarily fails.

### Portfolio Upload

```text
Admin
  ↓
Admin Dashboard
  ↓
Next.js API Route
  ↓
Validate Upload
  ↓
Vercel Blob
  ↓
Image URL
  ↓
Supabase PostgreSQL
  ↓
Public Portfolio
```

### Review Submission

```text
Client
  ↓
Review Form
  ↓
Next.js API Route
  ↓
Save Review
  ↓
Pending
  ↓
Admin Approval
  ↓
Public Review
```

### Support Request

```text
Client
  ↓
Support Form
  ↓
Next.js API Route
  ↓
Save to Neon PostgreSQL
```

## Important Notes

* Panne Commissions is focused on VRChat avatar commissions.
* Cash App is the preferred payment method.
* PayPal is also accepted.
* Art trades may be accepted on a case-by-case basis.
* Alternative trades may also be considered.
* Asset costs are separate from the listed commission prices.
* Clients are responsible for additional asset costs required for their commission.
* Paid assets must be used according to their original creator's licensing terms.
* Reviews require approval before being publicly displayed.
* Commission enquiries are saved to the database.
* Commission enquiries trigger Discord notifications.
* Support requests can trigger Discord notifications.
* Client email addresses and commission information are private.
* Do not hardcode passwords.
* Do not commit `.env.local`.
* Do not expose the Supabase database connection string.
* Do not expose the Discord webhook.
* Keep private operations server-side.
* Keep Prisma server-side.
* Validate uploaded files before storing them.

## Production Website

**Panne Commissions**

**https://pannecomissions.shop**

## License

This project is private and intended for Panne Commissions.

The source code, website design, branding, portfolio artwork, avatar images, and other website assets may not be copied, redistributed, resold, or reused without permission.


## NSFW Page

The website also includes a separate **18+ NSFW page** for adult VRChat avatar work.

The NSFW section is kept separate from the normal portfolio so visitors can clearly distinguish between SFW and adult content.

### NSFW Access

The NSFW page is age-gated and should only be accessible to users who confirm that they are **18 or older**.

The age gate should appear before any NSFW portfolio content is displayed.

The NSFW section can include:

* Adult avatar work
* NSFW portfolio images
* NSFW commission examples
* NSFW-related project information
* NSFW pricing or service information

### NSFW Portfolio

NSFW portfolio images are stored separately from the normal portfolio.

The admin dashboard should provide a separate NSFW portfolio manager so adult content can be:

* Uploaded
* Deleted
* Reordered
* Edited
* Managed independently from the SFW portfolio

NSFW images should never accidentally appear in the normal public portfolio.

### NSFW Pricing

NSFW-specific pricing can be displayed separately from the standard commission pricing.

This allows Panne to have different pricing or services for adult avatar work without changing the normal portfolio or pricing information.

### NSFW Notifications

NSFW commission submissions should use the same secure commission system as normal commissions.

When an NSFW commission enquiry is submitted:

```text
Client
  ↓
18+ NSFW Commission Form
  ↓
Next.js API Route
  ↓
Validate Submission
  ↓
Save to Supabase PostgreSQL
  ↓
Discord Webhook
  ↓
Email Notification
```

The Discord notification should clearly identify the submission as an **NSFW commission** so it can be distinguished from normal enquiries.

Private client information should remain protected in the same way as normal commission submissions.

### NSFW Security

NSFW content should remain separated from SFW content at both the database and application level.

NSFW portfolio images should not be returned by normal portfolio API requests.

The public SFW portfolio must never display NSFW content.

The NSFW page should also avoid displaying adult images before the age-gate has been completed.

The age verification state should be handled separately from normal website navigation so that visiting the main website does not automatically grant access to the NSFW section.
