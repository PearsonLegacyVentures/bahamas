# Tranquilitas Bahamas — Search Experiment Log

## Hypothesis
A differentiated Nassau service website under the established Tranquilitas domain may be discovered or rank differently from the independent MassageBahamas.com website. This is not proof that subdomains automatically inherit authority.

## Controls
- Keep `https://www.tranquilitasspa.com/` Wix pages and existing Google Business Profile unchanged.
- Keep `https://www.massagebahamas.com/` and its independent brand/GBP unchanged.
- Distinguish Tranquilitas Bahamas by its real spa, reviews, practical concierge-led Nassau content and original local guides.
- Avoid mass-generated neighborhood clones, thin pages, new location profiles, automatic cross-canonicals or mass redirects.
- Existing rates and service checkout stay on the Wix booking menu.

## Tracking setup
1. Confirm Cloudflare Pages custom hostname `bahamas.tranquilitasspa.com` and valid HTTPS.
2. Register an exact URL-prefix property in Google Search Console, verify ownership, submit its sitemap after live verification.
3. Enable privacy-conscious web analytics on this subdomain using a distinct property/stream. Do not reuse the MassageBahamas.com GA tag.
4. Label booking enquiries as 'Source: bahamas.tranquilitasspa.com'; distinguish requests from confirmed paid appointments.
5. Record the first days indexed by Google for every route and the canonical selected.
6. After 14, 30, 60 days, compare clicks, impressions, CTR, positions, and conversion-related enquiries against the same-date performance on the Wix root and independent Massage Bahamas domains.
7. Review query/page overlap to catch cannibalization before adding more pages.

## First observations
Launch date and first indexation date are pending actual custom-domain activation and GSC confirmation. No performance improvement is claimed until verified.

## Launch checklist
- [ ] Production Cloudflare build succeeds
- [ ] Root and all canonical routes return HTTP 200 over the custom hostname
- [ ] Mobile navigation, gallery modal and booking request tested in a browser
- [ ] Elfsight review embed loads and real images render
- [ ] Custom domain / SSL certificate active
- [ ] Search Console property verified and sitemap accepted
- [ ] Separate analytics configured
- [ ] Live links and Wix booking calls verified
