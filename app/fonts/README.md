# Bloom's bundled fonts

These are unmodified Latin WOFF2 font files served by the Google Fonts CSS
API, downloaded on 2026-10-22. Each family's adjacent `OFL.txt` preserves its
copyright and SIL Open Font License 1.1. Redistribution is permitted under
those terms; keep the licences with these files.

The family names, CSS variables, and requested weights are retained from the
previous `next/font/google` configuration. Variable font files are reused
across supported weights rather than duplicated. Courier Prime has separate
400 and 700 files. These assets cover Latin glyphs; other scripts use the
browser's fallback fonts.

| Directory | Family | Configured weights |
| --- | --- | --- |
| inter | Inter | 100–900 |
| playfairdisplay | Playfair Display | 400–900 |
| fraunces | Fraunces | 400–600 |
| lora | Lora | 400–500 |
| ebgaramond | EB Garamond | 400–500 |
| nunito | Nunito | 400–600 |
| raleway | Raleway | 400–500 |
| caveat | Caveat | 400–600 |
| sacramento | Sacramento | 400 |
| courierprime | Courier Prime | 400, 700 |

Source CSS: `https://fonts.googleapis.com/css2?family=<family>:wght@<weights>&display=swap`
(modern Chrome user agent; Latin faces only). Binary URLs are supplied by
that CSS on `https://fonts.gstatic.com/`.

Licence sources:
`https://github.com/google/fonts/tree/main/ofl/<directory>/OFL.txt`.

The files are processed by `next/font/local` into hashed same-origin static
assets. Builds no longer depend on Google's availability or font URL format.
No font CDN requests or additional JavaScript font service is required.
