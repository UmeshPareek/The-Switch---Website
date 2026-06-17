# the switch. — Website

## Structure
```
theswitch/
├── index.html              ← Homepage
├── properties.html         ← All properties
├── property/
│   └── [slug].html         ← Property detail (dynamic, works for all 3)
├── the-grid.html           ← The Grid community page
├── about.html              ← About page
├── contact.html            ← Contact page
├── admin/
│   └── index.html          ← Admin dashboard
├── assets/
│   ├── css/main.css        ← All styles + design tokens
│   └── js/supabase.js      ← Data layer + seed data
└── vercel.json             ← Routing config
```

## Deploy to Vercel
1. Push this folder to a GitHub repo
2. Connect repo to Vercel
3. Deploy — zero config needed

## Admin Login
- URL: `yoursite.com/admin`
- Default email: `admin@theswitch.living`
- Default password: `switch2026`
- **Change password immediately after first login** (Settings → Admin Password)

## Connect Supabase
1. Create a free project at supabase.com
2. Go to Admin → Settings → paste your Project URL and Anon Key
3. Create these tables in Supabase:

### properties
```sql
create table properties (
  id          bigint primary key generated always as identity,
  slug        text unique not null,
  name        text,
  location    text,
  area        text default 'Bengaluru',
  bhk         text,
  units       int,
  rent        int,
  status      text default 'available',
  description text,
  amenities   text[],
  map_embed   text,
  images      text[],
  sort_order  int default 1,
  created_at  timestamptz default now()
);
```

### enquiries
```sql
create table enquiries (
  id              bigint primary key generated always as identity,
  name            text,
  phone           text,
  email           text,
  property_slug   text,
  property_interest text,
  move_in_date    text,
  budget          text,
  message         text,
  intent          text default 'tenant',
  contacted       boolean default false,
  created_at      timestamptz default now()
);
```

### grid_members
```sql
create table grid_members (
  id          bigint primary key generated always as identity,
  role        text,
  time        text,
  quote       text,
  img         text,
  sort_order  int default 1
);
```

### grid_requests
```sql
create table grid_requests (
  id                 bigint primary key generated always as identity,
  first_name         text,
  last_name          text,
  email              text,
  what_they_do       text,
  preferred_property text,
  moving_when        text,
  message            text,
  created_at         timestamptz default now()
);
```

## Without Supabase
The site works fully without Supabase — it uses seed data + localStorage.
All enquiries and admin edits are stored in the browser locally.
Perfect for testing before connecting Supabase.

## Update property data
Go to `/admin` → Properties → Edit any property to update:
- Rent, unit count, BHK
- Availability status
- Google Maps embed URL
- Images (paste URLs)
- Amenities
