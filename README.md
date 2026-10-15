# Mightora Power Platform Security Plane Builder

Static, client-side solution architecture tool grounded in five security and access planes: privileged access, control, management, data/workload and user/application access.

## Run

- `index.html`: online edition, open or deploy to GitHub Pages. It loads the Mightora shared UI from the configured CDN.
- `offline.html`: double-click, works without server or network. It does not load remote assets or send architecture data anywhere.
- `offline-edition.zip`: self-contained offline page, README and licence.
- Open `index.html` in a browser or use a local HTTP server during development.

## Features

Six Power Platform reference patterns, editable nodes, added/removed flows, view filters, documentation prompts, JSON import/export, SVG export. Samples are illustrative and do not certify an implementation.

## Source and generation

Edit `template.html`, `src.css` and `src.js`. Run `python build.py` to regenerate online/offline editions and offline ZIP. Do not separately edit generated HTML editions. Works without third-party runtime libraries in offline mode. Online edition uses Mightora shared UI.

## Privacy & limitations

The builder makes no service requests for architecture data, and stores no server-side data. Work is in browser memory until exported as JSON. The online version may request shared UI assets. Offline mode has a restrictive CSP and makes no network requests. This is not a tenant security scanner, automatic Microsoft configuration validator or formal threat modelling tool.

## GitHub Pages

Target repository: https://github.com/mightora/security-plane-builder.mightora.io. Push to `main`, then enable GitHub Pages with source **GitHub Actions** in repository Settings → Pages. The included `CNAME` file specifies `security-plane-builder.mightora.io`. DNS must point to GitHub Pages (usually CNAME `mightora.github.io` for this subdomain) and is configured separately in Cloudflare. Do not claim running CI or CodeQL badges before publishing and verifying workflows.

## Check

Run `python test_build.py` after `python build.py`. CodeQL workflow is included for repository scanning after publishing.