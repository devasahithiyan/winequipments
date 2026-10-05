---
title: How to size a refrigerated air dryer for your compressor
seo_title: How to Size an Air Dryer: Correction Factors Guide
description: Why a 100 CFM compressor rarely needs just a 100 CFM dryer: how inlet temperature, ambient, pressure and dew point change dryer capacity.
date: 2026-09-16
updated: 2026-10-05
products: refrigerated-air-dryers, compressed-air-filters
category: Air dryers
order: 3
answer: Do not match the dryer's CFM to the compressor's. Divide the compressor's actual delivered air by four correction factors for inlet temperature, ambient, pressure and dew point. WRD dryers are rated at 45 °C inlet, 35 °C ambient, 7 bar g and +3 °C. Use your hottest month's conditions.
---
A common mistake is to buy a dryer with the same CFM rating as the compressor. Dryer ratings apply only at the conditions they were tested at. In a hot Indian plant the same dryer can deliver much less, and the dew point rises.

## The rating conditions

WRD dryers are rated per ISO 7183 at:

- **45 °C** compressed air inlet temperature
- **35 °C** ambient temperature
- **7 bar g** inlet pressure
- **+3 °C** pressure dew point

At these conditions every correction factor is 1.0.

## The sizing formula

From our WRD catalogue:

> Dryer nominal capacity = compressor actual capacity ÷ (C1 × C2 × C3 × C4)

where the factors are:

| Inlet temp. °C | 30 | 35 | 40 | 45 | 50 | 55 | 60 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| C1 | 1.2 | 1.15 | 1.05 | 1.0 | 0.85 | 0.8 | 0.7 |

| Ambient °C | 25 | 30 | 35 | 40 | 45 | 50 |
| --- | --- | --- | --- | --- | --- | --- |
| C2 | 1.2 | 1.15 | 1.0 | 0.91 | 0.87 | 0.78 |

| Pressure bar g | 4 | 5 | 6 | 7 | 8 | 10.5 | 12 | 15 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C3 | 0.75 | 0.85 | 0.93 | 1.0 | 1.06 | 1.15 | 1.2 | 1.25 |

| Dew point °C | 3 | 5 | 7 | 10 |
| --- | --- | --- | --- | --- |
| C4 | 1.0 | 1.09 | 1.15 | 1.3 |

## Worked example

A compressor delivers 250 CFM at 7 bar g. In summer the plant runs at 40 °C ambient and the air reaches the dryer at 50 °C. A +3 °C dew point is required.

- C1 (50 °C inlet) = 0.85
- C2 (40 °C ambient) = 0.91
- C3 (7 bar g) = 1.0
- C4 (+3 °C) = 1.0

Nominal capacity = 250 ÷ (0.85 × 0.91 × 1.0 × 1.0) = 250 ÷ 0.774 = **323 CFM**.

The next WRD model up is **WRD 400 T**. A 250 CFM dryer would be undersized by nearly a quarter in these conditions.

## Getting the inputs right

- **Use actual delivered air (FAD), not the motor rating.** The compressor nameplate or datasheet gives free air delivery. As a rough guide only, a screw compressor delivers about 4 CFM per HP.
- **Measure the temperature at the dryer inlet.** If air arrives hotter than 60 °C, fit or repair the compressor aftercooler first; WRD dryers accept inlet air from 10 to 60 °C.
- **Use your hottest month for ambient.** The dryer has to hold the dew point on the worst day.
- **Allow for growth.** If another compressor is planned, size for it now.

## Do the sum automatically

The [air dryer sizing calculator](/engineering-tools/air-dryer-sizing.html) applies these factors and picks the WRD model, and switches to a WHD desiccant dryer if you need −20 °C or −40 °C.

## Frequently asked questions

### How do I size a refrigerated air dryer?
Dryer nominal capacity = compressor actual capacity ÷ (C1 × C2 × C3 × C4), where the factors correct for inlet temperature, ambient temperature, pressure and dew point. Choose the WRD model rated at or above the result.

### Can I use a 250 CFM dryer for a 250 CFM compressor?
Not in hot conditions. At 50 °C inlet and 40 °C ambient, 7 bar g and +3 °C dew point, a 250 CFM compressor needs 323 CFM nominal dryer capacity, so a 250 CFM dryer would be undersized by nearly a quarter.

### What are the rating conditions of a refrigerated air dryer?
WRD dryers are rated per ISO 7183 at 45 °C inlet temperature, 35 °C ambient, 7 bar g inlet pressure and +3 °C pressure dew point. At these conditions every correction factor is 1.0.

### Should I size a dryer on compressor HP or CFM?
Use the compressor's actual free air delivery (FAD) in CFM from the nameplate or datasheet, not the motor rating. About 4 CFM per HP for a screw compressor is a rough guide only.
