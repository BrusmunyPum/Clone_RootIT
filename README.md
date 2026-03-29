# RootIT Clone

Static frontend clone of the Root IT Support website. This repository is organized as a local-first demo site with shared HTML partials, plain JavaScript page modules, and product/content data stored in frontend data files.

## What This Project Includes

- Multi-page static site with `index.html` as the homepage
- Shared header and footer loaded from HTML partials
- Product listing, brand, contact, IT support, portfolio, auth, dashboard, and inquiry/cart pages
- Data-driven homepage sections and catalog rendering
- Local asset and URL rewriting so pages work inside this workspace instead of pointing back to the live site
- Demo auth and inquiry/cart state stored in `localStorage`

## Project Structure

- `index.html` - homepage shell
- `components/` - secondary pages such as catalog, product detail, contact, auth, dashboard, and service pages
- `partials/` - shared HTML fragments for the site header and footer
- `css/` - shared and page-specific styling
- `js/shared/` - shared frontend behavior such as partial loading, layout behavior, and product URL helpers
- `js/pages/` - page-specific scripts
- `data/pages/` - homepage and catalog datasets
- `data/shared/` - shared asset helpers and shared product/detail data
- `images/` - shared UI icons and supporting images
- `userfiles/` - product photos, brand logos, service images, and other business assets
- `fonts/` - local font files
- `migration_log.md` - historical notes about the migration and UI recovery work

## Main Frontend Flow

### Shared layout

- `js/shared/partials.js` loads `partials/header.html` and `partials/footer.html`
- The same loader rewrites legacy Root IT URLs into local page targets so the clone stays self-contained
- `js/shared/layout.js` handles shared UI behavior like mobile navigation, inquiry preview state, search interactions, popovers, and demo auth helpers

### Homepage

- `data/pages/index.js` provides homepage section data
- `js/pages/index-products.js` renders those sections into Swiper sliders
- `data/shared/assets.js` maps legacy asset references to local files when needed

### Product pages

- `data/pages/product-all-catalog.js` provides the catalog product source used by the listing flow
- `js/shared/product-directory.js` normalizes product records, builds local product URLs, and resolves products by slug
- `js/pages/product-all.js` renders the catalog with filtering, sorting, pagination, and URL state
- `components/product-detail.html` is the active static product detail page
- `js/pages/product-detail.js` handles the interactive behavior for that detail page

### Other pages

- `js/pages/contact-me.js` powers the contact form interactions and subject prefilling
- `js/pages/cart.js` powers the inquiry/cart experience
- `js/pages/auth.js` and `js/pages/dashboard.js` support the demo auth flow
- `js/pages/it-support.js` controls the service-page sliders/interactions

## Running Locally

Because this site loads partial HTML files and uses relative asset paths, run it through a local web server instead of opening files directly in the browser.

### Simple options

1. VS Code Live Server
2. `python -m http.server`
3. Any static server extension or local dev server you already use

Example:

```powershell
cd D:\DATA\Project\RootIT_clone
python -m http.server 8080
```

Then open:

- `http://localhost:8080/`

## Editing Guide

### If you want to change page content

- Homepage product sections: `data/pages/index.js`
- Catalog products: `data/pages/product-all-catalog.js`
- Shared product/asset helpers: `data/shared/assets.js`
- Header/footer markup: `partials/header.html`, `partials/footer.html`

### If you want to change page behavior

- Shared site behavior: `js/shared/layout.js`
- Partial loading and URL rewriting: `js/shared/partials.js`
- Product routing helpers: `js/shared/product-directory.js`
- Homepage rendering: `js/pages/index-products.js`
- Catalog behavior: `js/pages/product-all.js`
- Product detail interactions: `js/pages/product-detail.js`

### If you want to change styling

- Shared/global styling: `css/custom.css`
- Header/sidebar/navigation styling: `css/nav.css`, `css/nav-desk.css`
- Homepage-specific styling: `css/index-page.css`
- Auth and dashboard styling: `css/auth.css`, `css/dashboard.css`

## Current Notes

- This repository is a static frontend clone, not a full backend application
- Demo auth and inquiry data are stored in the browser with `localStorage`
- Several pages still preserve legacy content structure from the original site while being patched to work locally
- `migration_log.md` contains the detailed history of refactors, fixes, and UI recovery decisions

## Recommended Next Cleanup

- Consolidate duplicate or obsolete page scripts where possible
- Normalize remaining legacy text encoding issues in old content
- Document any final page-to-script mapping changes after future refactors
- Add a lightweight build/lint setup if this project moves beyond static maintenance
