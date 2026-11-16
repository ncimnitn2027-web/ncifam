# NIT Nagaland Conference

Static website for the National Institute of Technology Nagaland conference under the ANRF Partnerships for Accelerated Innovation and Research (PAIR) Programme, 19–20 February 2027.

The site uses HTML, CSS, and vanilla JavaScript only. It does not need a backend or a frontend framework.

## Preview

Shared header and footer are loaded with `fetch`, so open the site through a local static server rather than a `file://` address.

```bash
python -m http.server 8080
```

Then visit `http://localhost:8080/`.

## Folder responsibilities

| Path | Responsibility |
| --- | --- |
| `index.html` | Homepage |
| `pages/` | Internal pages |
| `partials/` | Single copy of the shared header and footer |
| `css/` | Stylesheets, one concern per file |
| `js/` | Behaviour, one concern per file |
| `assets/images/` | Photographs and banners |
| `assets/logos/` | Official logos |
| `assets/icons/` | Icons |
| `assets/documents/` | Downloadable conference documents |

## Stylesheets

Load order is fixed in every page. `responsive.css` is last so viewport rules can override the others.

| File | Responsibility |
| --- | --- |
| `css/main.css` | Box model, type defaults, page shell |
| `css/header.css` | Header and mega menu |
| `css/footer.css` | Footer |
| `css/components.css` | Shared components such as the skip link |
| `css/responsive.css` | Viewport adjustments |

## Scripts

Scripts are classic (not modules) and load in this order:

| File | Responsibility |
| --- | --- |
| `js/components.js` | Insert header and footer; `Site.url()` for root-relative paths |
| `js/navigation.js` | Mobile menu, mega menu, current-page marker |
| `js/slider.js` | Highlight slider, inactive until slides exist |
| `js/main.js` | Boot sequence |

## Paths

`body` carries `data-base`, the prefix from the current file back to the site root.

- `index.html` uses `data-base=""`.
- Every file in `pages/` uses `data-base="../"`.

Header and footer links are written once in `partials/` with a `{{base}}` prefix. The loader replaces that token with `data-base`.

Stylesheet and script URLs in each HTML file are relative to that file:

- Homepage: `css/...` and `js/...`
- Internal pages: `../css/...` and `../js/...`

Image and font URLs inside CSS stay relative to the stylesheet, for example `../assets/images/banner.jpg` from `css/main.css`.

From JavaScript, build a root-relative path with `Site.url("assets/documents/call.pdf")`.

A new page one level under `pages/` only needs `data-base="../"`, `data-page="its-id"`, and a matching `data-nav` on its links in both partials. A page nested deeper must set `data-base` to the correct number of `../` segments.

## Navigation groups

The mega menu groups existing pages only:

- Conference: Programme, Important Dates, Focused Areas, Speakers
- Participate: For Authors, Registration, Committees
- Visit: Travel Information, Accommodation
- About: Sponsors, Contact

Home is a top-level link. Groups can be renamed or reordered in `partials/header.html` without editing each page.
