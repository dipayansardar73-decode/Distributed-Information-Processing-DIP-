# RailBlazers

A research-backed product concept for resilient train detection and automatic passenger announcements at low-infrastructure railway stations.

## The idea

RailBlazers combines three independent signals:

1. trackside camera + OCR,
2. short-range authenticated radio ID, and
3. GPS / operations-feed fallback.

The station announces a train only when at least two sources agree on the same identity. The website includes an interactive simulation of confirmed, degraded, and conflicting conditions.

## Run locally

```bash
npm install
npm run dev
```

For a production-style run:

```bash
npm run build
npm start
```

## Stack

React, Vite, Tailwind CSS, Three.js, Lucide icons, and a small Express production server.

## Important

This is an early-stage engineering concept and interface prototype. It is not connected to live railway systems and is not affiliated with or endorsed by Indian Railways.
