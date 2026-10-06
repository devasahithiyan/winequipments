# Using the 3D models for SEO (7 Oct 2026)

## What the keyword data says
- Nothing in `semrush_volumes.csv`, `keyword_planner_volumes.csv` or `keyword_candidates.txt` shows search demand for "3D model", "CAD", "drawing" or "diagram" terms for chillers or dryers. Do not expect to rank for those, and do not write copy that chases them.
- Demand that does exist, and where the models help: working-principle queries ("how a desiccant air dryer works", "how does a compressed air dryer work", "how does a process chiller work") and the product terms they support ("desiccant air dryer" 320/month India, KD 6; "desiccant dryer" 590, KD 19). On 5 Oct 2026 the site was not in the top 100 for "desiccant air dryer".
- So the 3D model is a content asset: it earns its place by making a better answer than text alone, plus unique images and a video.

## What was built
| Page | What | Why |
| --- | --- | --- |
| `/blog/how-a-process-chiller-works.html` (6 Oct) | Article, labelled diagrams, video, interactive viewer | Working principle for chillers |
| `/blog/how-a-desiccant-air-dryer-works.html` (7 Oct) | Same set for the WHD dryer: 7 labelled parts, six-step cycle, three cycle diagrams, exploded view, 24 s video, FAQ, tables from the catalogue | "How it works" intent, internal link target for the dryer product page |
| Both product pages | Labelled diagram in "How it works" linking to the article; viewer section | Internal links with descriptive anchors |
| Guides | Links from `compressed-air-dryer-guide` and `refrigerated-vs-desiccant` | Topical cluster |

Markup: Article, FAQPage, BreadcrumbList and VideoObject (duration, thumbnail, contentUrl) on the articles; all renders are in the image sitemap with descriptive file names, alt text and captions.

## Rules we kept
- Every number comes from the catalogue (`src/site/data/products/*.json`). The inside of the dryer (bed, screens, air paths, repressurise step) is labelled illustrative on the page, in captions and in the video.
- No "3D" keyword stuffing; the viewer is click to load, so it adds nothing to page weight or LCP until used.

## Not worth doing
- glTF/GLB for Google's 3D-in-Search: it is a Shopping feature that needs Merchant Center product feeds. We list no prices.
- HowTo schema: Google stopped showing HowTo rich results in 2023.

## Measure (2 to 4 weeks after deploy)
1. Search Console: impressions and clicks for the two article URLs; queries containing "how", "working principle", "desiccant dryer", "chiller work".
2. Semrush Position Tracking: add "how a desiccant air dryer works", "desiccant air dryer working principle", "heatless desiccant dryer", "desiccant dryer" (already tracked: "desiccant air dryer").
3. GA4: engagement time and the share of visitors who tap View in 3D (the load button) on the two articles and product pages.
4. Image search: the diagrams (`dryer-parts-diagram`, `dryer-cycle-*`, `chiller-parts-diagram`) in Search Console, Performance, Search type: Image.

## Next, needs the owner
- Upload the two videos to a YouTube channel (video carousels are the larger video channel; self-hosted MP4 with VideoObject gets little). Needs a channel and an account; not done.
- Real photos for the same pages (see `CONTENT_TODO.md`); they would sit beside the renders.
