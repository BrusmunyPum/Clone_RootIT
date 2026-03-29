- `components/cart.html`: Replaced local vendor assets with the Bootstrap 5.3.8, Swiper 12.0.3, and Font Awesome 7.1.0 CDNs; corrected internal links (`/` to `../index.html`, `/components/contact-me.html` to `./contact-me.html`); removed hardcoded production canonical URL; added semantic preview/cart utility classes to support JS without inline styles.
- `js/pages/cart.js`: Rewrote the cart page in vanilla ES6+ with no jQuery; separated data loading, state, and rendering paths to make future React/FastAPI migration easier; removed inline styles and inline error handlers from generated markup; fixed header preview rendering so it uses semantic DOM nodes and shared CSS classes instead of string-built HTML fragments.
- `components/contact-me.html`: Swapped legacy local vendor assets for the shared Bootstrap 5.3.8, Swiper 12.0.3, and Font Awesome 7.1.0 CDNs; corrected the breadcrumb home path to `../index.html`; replaced the map toggle anchor with an accessible button; removed the inline submit icon style; and added `name` attributes to all form controls so the page can post cleanly to a future backend.
- `js/pages/contact-me.js`: Rewrote the contact page logic in vanilla ES6+ with no jQuery; separated payload creation and async submission from UI rendering; converted the map toggle to accessible state-based logic; and fixed the legacy form flow so alert state and submission behavior are ready to drop into a FastAPI-backed endpoint later.
- `data/shared/data_product_detail.js`: Added a new shared mock product dataset with realistic laptops, desktops, networking, storage, projector, printer, camera, UPS, and access-control records; every main image path now starts with `./userfiles/product-details/`; and exposed a small global API (`window.RootITProductDataApi`) to support future React/FastAPI data boundaries.
- `index.html`: Replaced the old homepage product data wiring with the new shared product-detail dataset and removed the unused catalog/directory script references from the page shell.
- `js/pages/index-products.js`: Rebuilt homepage product-section rendering around `window.RootITProductDataApi`; removed legacy directory coupling; and converted homepage product cards to local dynamic detail links (`./components/product-detail.html?id=...`).
- `components/product-all.html`: Replaced the legacy catalog page with a Bootstrap 5 CDN-based shell, soft-card layout, semantic filter panels, and local-only catalog routing designed for future component extraction into Next.js.
- `js/pages/product-all.js`: Rewrote the catalog logic in vanilla ES6+ with URL-driven state, isolated filtering/sorting/pagination, and dynamic rendering from the shared product dataset instead of the obsolete generated catalog blob.
- `components/product-detail.html`: Replaced the static hardcoded product detail page with a semantic dynamic template using clear ID hooks, Swiper 12 mounts, local breadcrumbs, a not-found state, and migration-friendly markup without inline event handlers.
- `js/pages/product-details.js`: Rewrote product detail rendering in vanilla ES6+ to parse the `id` query parameter, resolve shared mock data, build the gallery/spec/features/related-product sections, and show a proper not-found state when IDs are invalid or missing.
- `components/login.html`: Swapped the old local Bootstrap/Font Awesome/Swiper assets for the shared CDN stack while keeping the existing modern auth markup intact.
- `components/register.html`: Swapped the old local Bootstrap/Font Awesome/Swiper assets for the shared CDN stack while keeping the existing modern auth markup intact.
- `components/dashboard.html`: Swapped the old local vendor stack for the shared CDN stack and removed remaining inline display/icon styling from the modernized dashboard shell.
- `js/pages/auth.js`: Corrected auth redirect paths from production-style `/components/...` URLs to local component-relative routes so the demo auth flow works correctly inside this workspace.
- `js/pages/dashboard.js`: Corrected dashboard auth-guard and logout redirects to local component-relative routes, keeping the localStorage-based demo flow self-contained.
- `components/product-brand.html`: Rebuilt the brand page around the shared CDN stack, soft-card UI, and local routing so brand clicks now flow into the workspace catalog instead of dead production paths.
- `js/pages/product-brand.js`: Updated brand-card generation to route into `./product-all.html?brand=...` filters with Bootstrap-friendly responsive markup instead of broken brand slugs.
- `components/portfolio.html`: Replaced dead `our-work` production links with a local portfolio page that routes each card into the contact form via query-prefilled subjects; also refreshed the layout with softer cards, spacing, and hover polish.
- `components/it-support.html`: Replaced the legacy service page with a local-first Bootstrap 5/Swiper 12 version that keeps service galleries and work examples in the workspace and routes supporting actions into local catalog, portfolio, and contact pages.
- `js/pages/contact-me.js`: Added query-string subject prefilling so local portfolio and service links can hand context into the contact form without inline scripting.
- `js/pages/product-detail.js`: Removed the obsolete jQuery-driven detail helper because the new dynamic detail page is fully handled by `js/pages/product-details.js`.
- `data/pages/product-all-catalog.js`: Removed the obsolete generated catalog blob because the product list now comes from `data/shared/data_product_detail.js`.
- `js/shared/product-directory.js`: Removed the obsolete directory helper because homepage, catalog, and detail routing now resolve directly from the shared mock product dataset.
- `partials/header.html`: Replaced the shared header with a local-only navigation shell that preserves the IDs/classes used by `layout.js` while removing the production-domain category tree and broken cross-page links.
- `partials/footer.html`: Replaced production-domain footer links with workspace-safe navigation and contact-policy inquiry links so shared page chrome no longer routes users out of the local app.

