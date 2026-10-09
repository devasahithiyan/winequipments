# Chiller 5-phase programme, 9 Oct 2026

Each phase has a goal, the work, and an exit check. A phase is done only when its exit check passes. Facts come only from the catalogue, the owner's IndiaMART listings (5 Oct 2026) or measured data. Owner-only items are listed separately and are not faked.

## Phase 1: Baseline and measurement
Goal: freeze where chillers stand, so every later change can be measured.
Work:
- Pull the chiller query and page baseline from Search Console (20 Sep to 9 Oct) into a CSV, with a repeatable script.
- Record the keyword set (volume, difficulty) from Semrush 9 Oct.
- Record GA4 chiller page sessions and engagement.
- Write the KPI tracker with check dates (about 20 Oct and 3 Nov).
Exit check: baseline CSV exists; script re-runs; tracker lists every chiller KPI with its starting value.

## Phase 2: On-page for chiller pages
Goal: every chiller page names the search it serves, in its title and H1, with no duplicated owner.
Work:
- Audit title, H1, description and length for all chiller product, family and city pages.
- Fix titles and H1s where the search phrase is missing and the product is real.
- Keep the application name in each H1 (acid, anodizing, medical, milk, soda).
Exit check: the audit table has no missing phrase for an owned search; tests pass.

## Phase 3: Content for buyers
Goal: answer the questions that come before a chiller enquiry, using catalogue facts only.
Work:
- New buyer guide: how to choose a chiller (duty, cooling type, ambient and outlet correction, site checklist), linking to the sizing article, calculator and price guide.
- New guide: which chiller for which industry, using the application lists in the catalogue.
Exit check: both articles publish, use only catalogue values, link to the owning pages, and pass tests.

## Phase 4: Trust and local pages
Goal: local and proof signals that are true.
Work:
- Audit the chiller city pages: each must say we supply plants in the city, not that we have a local office or local customers. Check each page is distinct from the others.
- Show the owner-confirmed IndiaMART rating (4.7 from 19 ratings) on the chiller product pages, using the site data.
- Check the Product and FAQ structured data on chiller pages.
Exit check: city pages pass the distinctness test; rating appears on chiller products; schema test passes.

## Phase 5: Conversion, review and next decisions
Goal: enquiries from chiller pages can be measured, and the next decisions are written down.
Work:
- Check the enquiry path from each chiller page and the calculator (form, WhatsApp, phone), without submitting anything.
- Write the re-check script for chiller queries and pages, to run on about 20 Oct.
- List the owner-only decisions (air-cooled model specs, 20 to 50 TR, photos and case, ISO, GBP, GA4 key events, Semrush tracking).
Exit check: path verified and documented; re-check script runs; owner list complete.

## Owner-only items (not done by me)
- Air-cooled model table (TR, kW, refrigerant, compressor, tank, dimensions).
- Whether Win builds 20 to 50 TR chillers.
- Installation photos and one case, with permission.
- ISO certificate and its date (IndiaMART says ISO 9001:2015 expired Jan 2020).
- Google Business Profile verification.
- Mark enquiry events as key events in GA4.
- Add the chiller terms to Semrush Position Tracking, if the plan allows.
- cPanel deploy of each push to `test`.
