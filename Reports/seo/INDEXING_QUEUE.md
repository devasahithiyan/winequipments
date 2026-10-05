# Search Console indexing queue

Checked 5 Oct 2026 with the URL Inspection API (service account), 59 product and location URLs: **31 not indexed**. Google's daily "Request indexing" limit is about 10; it ran out after 7 on 5 Oct.

## Requested 5 Oct 2026
- /products/air-cooled-chillers.html (now "Crawled - currently not indexed")
- /products/fanless-cooling-towers.html
- /products/cooling-tower-fills.html
- /blog/industrial-equipment-prices-india.html
- /locations/pune-heat-exchangers.html
- /locations/delhi-cooling-towers.html
- (/blog/types-of-cooling-tower.html, by mistake; it was already indexed)

## Queue, in order (request about 10 a day)

Core product pages first. Google knows these exist but has not indexed them ("Discovered - currently not indexed"), and they target the biggest searches.

1. /products/refrigerated-air-dryers.html (Discovered)
2. /products/industrial-process-chillers.html (Discovered)
3. /products/round-cooling-towers.html (Discovered)
4. /products/closed-circuit-cooling-towers.html (unknown)
5. /products/desiccant-air-dryers.html (unknown)
6. /products/shell-and-tube-heat-exchangers.html (Discovered)
7. /products/ (Discovered)
8. /locations/pune-cooling-towers.html (unknown; request failed on quota)
9. /locations/ahmedabad-cooling-towers.html (unknown)
10. /locations/chennai-heat-exchangers.html (unknown)
11. /locations/hyderabad-cooling-towers.html (unknown)
12. /locations/chennai-cooling-towers.html (unknown)
13. /locations/bangalore-cooling-towers.html (unknown)
14. /locations/ahmedabad-heat-exchangers.html (unknown)
15. /locations/pune-industrial-chillers.html (unknown)
16. /locations/ahmedabad-industrial-chillers.html (unknown)
17. /locations/bangalore-heat-exchangers.html (unknown)
18. /locations/coimbatore-industrial-chillers.html (unknown)
19. /locations/chennai-air-dryers.html (unknown)
20. /locations/delhi-air-dryers.html (unknown)
21. /locations/mumbai-air-dryers.html (unknown)
22. /locations/kolkata-heat-exchangers.html (unknown)
23. /products/spare-parts-consumables.html (Discovered)
24. /products/condensing-units.html (Discovered)
25. /products/milk-chillers.html (unknown)
26. /products/ice-flake-machines.html (unknown)
27. /products/acid-cooling-chillers.html (Discovered)
28. /products/anodizing-chillers.html (Discovered)

Re-check status with the URL Inspection API before each batch; skip anything that has become "Submitted and indexed".
