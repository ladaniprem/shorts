---
goal: Design and Implement the Shorts AI Video Generation Pipeline
version: 1.0
date_created: 2026-05-04
last_updated: 2026-05-04
owner: Prem
status: 'Completed'
tags: [feature, architecture, backend]
---

# Introduction

![Status: Completed](https://img.shields.io/badge/status-Completed-brightgreen)

This plan outlines the architecture and implementation steps for the automated Shorts AI Video Generation Pipeline. It handles converting user prompts or long-form videos into fully narrated, edited, and captioned short-form videos using an asynchronous job queue.

## 1. Requirements & Constraints

- **REQ-001**: System must generate a script from user prompt using LLMs.
- **REQ-002**: System must convert script to audio using a multi-model TTS fallback chain (Gemini, ElevenLabs, Groq) to avoid rate limits.
- **REQ-003**: System must generate images based on the script.
- **REQ-004**: System must programmatically assemble video, audio, and captions.
- **CON-001**: Background processing must be asynchronous to prevent UI blocking and Vercel timeouts.
- **PAT-001**: Use BullMQ and Redis for robust queue management.

## 2. Implementation Steps

### Implementation Phase 1: Infrastructure Setup

- GOAL-001: Set up Next.js app router, Clerk authentication, Prisma ORM, and Upstash Redis.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-001 | Initialize Next.js, Tailwind, HeroUI, MagicUI, and shadcn/ui | ✅ | 2026-05-01 |
| TASK-002 | Integrate Clerk for auth | ✅ | 2026-05-01 |
| TASK-003 | Configure Prisma and Supabase (PostgreSQL) | ✅ | 2026-05-02 |
| TASK-004 | Setup BullMQ and Upstash Redis | ✅ | 2026-05-02 |

### Implementation Phase 2: Core AI Pipeline

- GOAL-002: Implement the worker queue and AI integrations.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-005 | Create Redis connection singleton and silence ECONNRESET | ✅ | 2026-05-03 |
| TASK-006 | Implement Script generation via GenAI/Groq | ✅ | 2026-05-03 |
| TASK-007 | Implement Audio generation with chunking and fallback | ✅ | 2026-05-04 |
| TASK-008 | Implement Image generation via SiliconFlow/Replicate | ✅ | 2026-05-04 |

### Implementation Phase 3: Video Assembly

- GOAL-003: Assemble final video using Remotion and upload to S3.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-009 | Setup AWS S3 bucket connection for asset storage | ✅ | 2026-05-04 |
| TASK-010 | Implement Remotion rendering logic | ✅ | 2026-05-04 |

## 3. Alternatives

- **ALT-001**: Synchronous API processing instead of background worker. Rejected due to Vercel/Next.js API timeout limits.
- **ALT-002**: Relying on a single TTS provider. Rejected due to high failure rate and strict rate limits; fallback chain implemented instead.

## 4. Dependencies

- **DEP-001**: Upstash Redis for BullMQ.
- **DEP-002**: AWS S3 for generated asset storage (`.wav`, `.mp4`).
- **DEP-003**: Multiple AI API Keys (Gemini, Groq, ElevenLabs, HuggingFace).

## 5. Files

- **FILE-001**: `worker/worker.ts` - Main BullMQ worker processing jobs.
- **FILE-002**: `lib/queue.ts` - Redis and BullMQ setup.
- **FILE-003**: `app/actions/audio.ts` - TTS generation logic with multi-fallback.
- **FILE-004**: `prisma/schema.prisma` - Database schema.

## 6. Testing

- **TEST-001**: Verify queue recovery on worker restart (stuck jobs marked as failed).
- **TEST-002**: Verify TTS fallback works seamlessly when the primary API key is invalid or rate-limited.

## 7. Risks & Assumptions

- **RISK-001**: Upstash Redis connection may drop (ECONNRESET). Addressed via custom retry strategy and global log suppression.
- **ASSUMPTION-001**: AI APIs might be unstable; system assumes occasional network failures and implements retry/fallback for image and audio.

## 8. Related Specifications / Further Reading

- [Next.js App Router Docs](https://nextjs.org/docs)
- [BullMQ Documentation](https://docs.bullmq.io/)
- [Upstash Redis Docs](https://upstash.com/docs/redis/overall/getstarted)
