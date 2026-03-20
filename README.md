# Playa Escondida Full Live System

This package is a full live-system scaffold:
- bilingual UI (English / Español selector)
- real Supabase-ready auth
- login and signup pages
- protected owner and admin pages
- listings from database or starter fallback
- per-listing owner login ID and password demo fields
- range date selection on property calendars
- booking creation flow
- booking total calculator

## Run locally
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Supabase setup
1. Create a Supabase project.
2. Copy `.env.example` to `.env`.
3. Add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. In Supabase SQL Editor run:
   - `supabase/schema.sql`
   - `supabase/seed.sql`

## Signup
Use `/signup` to create:
- guest accounts
- owner accounts
- admin accounts

## Login
Use `/login` for real sign-in through Supabase Auth.

## Important
The per-listing owner login ID and password shown on property pages are demo owner access fields stored on the property record. Real owner authentication is handled through Supabase Auth accounts and the `owner_properties` table.


## Airbnb-level calendar upgrade
- 2-month calendar layout
- interval selection / auto-range selection
- blocked dates support
- start date + end date logic
- full in-between highlighting
- live nights and total pricing
- optional add-ons inside the booking summary


Auto-range fix: clicking the first date sets check-in, clicking the second later date sets checkout, and hovering before the second click previews the full interval like Airbnb.


## Interactive mascot
- clickable floating Saul Playa mascot
- opens contact panel
- WhatsApp shortcut
- Email shortcut
- quick link to listings


Range behavior fixed again with a simplified picker: first click starts, hover previews, second click finishes, and a third click starts a new range.


Main homepage welcome image updated to the new cartoon beach scene with Saul mascot.


Header fixed: restored LISTINGS tab, added SALE / UNIDADES EN VENTA tab, combined SIGN IN / SIGN UP into one tab/page, and forced all menu wording to uppercase.


Calendar fixed: replaced with a more stable range-selection component with proper first-click start date, second-click end date, hover preview, blocked-date checks, and clearer highlighting.


Calendar range mode strengthened: explicit first-click check-in, second-click checkout, automatic in-between selection, and clearer on-screen instructions.


Luxury header upgrade added: mega dropdown menus, hover animations, sticky shrinking effect on scroll, and glowing call button.


Translation fix: language selector now changes the luxury header, mega menus, About page, Contact page, and Login / Sign Up page instead of staying only in English.


Next-level header polish added: center-aligned luxury navigation, animated underline on hover, active page highlight, and improved balanced spacing.


Elite header upgrade: transparent-to-solid scroll behavior, stronger luxury shadows, enhanced glowing call button, and floating WhatsApp conversion button.


OUR LISTINGS separated from rentals: now points to a dedicated for-sale real estate page with no calendar and includes key sales details like bedrooms, bathrooms, square meters, square feet, parking, view, and sale price.


Saul AI Assistant added: floating assistant button, quick replies, simple sales and rentals guidance, and contact help panel.


Hero conversion machine added: stronger CTA row, trust strip, animated search box, featured inventory preview, and booking / sales-focused copy.


Admin access fix added: demo admin login SaulPlaya / Formula5181, show/hide password option on login page, and admin route locked to admin role only.


Upgraded admin system: richer production-style dashboard for rentals, sales listings, bookings, and owners, plus a stronger separate real estate listings page.


## Live CRUD upgrade
This version includes:
- Supabase SQL schema with tables for profiles, properties, images, bookings, sales leads, and owner statements
- role permissions for guest / owner / realtor / admin
- image upload service using Supabase Storage
- live property CRUD for rentals and sale listings
- booking persistence service
- owner / realtor workflow services

### Setup steps
1. Create a Supabase project.
2. Create a public Storage bucket named `property-images`.
3. Copy `.env.example` to `.env` and fill your keys.
4. Run `supabase/schema_live_crud.sql` in Supabase SQL Editor.
5. Deploy and log in to the admin.

### Important
This is a real production scaffold with live Supabase connectivity. It still expects you to connect your real business data, storage rules, email flows, and any OTA integrations you want to add later.


## Added criteria pack
Run `supabase/operational_additions.sql` after the main schema to add:
- weekend / weekly / monthly rental rates
- damage deposit
- extra guest fee
- max nights
- check-in / check-out times
- cancellation policy
- house rules
- seasonal_rates table
- blocked_dates table
- channel_connections table
- HOA fee
- yearly taxes
- commission percent

Admin now includes an Operational Criteria card listing all these fields.


Saul Playa AI polish: renamed assistant, added smart intent replies, bilingual support, and automatic close after inactivity.


Admin hard-fix: SaulPlaya / Formula5181 now works as a forced demo admin login even when Supabase is configured but roles are not yet ready.
