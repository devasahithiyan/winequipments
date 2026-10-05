---
title: How to size an industrial process chiller (TR calculation)
seo_title: How to Size a Process Chiller: TR Formula & Example
description: Work out process chiller capacity in TR from water flow and temperature rise, then correct it for outlet and ambient temperature, with a worked example.
date: 2026-10-04
updated: 2026-10-05
products: industrial-process-chillers, round-cooling-towers
category: Chillers
order: 12
photo: chiller-win-white.jpg | WCP process chiller built at our works
answer: Work out the heat load as water flow (LPM) × temperature rise (°C) ÷ 50.4 to get TR, then divide by the outlet and ambient correction factors to get the nominal capacity. WCP chillers are rated at 15 °C outlet and 40 °C ambient. Then check the model's water flow suits your process.
---
A chiller is sized from the heat it has to remove from your process water. Get the heat load right, correct it for your site, and the model follows.

## Step 1: work out the heat load

Water picks up heat as it passes through moulds, machines or baths. If you know the water flow and how much it heats up, the load is:

> Heat load (TR) = water flow (LPM) × temperature rise (°C) ÷ 50.4

The 50.4 comes from 1 TR = 3,024 kcal/hr and water carrying 1 kcal per kg per °C (3,024 ÷ 60 = 50.4). If you already know the load in kW, divide by 3.517 to get TR.

## Step 2: correct for outlet and ambient temperature

WCP chillers are rated at **15 °C** water outlet and **40 °C** ambient. A chiller delivers less at colder water and in hotter air, so the catalogue gives two correction factors:

| Water outlet °C | 5 | 10 | 15 | 20 | 25 |
| --- | --- | --- | --- | --- | --- |
| Factor | 0.6 | 0.75 | 1.0 | 1.16 | 1.3 |

| Ambient °C | 30 | 35 | 40 | 45 | 50 |
| --- | --- | --- | --- | --- | --- |
| Factor | 1.2 | 1.1 | 1.0 | 0.9 | 0.8 |

> Nominal capacity needed = heat load ÷ (outlet factor × ambient factor)

## Worked example

An injection moulding line circulates **100 LPM** of water that heats up by **5 °C**. The moulds need **10 °C** water and the plant reaches **40 °C** in summer.

- Heat load = 100 × 5 ÷ 50.4 = **9.92 TR**
- Outlet factor (10 °C) = 0.75; ambient factor (40 °C) = 1.0
- Nominal capacity = 9.92 ÷ 0.75 = **13.2 TR**

The next model up is **WCP 150 (15 TR)**. At 15 °C outlet the same load would need only a WCP 100 (10 TR), which is why the outlet temperature matters so much.

## Check the water flow too

Each WCP model has a rated water flow and pump. If your process needs more flow than the model's rating, our engineers will check the pump and evaporator, or propose a larger unit.

| Model | Capacity TR | Water flow LPM | Tank litres |
| --- | --- | --- | --- |
| WCP 005 | 0.5 | 6 | 15 |
| WCP 010 | 1 | 10 | 25 |
| WCP 030 | 3 | 32 | 60 |
| WCP 050 | 5 | 52 | 80 |
| WCP 100 | 10 | 100 | 180 |
| WCP 150 | 15 | 155 | 250 |
| WCP 200 | 20 | 202 | 320 |

The full range of ten models is on the [process chillers page](/products/industrial-process-chillers.html).

## Do the sum automatically

The [chiller tonnage calculator](/engineering-tools/chiller-tonnage-calculator.html) applies both factors and picks the WCP model. For loads above 20 TR, send us your duty for a larger or multiple-unit solution.

## Frequently asked questions

### How do I calculate chiller tonnage?
Heat load (TR) = water flow (LPM) × temperature rise (°C) ÷ 50.4. For example, 100 LPM heating up by 5 °C is 9.92 TR. If you know the load in kW, divide by 3.517 to get TR.

### Where does the 50.4 in the chiller formula come from?
1 TR is 3,024 kcal/hr and water carries 1 kcal per kg per °C, so 3,024 ÷ 60 = 50.4 when flow is in litres per minute.

### Why does chilled water outlet temperature change chiller size?
A chiller delivers less capacity at colder water. WCP chillers are rated at 15 °C outlet; at 10 °C the factor is 0.75, so a 9.92 TR load needs 13.2 TR nominal (a WCP 150) instead of a WCP 100.

### What capacity range do WCP process chillers cover?
WCP chillers cover 0.5 to 20 TR in ten models. For loads above 20 TR, send your duty for a larger or multiple-unit solution.
