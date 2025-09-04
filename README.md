# OnlyEngine.x - AI-Powered Content Generation & Distribution Platform

## Overview

OnlyEngine.x is a comprehensive SaaS platform that automates content generation, quality assurance, audience targeting, and multi-platform distribution using advanced AI technology.

## Architecture

### Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: FastAPI (Python), Uvicorn
- **AI/ML**: ComfyUI, Stable Diffusion, Mixtral (via Ollama)
- **Database**: Supabase (PostgreSQL)
- **Infrastructure**: Docker, Docker Compose
- **Platforms**: Multi-platform API integrations

## Features

### 🎨 Content Generation
- AI-powered image generation using Stable Diffusion
- ComfyUI workflow integration
- Multiple style presets (photorealistic, artistic, abstract)
- Quality tiers (standard, high, ultra)

### ✅ Quality Assurance
- Automated quality checking
- Mutation detection
- Content enhancement suggestions
- Iterative improvement system

### 🎯 Smart Targeting
- Audience segmentation
- Preference analysis
- Engagement optimization
- Platform-specific targeting

### 📅 Scheduling & Distribution
- Multi-platform support
- Automated scheduling
- Batch processing
- Optimal timing recommendations

### 📊 Analytics Dashboard
- Real-time metrics
- Performance tracking
- ROI analysis
- Cross-platform analytics

### 🔄 Workflow Automation
- Customizable workflows
- Sequential task execution
- Error handling and retries
- Notification system

## Project Structure

```
OnlyEngine.ai/
├── creative-agency-portfolio/      # Frontend (Next.js)
│   ├── app/                       # App router pages
│   │   ├── dashboard/            # Main dashboard
│   │   ├── library/              # Content library
│   │   ├── auth/                 # Authentication
│   │   ├── landing/              # Landing page
│   │   └── api/                  # API routes
│   ├── components/               # React components
│   │   ├── ui/                   # Shadcn UI components
│   │   └── layout/               # Layout components
│   └── lib/                      # Utilities and configs
├── backend/                       # FastAPI backend
│   ├── main.py                   # Main API server
│   ├── comfyui_integration.py    # ComfyUI handler
│   ├── platform_integrations.py  # Platform APIs
│   ├── workflow_automation.py    # Workflow engine
│   └── requirements.txt          # Python dependencies
├── workflows/                     # ComfyUI workflows
├── models/                        # AI models storage
├── docker-compose.yml            # Docker orchestration
└── README.md                     # Documentation
```

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Python 3.12+
- Node.js 20+
- GPU (optional, for local AI model inference)

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/OnlyEngine.ai.git
cd OnlyEngine.ai
```

2. **Set up environment variables**
```bash
cp creative-agency-portfolio/.env.example creative-agency-portfolio/.env
# Edit .env with your configuration
```

3. **Install dependencies**

Frontend:
```bash
cd creative-agency-portfolio
npm install --legacy-peer-deps
```

Backend:
```bash
cd backend
pip install -r requirements.txt
```

4. **Start development servers**

Frontend:
```bash
cd creative-agency-portfolio
npm run dev
```

Backend:
```bash
cd backend
uvicorn main:app --reload
```

5. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Docker Deployment

1. **Build and start all services**
```bash
docker-compose up --build
```

2. **Access services**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- ComfyUI: http://localhost:8188
- Ollama: http://localhost:11434

## Configuration

### ComfyUI Setup

1. Download models and place in `models/` directory
2. Configure workflows in `workflows/` directory
3. Update COMFYUI_URL in environment variables

### Supabase Setup

1. Create a Supabase project
2. Get your project URL and anon key
3. Update environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Platform API Keys

Configure platform integrations in `.env`:
```env
ONLYFANS_API_KEY=your_api_key
FANSLY_API_KEY=your_api_key
FEETFINDER_API_KEY=your_api_key
```

## API Documentation

### Authentication
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}
```

### Content Generation
```http
POST /api/generate
Content-Type: application/json
Authorization: Bearer <token>

{
  "prompt": "Beautiful sunset landscape",
  "style": "photorealistic",
  "quality": "high"
}
```

### Workflow Execution
```http
POST /api/workflow/execute
Content-Type: application/json
Authorization: Bearer <token>

{
  "workflow_id": "full_pipeline",
  "params": {
    "prompt": "Your prompt here"
  }
}
```

## Development Workflow

### Phase 1: MVP (Months 1-3)
- [x] Local development environment setup
- [x] Basic UI components
- [x] FastAPI backend structure
- [x] ComfyUI integration
- [x] Authentication system
- [x] Content library management
- [x] Platform API integrations
- [x] Workflow automation

### Phase 2: Enhancement (Months 4+)
- [ ] Custom model fine-tuning
- [ ] Advanced QA with YOLO
- [ ] ML-based targeting
- [ ] Payment integration
- [ ] Scaling infrastructure

## Testing

### Run tests
```bash
# Frontend tests
cd creative-agency-portfolio
npm test

# Backend tests
cd backend
pytest
```

## Deployment

### VPS Deployment

1. Set up Ubuntu 22.04 VPS with GPU
2. Install Docker and NVIDIA drivers
3. Clone repository
4. Configure environment variables
5. Run Docker Compose

### Production Considerations

- Use HTTPS with SSL certificates
- Set up proper authentication
- Configure rate limiting
- Implement logging and monitoring
- Set up backup strategies
- Use CDN for static assets

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Support

For support, email support@onlyengine.x or create an issue in the repository.

## Acknowledgments

- ComfyUI for workflow management
- Stable Diffusion for image generation
- Mixtral/Ollama for LLM capabilities
- Shadcn UI for component library
- Supabase for backend infrastructure

---

**Version**: 1.0.0  
**Last Updated**: September 2025