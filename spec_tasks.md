# OnlyEngine.x Project Tasks

## Overview
OnlyEngine.x is a SaaS platform designed to automate the generation of hyper-realistic MoneyShots (adult content images, e.g., feet or full body), ensuring quality through AI agents, targeting subscribers based on preferences, and streaming content to platforms like OnlyFans, Fansly, and FeetFinder. It operates legally with fictional, disclosed AI-generated content to help creators reverse revenue dips (e.g., 5% MoM). This document outlines your tasks and user journey based on the design as of September 4, 2025, incorporating local development with ComfyUI, VPS hosting plans, and a UI baseline from the creative-agency-portfolio.

## Your Tasks

### Phase 1: MVP Development (Months 1-3)
#### Month 1-2: Local Development and Initial Setup

- **[Task 1: Local Development Environment Setup]**
  - Install Python 3.12 and Git (via Homebrew: `brew install python git`).
  - Clone ComfyUI: `git clone https://github.com/comfyanonymous/ComfyUI.git`.
  - Install ComfyUI requirements: `cd ComfyUI; pip install -r requirements.txt`.
  - Install PyTorch with MPS optimization: `pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu`.
  - Configure Mixtral (Ollama): Install Ollama, pull Mixtral: `ollama pull mixtral`.
  - Set up Supabase local (via Supabase CLI: `supabase start`).
  - Action: Follow ComfyUI, Ollama, and Supabase CLI documentation for local setup.
  - Deadline: End of Month 1.
  - Resources: ComfyUI GitHub, Ollama docs, Supabase CLI.

- **[Task 2: Diffusion Model Integration and Initial QA]**
  - Download Pony Diffusion XL v6 from CivitAI (~5GB) and place in `ComfyUI/models/checkpoints`.
  - Test image generation in ComfyUI with a basic workflow (Text Prompt → Sampler → VAE Decode → Save Image).
  - Develop initial QA script with Mixtral (Python code to analyze generated image, e.g., CLIP description, reprompt if mutated).
  - Action: Set up ComfyUI workflow, validate prompt output, implement and test basic QA loop.
  - Deadline: Mid-Month 2.
  - Resources: CivitAI, Mixtral examples, ComfyUI documentation.

- **[Task 3: Automation and Backend Development (Local)]**
  - Install Puppeteer: `npm install puppeteer`.
  - Develop FastAPI endpoints (e.g., `/generate`) to integrate with ComfyUI workflows.
  - Simulate upload workflow locally using Puppeteer.
  - Action: Implement FastAPI endpoints, test local image generation and storage in Supabase, simulate content upload.
  - Deadline: End of Month 2.
  - Resources: Puppeteer docs, FastAPI tutorial, Supabase documentation.

- **[Task 4: UI/Frontend Baseline Development]**
  - Set up Next.js project.
  - Integrate Shadcn UI components.
  - Use `creative-agency-portfolio` as a visual and structural baseline for the frontend.
  - Implement core UI components: prompt input, image preview, basic metrics dashboard.
  - Action: Scaffold Next.js app, install Shadcn, adapt components from baseline, build initial UI.
  - Deadline: End of Month 2.
  - Resources: Next.js docs, Shadcn UI documentation, `creative-agency-portfolio` codebase, v0.app design inspiration.

#### Month 3: Feature Integration, Testing, and VPS Migration

- **[Task 5: Targeting and Marketing Logic]**
  - Integrate OnlyFansAPI data for subscriber information.
  - Implement Mixtral clustering logic for targeted MoneyShot suggestions.
  - Action: Code targeting logic, test DM automation locally.
  - Deadline: Mid-Month 3.
  - Resources: OnlyFansAPI docs, Mixtral examples.

- **[Task 6: VPS Infrastructure Setup and Migration]**
  - Sign up for Hostinger VPS, choose Ubuntu 22.04 with GPU add-on.
  - SSH into VPS, update system, install NVIDIA drivers, install Docker.
  - Migrate ComfyUI to VPS: Clone ComfyUI, create Dockerfile, build image, run Docker container.
  - Migrate FastAPI backend to VPS: Dockerize FastAPI app, deploy.
  - Action: Follow VPS setup and migration walk-through steps.
  - Deadline: End of Month 3.
  - Resources: Hostinger VPS guide, Docker documentation.

- **[Task 7: Beta Launch Preparation and Metrics]**
  - Deploy React frontend on Hostinger.
  - Set up initial metrics tracking with Supabase and Prometheus/Grafana.
  - Action: Build and deploy the complete application, configure metrics, test end-to-end MoneyShots flow on VPS.
  - Deadline: End of Month 3.
  - Resources: React docs, Grafana setup, Prometheus documentation.

### Phase 2: Custom Model and Scaling (Months 4+)
#### Month 5+: Post-Traction Development

- **[Task 8: Custom Diffusion Model Fine-Tuning]**
  - Generate 1,000 synthetic prompts with Mixtral for dataset creation.
  - Fine-tune Pony Diffusion XL with DreamBooth/LoRA on VPS GPU.
  - Action: Code prompt generator, train custom model, validate MoneyShots outputs.
  - Deadline: Mid-Month 5 (if $10K revenue traction is achieved).
  - Resources: Diffusers fine-tuning guide, Supabase storage docs.

