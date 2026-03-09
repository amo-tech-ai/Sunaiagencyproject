# Cloudinary Image Swap Guide

Quick reference for replacing Unsplash (or any) images with Cloudinary URLs across the site.

---

## Step 1 — Identify the correct file

The same section may exist in multiple components. Use this map to find the right file:

| Page / Route | File |
|---|---|
| `/home` (services grid) | `/components/HomePageV3.tsx` |
| `/home` (hero image) | `/components/HomePageV3.tsx` — `HERO_IMG` constant |
| `/home` (specialized services) | `/components/HomePageV3.tsx` — `SPECIALIZED_SERVICES` array |
| `/services` page grid | `/components/home/OurServicesGrid.tsx` |
| Other pages | Search for the card title or image URL in `/components/` |

**Tip:** If a change doesn't appear, you're likely editing the wrong file. Search across all `.tsx` files for the exact card title (e.g. `WhatsApp AI Automation`) to find every instance.

---

## Step 2 — Get the Cloudinary URL

Format: `https://res.cloudinary.com/ddysyn5rr/image/upload/v{version}/{filename}.{ext}`

Example: `https://res.cloudinary.com/ddysyn5rr/image/upload/v1773097147/whatsapp-1_oqovpm.jpg`

---

## Step 3 — Find the card in the data array

Each section uses a constant array (e.g. `SERVICE_CARDS`, `SPECIALIZED_SERVICES`). Locate the object by its `title` field:

```tsx
{
  title: 'WhatsApp AI Automation',
  desc: '...',
  extended: '...',
  image: 'https://images.unsplash.com/photo-...',  // <-- old URL
  to: '/whatsapp-ai',
},
```

---

## Step 4 — Replace the `image` value

Swap the old URL string with the Cloudinary URL:

```tsx
{
  title: 'WhatsApp AI Automation',
  desc: '...',
  extended: '...',
  image: 'https://res.cloudinary.com/ddysyn5rr/image/upload/v1773097147/whatsapp-1_oqovpm.jpg',
  to: '/whatsapp-ai',
},
```

No imports needed — Cloudinary URLs work as plain strings, just like Unsplash URLs.

---

## Step 5 — Verify

1. Save the file.
2. Check the page in the browser.
3. Confirm the new image loads on both default and hover states.

---

## Common mistakes

| Mistake | Fix |
|---|---|
| Edited `OurServicesGrid.tsx` but home page didn't change | The home page uses `HomePageV3.tsx` — edit that file instead |
| Used `figma:asset/...` import for a Cloudinary URL | Don't use `figma:asset` — just paste the URL as a plain string |
| Image shows on one page but not another | The same card may appear in multiple files — search all `.tsx` files for the title |

---

## Current Cloudinary images (as of v0.24.5)

| Card | Cloudinary URL |
|---|---|
| Hero | `screens11_fgr95v.jpg` |
| AI Agent Systems | `ai21_i0ctwm.jpg` |
| AI Chatbots | `mobile12_l2n2xa.webp` |
| WhatsApp AI Automation | `whatsapp-1_oqovpm.jpg` |
| AI Sales & Marketing CRM | `crmai6_gb0llk.png` |
| AI MVP Development | `mvp-01_qxz7fv.png` |
| Custom AI Development | `screens16_b9nxog.jpg` |
| AI-Powered Web Development | `screens9_uyjzie.jpg` |
| E-commerce AI | `ecommerceai-001_juurhy.jpg` |

Cards still using Unsplash: **Industry Chatbot Packages**, **Story section**, **Testimonial**, **Specialized Services (all 3)**.