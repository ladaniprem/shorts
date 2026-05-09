# Project Plan & Architecture Flow

## Overview
Shorts is an AI-powered pipeline application designed to automatically generate short-form videos (like YouTube Shorts, TikToks, and Instagram Reels) from user prompts or long-form videos. It leverages multiple AI models to write scripts, generate TTS audio, and create image assets, combining them into a final video output.

## Architecture Flow

The system operates on an asynchronous background processing model using BullMQ and Redis to ensure reliability and scalability.

```mermaid
graph TD
    %% User Flow
    A[User UI (Next.js)] -->|Submits Prompt / Video URL| B(API / Server Action)
    B -->|Creates Record & Flags Processing| C[(PostgreSQL DB via Prisma)]
    B -->|Dispatches Job| D[BullMQ Queue on Redis]

    %% Worker Flow
    D -->|Picks up Job| E[Background Worker]
    
    subgraph Video Pipeline
        E --> F1[Script Generation]
        F1 --> F2[Audio TTS Generation]
        F2 --> F3[Caption Extraction / Formatting]
        F3 --> F4[Image Asset Generation]
        F4 --> F5[Video Rendering / Assembly]
    end
    
    %% Storage
    F2 -->|Uploads Audio| G[(AWS S3 Bucket)]
    F5 -->|Uploads Final Video| G
    
    %% Status
    E -->|Updates Status| C
    
    %% Output
    C -.->|Polls/Subscribes Status| A
```

## Project Plan
- **Phase 1: Infrastructure Setup**: Setting up Next.js app router, Clerk authentication, Prisma ORM, and Upstash Redis. *(Completed)*
- **Phase 2: Core Pipeline**: Implementing the background worker, job queue, and integrating AI services (Gemini, Groq, ElevenLabs). *(Completed)*
- **Phase 3: Fallback Chains**: Creating resilient API pipelines (e.g., fallback from Gemini TTS to ElevenLabs to Groq TTS) to handle timeouts and rate limits. *(Completed)*
- **Phase 4: UI/UX & Output Management**: Building out the dashboard, user credits, video gallery, and download functionalities.
- **Phase 5: Scaling & Monetization**: Adding Razorpay integration for premium tiers and optimizing worker concurrency.
