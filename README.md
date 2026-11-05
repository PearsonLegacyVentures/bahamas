# Tranquilitas Bahamas — controlled Nassau SEO experiment

Destination: https://bahamas.tranquilitasspa.com/
Repository: PearsonLegacyVentures/bahamas
Business: Existing Tranquilitas Day Spa, #7 Fourth Terrace, Collins Avenue, Nassau, Bahamas. No new Google Business Profile or legal entity is claimed.

## Strategy
This is a Tranquilitas-branded, Bahamas-specific information and booking hub, not a clone of MassageBahamas.com or a replacement for the original Wix site at https://www.tranquilitasspa.com/. The emphasis is the real Collins Avenue day spa plus private massage at approved locations. MassageBahamas.com remains an independent mobile-led brand.
Testing whether the established parent site adds search visibility to differentiated Bahamas content. Subdomains do not automatically inherit rankings.

## Included
- 19 working routes (18 in the sitemap; the booking enquiry page intentionally noindex).
- In-spa, mobile, couples, beach, cruise, hotel/villa/yacht and local areas content; 3 original local guides.
- Booking enquiry via WhatsApp or email with honest pending-confirmation messaging; no pretend payment or unconfigured API.
- Real Tranquilitas photo references and lazy-loaded Tranquilitas Google reviews widget.
- Distinct titles/descriptions/canonicals, JSON-LD for existing local spa, XML sitemap, robots, mobile menu and image viewer.
- Build generator in scripts/generate.mjs, Node tests and GitHub Actions CI.

## Build
Requires Node 20+; no dependencies.
Run: npm run build
Run tests: npm test
The static HTML is generated at the repository root. The live site does not depend on client-side route rendering.

## Hosting
Use Cloudflare Pages GitHub-connected project, production branch main, blank build command and blank output directory (same static root workflow as Anguilla/Turks). The Wix root website is untouched. Point only bahamas.tranquilitasspa.com via its DNS provider, never change root nameservers.

## Activation checklist
- Create or connect Cloudflare Pages project, verify deployment and attach the custom hostname.
- Confirm the DNS CNAME at the registrar/DNS provider; SSL should become active.
- Verify the URL-prefix Search Console property and submit sitemap.xml.
- Set up separate Cloudflare Web Analytics or distinct GA4 web stream before measuring conversions. Do not reuse MassageBahamas.com's measurement ID.
- Test the Elfsight review embed and real images on the custom hostname.
- Keep live Wix service pricing and checkout as source of truth.

## Measurement protocol
Before indexing, capture equivalent comparison baselines for the Tranquilitas Wix root, MassageBahamas.com and the new subdomain. At 14/30/60 days measure first indexing, query/page impressions, positions, CTR, confirmed enquiries, and any cannibalization of existing properties. A first impression does not prove inherited domain authority.

## Source and media
Company-operated Tranquilitas service photos are referenced by their existing public Wix CDN URLs. Specific setups are illustrative, not automatically included. Confirm rights before uploading third-party photos.