## Bug Fixes

- `partials/header.html`: Restored the original full "All Categories" dropdown/sidebar menu from local Git history, kept all menu items intact, updated the mobile collapse/dropdown triggers to Bootstrap 5 `data-bs-*` attributes, and restored the shared account/inquiry hooks required by `layout.js`.
- `css/index-page.css`: Removed the hover rule that forced `.dropdown-menu-list` open in normal layout flow and switched the custom header menus to explicit `.show` state handling so the inquiry preview no longer renders open by default.
- `js/shared/layout.js`: Added explicit open/close helpers for header dropdown menus, ensured account and inquiry menus start hidden, added click-away close behavior, and enabled intentional click/desktop-hover opening without breaking header layout.
- `data/shared/data_product_detail.js`: Added a shared `resolveAssetPath()` helper so the same product data can safely resolve images from both `/index.html` and files inside `/components/`.
- `js/pages/index-products.js`: Switched homepage product image rendering to the shared asset resolver instead of assuming `./userfiles/...` always works.
- `js/pages/product-all.js`: Replaced the hardcoded `./` to `../` string hack with the shared asset resolver so catalog images stay correct regardless of page depth.
- `js/pages/product-details.js`: Updated gallery and related-product rendering to use the shared asset resolver, fixing broken detail-page images from `components/`.

## UI Recovery

- `index.html`: Restored the repository-aligned homepage structure and product layout, kept the static image paths expected by the original markup, and reattached the page to the original repository data/rendering helpers while keeping Bootstrap 5.3.8, Swiper 12.0.3, and Font Awesome 7.1.0 CDN assets.
- `components/product-all.html`: Restored the repository-aligned catalog layout and original card/filter structure, kept the original `../userfiles/...` image paths, removed the jQuery bootstrapping snippet, and replaced it with a plain `DOMContentLoaded` initializer.
- `components/product-detail.html`: Restored the repository-aligned static product detail layout and original image/spec markup, updated popover triggers to Bootstrap 5 `data-bs-*` attributes, and kept the page on the shared CDN asset stack.
- `partials/header.html`: Recovered the original header/sidebar menu structure from GitHub-aligned history, restored the full “All Categories” menu, fixed shared asset paths in the partial with root-based `/userfiles/...` and `/images/...` references so the partial works on both root and `components/` pages, and ensured the inquiry/account menus start hidden with Bootstrap-compatible dropdown classes.
- `js/shared/product-directory.js`: Corrected the fallback detail route to `./product-detail.html` so repository-style listing links no longer point at the removed dynamic detail path.
- `js/pages/product-detail.js`: Replaced the restored jQuery-dependent helper with a vanilla ES6+ version so the original static product-detail page keeps its gallery/spec-toggle behavior without requiring jQuery.
- `js/pages/product-details.js`: Stripped the dynamic injection logic down to a no-op note because the active detail page has been restored to static HTML.
- `data/pages/product-all-catalog.js`: Restored the repository catalog data file so the recovered index/catalog layouts can use the original product source and image paths again.
- `js/shared/product-directory.js`: Restored the repository product directory helper needed by the recovered index/catalog rendering flow, then patched its detail link target to the static detail page.
## Final Static Bug Fixes