- **[Task 9: Enhanced QA and Targeting]**
  - Implement YOLO-based anomaly detection with Mixtral-generated code for advanced QA.
  - Upgrade targeting with scikit-learn clustering for improved subscriber matching.
  - Action: Integrate YOLO, train clustering model, test accuracy and effectiveness.
  - Deadline: End of Month 5.
  - Resources: YOLO docs, scikit-learn tutorial.

- **[Task 10: Authentication and Payments Integration]**
  - Add Firebase Auth and Stripe via Supabase Edge Functions.
  - Implement and test payment flows for subscription tiers (e.g., $49/month tier).
  - Action: Configure Firebase, integrate Stripe API, validate transactions.
  - Deadline: End of Month 5.
  - Resources: Supabase auth docs, Stripe API guide.

- **[Task 11: Scaling Infrastructure and Optimization]**
  - Migrate model hosting to Modal.com for scalable and cost-effective inference.
  - Optimize overall platform performance and costs.
  - Action: Migrate models, monitor resource usage, implement performance enhancements.
  - Deadline: Ongoing from Month 6.
  - Resources: Modal.com docs.

## User Journey

### Onboarding Journey
- **Step 1: Discovery**
  - User (e.g., OnlyFans creator) finds OnlyEngine.x via Reddit/X.
  - Action: Clicks link, views landing page with demo video.
  - Expectation: Clear value prop (e.g., "Automate 80% of MoneyShots creation with OnlyEngine.x").

- **Step 2: Sign-Up**
  - User navigates to signup (manual initially, automated later).
  - Action: Enters email, agrees to terms (disclosure of AI use).
  - Expectation: Quick, no payment yet (freemium trial).

- **Step 3: Account Setup**
  - User links OnlyFans account via API authorization.
  - Action: Grants access, selects platforms (OnlyFans, FeetFinder).
  - Expectation: Seamless integration, privacy assurance.

### Content Creation Journey
- **Step 1: Prompt Input**
  - User enters prompt (e.g., "sexy feet, blue polish") in OnlyEngine.x UI (React app integrating ComfyUI).
  - Action: Submits via React interface, sees preview.
  - Expectation: Instant feedback, customizable options.

- **Step 2: Generation and QA**
  - OnlyEngine.x generates MoneyShots, agents fix mutations (e.g., extra toes).
  - Action: User reviews refined MoneyShots, approves or adjusts.
  - Expectation: High-quality, mutation-free output (<3 iterations).

- **Step 3: Targeting Setup**
  - User selects subscriber preferences (e.g., "large arches" fans).
  - Action: OnlyEngine.x suggests targets based on API data.
  - Expectation: Relevant targeting, easy selection.

### Distribution Journey
- **Step 1: Scheduling Uploads**
  - User schedules post time or automates streaming with OnlyEngine.x.
  - Action: Sets date, attaches MoneyShots, confirms.
  - Expectation: Hassle-free scheduling, multi-platform support.

- **Step 2: Marketing**
  - OnlyEngine.x sends personalized DMs to targeted subscribers.
  - Action: User reviews draft messages, approves.
  - Expectation: Increased engagement (20-30% boost).

- **Step 3: Performance Review**
  - User checks metrics (e.g., views, revenue) via OnlyEngine.x dashboard.
  - Action: Analyzes trends, adjusts strategy.
  - Expectation: Real-time insights, actionable data.

### Upgrade and Support Journey
- **Step 1: Trial to Paid**
  - User exhausts 10-image free tier, considers Pro ($199/month).
  - Action: Upgrades via future payment system, unlocks unlimited.
  - Expectation: Smooth transition, clear benefits.

- **Step 2: Support Request**
  - User encounters issue (e.g., upload fail).
  - Action: Submits query (future support channel).
  - Expectation: Responsive help, self-service options.

- **Step 3: Feedback Loop**
  - User provides NPS via OnlyEngine.x survey.
  - Action: Rates experience, suggests features.
  - Expectation: Impactful input, potential rewards.

### Edge Cases
- **Technical Failure**: MoneyShots generation fails QA.
  - Action: OnlyEngine.x alerts user, offers manual retry.
  - Expectation: Graceful recovery.
- **Ban Risk**: Platform detects automation.
  - Action: User pauses, adjusts proxies, re-snapshots.
  - Expectation: Minimal downtime.
- **Data Privacy**: User questions data use.
  - Action: OnlyEngine.x displays consent policy.
  - Expectation: Transparency, trust.

## Tech Stack & Costs
- **Core**: Python, Mixtral (Ollama), Supabase, ComfyUI, Diffusers, Puppeteer, Next.js, Shadcn UI.
- **Cost**: Mixtral free, Supabase $25/month, Hostinger $3.95/month, GPU $10/month, OnlyFansAPI $299/year, Proxies $1/GB.
- **IP Avoidance**: Synthetic datasets.

## Risks & Mitigation
- **Legal**: Disclose AI; monitor laws.
- **Bans**: Low-volume, proxies.
- **Ethics**: Opt-in data.
