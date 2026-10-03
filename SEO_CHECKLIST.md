# SEO checklist: owner actions

The website itself is done. These steps need the owner's Google and directory accounts.

## After every deploy
1. Open https://winequipments.com and spot-check a few pages. Check that the chat answers; it needs `secrets.php` with a new Gemini key on the server.
2. Test two old links redirect: `/products/chiller.html` and `/catlogue/Filters.pdf`.

## Google Search Console (once, then monthly)
1. Add the property `https://winequipments.com` (Domain or URL-prefix) and verify it. The HTML-tag method can be added to `src/site/templates/base.html`; send us the tag.
2. Sitemaps → submit `https://winequipments.com/sitemap.xml`. It lists every page, with images and real last-modified dates.
3. URL Inspection → "Request indexing" for:
   - the home page;
   - the 3 family pages;
   - `/engineering-tools/`;
   - `/blog.html`.
4. Monthly checks:
   - Pages (indexing) report;
   - Core Web Vitals;
   - Enhancements (Breadcrumbs, FAQ, Product snippets).
5. Removals: not needed. Old URLs 301 to their new pages.

## Bing Webmaster Tools
Import the site from Search Console, or verify it directly, then submit the same sitemap.

## Google Business Profile (biggest local win)
- **Name:** Win Equipments.
- **Category:** "Industrial equipment supplier", plus "Air compressor supplier" or similar as secondary categories.
- **Address, exactly as on the site:** SF No. 4/195 B, Kallangadu, Nadu Arasur, Arasur Post, Coimbatore 641 407.
- **Phones:** +91 95972 28969 (primary) and +91 95972 28975. **Website:** https://winequipments.com.
- **Photos:** upload the real photos from `images/works/`, the team photo and the works.
- **Products:** add the 19 product lines with links to their pages.
- **Reviews:** ask customers for Google reviews. The site never shows invented ratings.

## Profiles to link (send us the URLs)
Facebook, Instagram and IndiaMART are added. Send LinkedIn or YouTube channel URLs if you have them. They will be added as `sameAs` in the Organization schema (`org_schema()` in `src/site/build.py`).

## Content that would lift rankings further
- Real case studies (customer permission, industry, duty, equipment supplied, result).
- Datasheets for the engineered-to-order products, so they get model tables.
- More articles on chillers and cooling towers. Topics are listed in `CONTENT_TODO.md`.

## Google reviews (do this every month)
- Short link to share: **winequipments.com/review**. It opens your Google listing; customers tap **Write a review**.
- Once your Google Business Profile is verified, copy its exact "Ask for reviews" link and send it to us. We will point `/review` straight at the review box. It is set in `review_url` in `src/site/data/site.json`.
- Message to send customers on WhatsApp after a successful installation:

  > Hello {name}, thank you for choosing Win Equipments for your {product}. If you are happy with the equipment and our service, could you leave us a short Google review? It helps other plants find us: winequipments.com/review. Thank you, Win Equipments, Coimbatore

- Reply to every review, good or bad, within a few days.
- Never offer gifts for reviews, and never write them yourselves. Google removes them and can penalise the listing.

## Analytics (GA4)
1. analytics.google.com: Admin → Create property → Web stream for `https://winequipments.com`.
2. Copy the Measurement ID (starts `G-`) and send it to us, or put it in `ga4_id` in `src/site/data/site.json` and rebuild.
3. The site then reports these events automatically:
   - `quote_submit`, `quote_intent`, `whatsapp_followup`;
   - `whatsapp_click`, `call_click`, `email_click`;
   - `catalogue_download`, `chat_open`, `chat_message`, `photo_open`.
   Mark `quote_submit`, `whatsapp_click` and `call_click` as key events (conversions).