- `partials/header.html`: Corrected the Bootstrap 3 visibility classes to Bootstrap 5 equivalents so the desktop header sections render only on `md+` while the mobile logo and hamburger menu render only below `md`, eliminating the duplicated header layout on desktop.
- `components/it-support.html`: Fixed the broken image paths for "Surveillance & Monitoring" and "Wireless & Network Infrastructure" by pointing them to the actual local assets under `../userfiles/services/`.
## Final QA Icon and Path Fixes

- `partials/header.html`: tightened the Bootstrap 5 responsive classes so the desktop header remains `d-none d-md-block`, the mobile shell remains `d-block d-md-none`, the mobile columns now use Bootstrap 5 `col-*` classes, and the hamburger icon was updated to `fa-solid fa-bars`.
- `components/it-support.html`: corrected the remaining broken network rollout and network thumbnail image paths to the real local files under `../userfiles/services/`.
- `components/product-all.html`: restored a visible breadcrumb home link with a Font Awesome 7 house icon and updated the loading indicator from the obsolete `fa` alias to `fa-solid fa-spinner`.
- `components/contact-me.html`: updated the breadcrumb home link to use a Font Awesome 7 house icon instead of relying on legacy icon markup.
- `components/cart.html`: replaced the legacy `fas` aliases with Font Awesome 7 `fa-solid` classes for the empty-state basket and back-arrow icons.
- `data/pages/product-all-catalog.js`: normalized a small set of encoded product image filenames to match the local `userfiles/products` assets, fixing the remaining broken catalog cards.

## UI Reference Alignment

- `components/it-support.html`: reworked the page shell to follow the original three-column service layout from the reference UI, including the compact breadcrumb, larger left gallery, center content column, right-side related services list, and a simpler "Our Work" section with blue navigation arrows.
- `components/portfolio.html`: simplified the page to match the reference "Our Work" presentation with a plain heading/subtitle and flatter project cards instead of the heavier custom hero/card treatment.
- `components/cart.html`: tuned the empty inquiry-state proportions, icon sizing, and container styling so it sits closer to the original centered white-panel layout shown in the reference.
- `components/contact-me.html`: reduced the overly modernized styling and brought the page back toward the flatter original contact layout with lighter icon treatment, tighter spacing, and breadcrumb styling that matches the reference screenshots.
- `js/pages/contact-me.js`: fixed subject query prefilling by targeting the actual `contactSubject` field ID used by the static contact form.

## Inquiry Preview Polish

- `css/index-page.css`: moved the inquiry preview item styling into shared header CSS so the hover dropdown now renders as a proper product list on every page, with image thumbnails, clamped titles, metadata, and a wider panel closer to the original UI.
- `js/shared/layout.js`: added shared inquiry preview defaults plus image-path normalization so the header can show the inquiry count and product list consistently across the site, even before the cart page is visited.
- `partials/header.html`, `css/index-page.css`, and `js/shared/layout.js`: upgraded the inquiry hover dropdown into a cleaner mini-cart panel with stronger spacing, polished rows, an estimated total line, and action buttons for `View List` and `Get Quote`.
## Shared Header Footer Import Sync

- `components/it-support.html`, `components/portfolio.html`, `components/product-brand.html`, and `components/product-all.html`: added the shared `../css/index-page.css` include so the imported header/footer partials use the same action-bar, inquiry dropdown, badge, and menu styling as `index.html`.
- `components/product-all.html`: removed the duplicate Font Awesome 6.7.2 CDN include so the shared partial header/footer now render against the same Font Awesome 7 stylesheet as the rest of the project.
- index.html: removed the duplicate Font Awesome 6.7.2 include so the shared header/footer partials render against the same icon stack as the rest of the site.

## All Categories Arrow Fix

- `css/nav.css`: updated the `All Categories` sidebar pseudo-element arrows to use the Font Awesome 7 font-family fallback, fixing the square-box glyphs that appeared on the right side of category rows after the icon-stack modernization.

## Shared Arrow Icon Fix

- `css/nav.css` and `css/custom.css`: updated the remaining pseudo-element icon rules to use the Font Awesome 7 fallback stack, fixing missing `>` arrow indicators and related shared glyphs across pages after the Font Awesome upgrade.

## Our Work Slider Refinement

- `components/it-support.html` and `js/pages/it-support.js`: reworked the `Our Work` section to better match the reference project carousel with project-style captions, stronger blue side arrows, continuous looping, and cleaner hover transitions on each card.

## Breadcrumb Home Icon Cleanup

