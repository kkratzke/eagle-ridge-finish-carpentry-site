# Eagle Ridge Finish Carpentry, LLC Website

This repository now contains a static small-business website for Eagle Ridge Finish Carpentry, LLC.

## Structure

- `index.html`: main one-page site
- `assets/css/styles.css`: all site styling
- `assets/js/data.js`: services, gallery filters, and project photo metadata
- `assets/js/main.js`: gallery rendering, lightbox, nav toggle, and small UI behaviors
- `assets/icons/favicon.svg`: site favicon
- `photos/`: existing business project photos reused throughout the site

## Run Locally

Because the site is fully static, there is no build step.

Open `index.html` directly in a browser, or run a simple static server:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploy

This site is ready for simple static hosting.

Option 1: Netlify

1. Create a new site in Netlify.
2. Drag and drop this full project folder, or connect the repo if you move it into Git later.
3. Netlify will publish from the project root automatically using `netlify.toml`.

Option 2: Any basic web host or cPanel host

1. Upload the full contents of the project folder to the site root.
2. Make sure `index.html`, `assets/`, `photos/`, and `robots.txt` stay at the top level.

Before the final launch:

- Update the quote form recipient once the real email address is available.
- Add the final live domain to the SEO/Open Graph metadata if you want fully production-ready sharing tags.
- Point your domain or subdomain to the chosen host.

## Content Notes

- The gallery and service cards are driven from `assets/js/data.js`, so future photo additions are easy to manage in one place.
- The Facebook page is linked as a real business reference and used in the site copy inspiration.
- When a final live domain is chosen, review the SEO/Open Graph metadata if you want absolute production URLs in those tags.
