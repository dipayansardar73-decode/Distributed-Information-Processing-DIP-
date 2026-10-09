# RailBlazers

### Smart Railway Monitoring and Announcement System

RailBlazers is an early-stage railway safety concept designed to identify approaching trains, verify their movement through multiple independent signals, and automatically provide timely platform announcements.

The idea originated from an observation at **Jadavpur railway station**, where insufficient passenger information could encourage unsafe decisions such as crossing railway tracks without knowing that a train is approaching.

> **Project status:** Interactive software prototype completed. Physical hardware model and field validation are under development.

## Live Website

[Explore the RailBlazers prototype](https://railblazers-safety.grassydog1.chatgpt.site/)

## The Problem

At stations with limited or unreliable announcement infrastructure, passengers may not receive timely information about approaching trains.

This can result in:

- Passengers crossing railway tracks without adequate warning
- Confusion about the arriving train and its destination
- Dependence on manual announcements
- Delayed or missing passenger information
- Greater risk during crowded or low-visibility conditions

RailBlazers explores whether a station can independently recognize an approaching train, verify its identity and direction, and make a reliable announcement before it reaches the platform.

## The Proposed Solution

RailBlazers combines three independent observations:

### 1. Trackside Vision and OCR

A trackside camera captures the front or identifying marker of an approaching train.

The computer-vision system:

- Detects the train
- Locates its visible identification number
- Extracts the number using OCR
- Matches the number with an authorized train database
- Produces a confidence score and an auditable image

### 2. Secure Proximity Identification

An authenticated onboard transmitter communicates with a station receiver when the train enters a defined approach zone.

This provides:

- A unique train identity
- Proximity confirmation
- A second independent identification source
- Operation without depending entirely on a public network

This is presented as a **secure proximity identification system**, rather than a conventional public Wi-Fi connection.

### 3. Route and Location Verification

Location information verifies:

- The train’s current route
- Direction of movement
- Distance from the station
- Expected arrival window

This signal provides additional context and can act as a fallback when one of the local observations is unavailable.

## Two-out-of-Three Decision Rule

RailBlazers does not rely on a single sensor.

An announcement is cleared only when at least **two independent signals agree** on the train identity and approach conditions.

```text
Trackside Vision ───────┐
                        │
Proximity Identity ─────┼──> Verification Engine ──> Platform Announcement
                        │
Route Position ─────────┘
