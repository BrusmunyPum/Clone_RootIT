# RootIT Clone

## Frontend Structure

- `components/`: standalone page files such as `product-brand.html`
- `partials/`: shared HTML fragments for header and footer
- `css/`: stylesheets
- `images/`: shared UI icons and static images
- `userfiles/`: business content assets like product images, brand logos, and logo files
- `data/shared/`: shared client-side data helpers
- `data/pages/`: page-specific datasets
- `js/shared/`: shared frontend behavior used across pages
- `js/pages/`: page-specific render/rendering scripts
- `js/`: third-party vendor scripts kept at the top level for clarity

## Current Custom Entry Points

- Homepage data: `data/pages/index.js`
- Homepage renderer: `js/pages/index-products.js`
- Shared layout logic: `js/shared/layout.js`
- Shared partial loader: `js/shared/partials.js`
- Brand page data: `data/pages/product-brand.js`
- Brand page renderer: `js/pages/product-brand.js`
