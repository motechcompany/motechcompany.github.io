# MOTECH website

A static, responsive website for MOTECH’s electrical, network, CCTV and fire alarm services in Rwanda. Plain HTML, CSS and JavaScript; no installation or build step is required.

## Preview

Run `python3 -m http.server 4173` from this directory, then open `http://localhost:4173`.

## Checks

- `python3 tests/site.test.py` checks local links, assets, page structure, contact destinations and form labels.
- `node --test tests/booking.test.cjs` checks service preselection, booking success/failure handling, duplicate submission prevention and menu state. These tests use mocked requests and send no messages.
- `node --check script.js` checks JavaScript syntax.

## Deployment

GitHub Pages publishes the repository root from `main` at https://motechcompany.github.io/. Pushes to `main` trigger publication. Keep existing `.html` paths intact so shared links continue to work.

## Booking and contact

The booking form sends requests through Web3Forms using the existing public access key in `book.html`. The key is intended for client-side use. Recipient configuration and delivery are managed in the existing Web3Forms account. Automated tests do not verify delivery to the recipient’s inbox.

Service-page booking links pass the service name in the `service` query parameter. Without JavaScript, the form submits directly to the same provider endpoint, and mobile navigation stays visible.

Business contact details are repeated in page headers and footers. Update all pages together when changing phone numbers or the email address.

## Assets

`assets/` contains smaller copies of the original repository’s logo and main photographs. The originals are retained. Manrope is self-hosted under its bundled SIL Open Font License. No third-party font requests, tracking scripts or UI libraries are loaded.
