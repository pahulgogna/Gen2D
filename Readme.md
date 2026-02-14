# Gen2D - AI-Powered 2D Video Generation Chat Application

Gen2D is a full-stack application that combines an interactive chat interface with AI-powered video generation. Users can have conversations with Google Gemini AI and generate mathematical animations/videos through natural language prompts.

## Features

- **Interactive Chat Interface**: Chat with Google Gemini AI
- **User Authentication**: Secure signin/signup
- **Chat History Management**: Persist and manage multiple chat sessions
- **AI-Powered Video Generation**: Generate animated videos using Manim based on AI responses
- **Markdown Support**: Rich message rendering with syntax highlighting
- **Cloud Storage**: Video uploads to Cloudinary for easy access

## Tech Stack

- **Next.js** - full-stack web application
- **Python** - Video generation backend
- **Manim** - Mathematical animation engine
- **Cloudinary** - Cloud storage for generated videos

### Database & Infrastructure
- **MongoDB** - Document database for user data and chat history

## Project Structure

```
Gen2D-final/
├── Gen2d/                    # Next.js Frontend
│   ├── app/                  # App router and pages
│   │   ├── (root)/          # Main app routes
│   │   │   └── c/           # Chat interface
│   │   ├── auth/            # Authentication pages (signin, signup)
│   │   └── user/            # User profile
│   ├── components/           # React components
│   │   ├── ChatList.tsx      # Chat display
│   │   ├── InputBox.tsx      # Message input
│   │   ├── MarkdownRenderer.tsx # Rich text rendering
│   │   └── ...
│   ├── lib/                  # Utilities & config
│   │   ├── db.ts            # Database connection
│   │   ├── config.ts        # Environment configuration
│   │   └── utils/           # Helper functions
│   ├── actions/              # Server actions
│   └── public/               # Static assets
├── videoGen/                 # Python Video Generation Backend
│   ├── main.py              # Main video generation script
│   ├── video.py             # Manim video definitions
│   ├── Dockerfile           # Containerization
│   └── requirements.txt      # Python dependencies
└── docker-compose.yaml       # compose file to run mongodb
```

## Getting Started

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/pahulgogna/Gen2D
cd Gen2D
```

2. **Set up environment variables**

Create `.env` in the `Gen2d/` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/gen2d
GOOGLE_API_KEY=your_gemini_api_key
GOOGLE_GEMINI_MODEL=gemini-2.5-flash
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

3. **Start MongoDB**
```bash
docker-compose up -d
```

4. **Install dependencies**
```bash
cd Gen2d
npm install
```

## Create python docker image (required)
```bash
cd videoGen
docker build -t python-gen2d .
```

## Running the Application

**Terminal 1 - Frontend**
```bash
cd Gen2d
npm run dev
```
Frontend will be available at `http://localhost:3000`

### Production Mode

```bash
cd Gen2d
npm run build
npm start
```

## Usage

1. **Create an Account**
   - Navigate to `/auth/signup`
   - Register with email and password

2. **Sign In**
   - Go to `/auth/signin`
   - Enter your credentials

3. **Start Chatting**
   - Access `/c` to view all chats
   - Start a new chat or select an existing one
   - Type messages and interact with Gemini AI

4. **Generate Videos**
   - Request video generation through natural language
   - The system will generate Manim animations

## API Integration

### Google Gemini API
The application uses Google's Generative AI API for manim code generation.

### Cloudinary Integration
Generated videos are uploaded to Cloudinary for secure storage and easy sharing. Ensure your credentials are properly configured in environment variables.

## Key Components

### ChatList & Message Display
- [ChatList.tsx](Gen2d/components/ChatList.tsx) - Renders conversation messages
- [DisplayMessage.tsx](Gen2d/components/DisplayMessage.tsx) - Individual message display
- [MarkdownRenderer.tsx](Gen2d/components/MarkdownRenderer.tsx) - Renders markdown with syntax highlighting

### Authentication
- [Signin.tsx](Gen2d/components/Signin.tsx) - Login form
- [Signup.tsx](Gen2d/components/Signup.tsx) - Registration form
- [auth.ts](Gen2d/app/actions/auth/auth.ts) - Authentication logic

### Video Generation
- [main.py](videoGen/main.py) - Entry point for video rendering
- [video.py](videoGen/video.py) - Manim animation definitions

## Environment Configuration

## Database Schema

The application uses MongoDB with Mongoose models for:
- **Users** - User accounts and authentication
- **Chats** - Chat sessions and message history
- **Messages** - Individual messages with timestamps

See [lib/models/models.ts](Gen2d/lib/models/models.ts) for schema definitions.

## Troubleshooting

**Gemini API errors**: Verify your `GOOGLE_API_KEY` is valid and has the required permissions.

**Video generation fails**: Ensure Manim is properly installed and Cloudinary credentials are correct.

**Database connection issues**: Check MongoDB is running and `MONGODB_URI` is correctly configured.