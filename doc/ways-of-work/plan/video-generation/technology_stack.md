# Technology Stack

The project uses a modern, serverless-friendly stack optimized for performance, scalability, and developer experience.

## Frontend & Core Framework
- **Next.js (App Router)**: The core React framework used for server-rendered pages, API routes, and Server Actions.
- **React**: UI library.
- **Tailwind CSS**: For utility-first styling.
- **Framer Motion, MagicUI, HeroUI, Aceternity & shadcn/ui**: For modern, smooth animations and robust, pre-built interactive UI components.
- **Clerk**: Handles user authentication and session management.

## Backend & Database
- **Prisma**: Type-safe ORM used to interact with the Supabase PostgreSQL database.
- **Supabase (PostgreSQL)**: The primary cloud-hosted relational database storing user data, video metadata, and job statuses.
- **Upstash Redis**: Serverless Redis database used to manage the background job queues.
- **BullMQ**: Powerful Redis-based queue for Node.js. It manages the asynchronous video processing jobs (retry logic, concurrency, delays).

## AI Models & Services
- **Script & Content**: Google GenAI (Gemini), Groq SDK (fallback).
- **Text-to-Speech (TTS)**: 
  - *Primary*: Gemini 2.5 Flash/Pro TTS
  - *Fallback 1*: ElevenLabs (`@elevenlabs/elevenlabs-js`)
  - *Fallback 2*: Groq TTS
- **Image Generation**: HuggingFace Inference, Replicate, SiliconFlow (via generic fetch/OpenAI-compatible APIs).
- **Caption Generation**: AssemblyAI (for transcribing generated audio and timing).

## Storage & Cloud
- **AWS S3**: Cloud object storage used to store generated audio `.wav` files, generated image assets, and final rendered videos.

## Video Rendering
- **Remotion**: Used for programmatic video generation and composition using React.
