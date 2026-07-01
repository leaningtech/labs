---
title: VitalStream
description: An AI-powered patient monitoring system with predictive triage built inside a secure browser sandbox.
repository_url: https://github.com/Ella-Afonso/Real-Time-Patient-Monitoring-AI
author: The Bellayesian Inferrers
project_type:
  - Hackathon Project
niche: Healthcare
tags:
  - BrowserPod
score: 80
hero_image: "./vitalstream.png"
---

## What is VitalStream?

VitalStream is a patient vital signs monitoring dashboard that combines real-time IoT vital simulations, alert scoring, predictive trend detection, and AI clinical decision support. The system is designed to help clinical staff identify which patients will require attention next and organize handovers safely.

The project won the **Accessibility & Healthcare Award** at the 2026 AI in the Box Hackathon.

## What the demo includes

- **Ward Monitoring**: Real-time IoT simulator streaming heart rate, blood pressure, SpO₂, temperature, and respiratory rate for patients across 12 wards.
- **Predictive Acuity Alerting**: Flags patients whose vitals are trending toward danger limits (e.g. rising heart rate indicating tachycardia) before they breach normal thresholds.
- **AI Handover Reports**: Generates structured, NHS-compliant shift handover documents detailing shift summaries, alert histories, and ward recommendations.
- **Voice & Telephony Alerts**: Announces alerts using browser-native text-to-speech and triggers automated phone calls to on-call staff via Twilio.

## How it works

VitalStream runs its entire data server and clinical logic inside a BrowserPod sandbox to ensure GDPR compliance.

When launched, BrowserPod boots a local Node.js environment client-side. The sandbox runs an Express.js server that generates patient vitals using a Gaussian-distributed random algorithm. To provide patient assessments and query answering, the Express server interacts with the Anthropic Claude API using credentials passed from a local environment configuration. All clinical logs and sensitive patient details are processed locally within the browser tab's secure boundary, preventing any patient data from being sent to external databases or servers.