- `components/contact-me.html`, `components/it-support.html`, and `components/product-all.html`: removed duplicated inline house icons from the first breadcrumb link because the shared breadcrumb CSS already injects the home icon with a pseudo-element.

- components/it-support.html: refined the Our Work carousel again to better match the provided screenshot with flatter bordered cards, taller project images, larger heading styling, and blue square side arrows aligned on the carousel edges.
- css/custom.css and components/it-support.html: redesigned the shared next/previous slider buttons with a cleaner white-glass circular style, softer shadows, smoother hover feedback, and updated `it-support` gallery arrows so they stay hidden until the main image area is hovered.
- css/custom.css and components/it-support.html: replaced the heavy Swiper arrow glyphs with cleaner custom chevron arrows so the next/previous buttons look sharper, lighter, and more balanced across the shared sliders and the `it-support` page.
- css/custom.css and components/it-support.html: suppressed the remaining built-in Swiper icon layer and forced the nav buttons to render only the custom chevron, fixing the duplicated arrow effect and making the buttons look cleaner and more professional.
- js/shared/partials.js, js/shared/layout.js, and js/pages/index-products.js: added a shared local URL mapper that converts old `rootitsupport.com` page links and root-relative site links into the correct local static pages/assets, keeping shared header/footer links, homepage category links, and product links inside this project instead of sending users to the live website.
- components/product-detail.html: corrected the breadcrumb links to use the local home, product listing, and brand pages.
- css/custom.css: cleaned up the footer social-link alignment by switching the icon/text rows to inline-flex with fixed icon width, consistent spacing, and balanced vertical alignment so the `Follow` list renders in a neat ordered column.
- partials/footer.html and css/custom.css: rebuilt the footer `Follow` links with dedicated icon badges plus label spans, and overrode the inherited footer line-height so the social links now render in a tighter, cleaner, properly ordered column.
- partials/footer.html and css/custom.css: normalized the footer `Follow` block into a true two-column icon/label layout with consistent badge sizing, tighter label alignment, and corrected `YouTube` casing so the social list now reads as one clean, ordered set of rows.
- partials/footer.html and css/custom.css: replaced the footer Telegram brand glyph with a centered paper-plane treatment inside the same social badge so it visually matches the weight and fit of the other social icons.
- partials/header.html, css/custom.css, and js/shared/layout.js: replaced the old mobile collapse dropdown with a right-side slide-in mobile menu drawer inspired by the sidebar pattern reference, including overlay close behavior, accordion toggles for Brands and Solutions, and a cleaner touch-friendly mobile navigation experience.
- partials/header.html, css/custom.css, and js/shared/layout.js: refined the mobile drawer position and behavior by aligning the hamburger button properly in the mobile header, hiding it while the drawer is open, softening the overlay and drawer shadow, tightening the drawer header spacing, and resetting expanded mobile submenus whenever the drawer closes.
- css/custom.css: moved the mobile drawer and its overlay down below the top blue contact bar and constrained the drawer height to the remaining viewport so the logo/header area no longer gets clipped behind the top bar on small screens.
- partials/footer.html and css/custom.css: improved the footer mobile layout by stacking the `Company` and `Solutions` columns full-width on small screens, loosening cramped spacing, and making the copyright links wrap more cleanly.
- css/custom.css: forced the page edge and scrollbar track to render on a white background and kept horizontal overflow hidden so the right-side gray strip no longer appears as an off-color gutter.
- partials/footer.html and css/custom.css: enabled the full footer content responsively by showing all four sections at every size, keeping the 4-column layout on desktop, 2x2 sections on tablet, and stacked sections on mobile with adjusted spacing for readability.
- css/custom.css: hid the mobile scrollbar gutter so the right edge of the page stays clean instead of showing the gray strip on small screens.
- css/custom.css: fixed the shared `.container-fluid` mobile sizing by giving it real side padding and full-width behavior on small screens, which removes the empty gray viewport strip caused by the old `width: 95%` layout rule.
- css/custom.css: forced the full page canvas, main content wrappers, and header/mobile header areas to render on white and expanded the body to at least the viewport width so any remaining side space matches the main page color instead of showing gray.

- components/product-all.html and js/pages/product-all.js: redesigned the product listing filters for better mobile use with a slide-in filter drawer, collapsible Category/Brand sections, a cleaner mobile filter trigger, and updated the catalog grid renderer to show 2 products per row on small screens while keeping the results/sort area easier to use.
