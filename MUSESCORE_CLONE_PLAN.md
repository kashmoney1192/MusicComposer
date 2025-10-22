# 🎵 Free MuseScore Clone - Complete Implementation Plan

## Project Overview
Production-grade web application matching MuseScore core functionality - **100% FREE** using only free-tier services and open-source tools.

## 💰 Cost-Free Architecture

### Services (All Free Tier)
- **Frontend:** Vercel (unlimited hobby projects)
- **Backend:** Railway.app (500 hours/month free) or Render.com (750 hours/month)
- **Database:**
  - Option 1: MongoDB Atlas (512MB free forever)
  - Option 2: Supabase Postgres (500MB, 2 CPU, unlimited API requests)
- **Storage:** Supabase Storage (1GB free)
- **Auth:** Supabase Auth (50,000 MAU free)
- **Search:** Meilisearch (self-hosted on Railway/Render)
- **Real-time:** Socket.io (self-hosted, no cost)
- **Monitoring:**
  - Sentry (5,000 errors/month)
  - Uptime Robot (50 monitors)
  - Better Stack (free tier)
- **CI/CD:** GitHub Actions (2,000 minutes/month)
- **Email:** SendGrid (100 emails/day free)

## 📁 Project Structure

```
musescore-clone/
├── frontend/                 # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── Composer/
│   │   │   │   ├── ComposerPage.tsx
│   │   │   │   ├── Toolbar.tsx
│   │   │   │   ├── StaffCanvas.tsx
│   │   │   │   ├── NoteInputHandler.tsx
│   │   │   │   ├── PlaybackControls.tsx
│   │   │   │   └── ExportPanel.tsx
│   │   │   ├── Viewer/
│   │   │   │   ├── ScoreViewer.tsx
│   │   │   │   └── ScoreRenderer.tsx
│   │   │   ├── Community/
│   │   │   │   ├── BrowseScores.tsx
│   │   │   │   ├── ScoreCard.tsx
│   │   │   │   └── CommentSection.tsx
│   │   │   └── Auth/
│   │   │       ├── LoginForm.tsx
│   │   │       └── SignupForm.tsx
│   │   ├── lib/
│   │   │   ├── vexflow/
│   │   │   │   ├── adapter.ts         # VexFlow integration
│   │   │   │   └── renderer.ts
│   │   │   ├── audio/
│   │   │   │   ├── player.ts          # Tone.js playback
│   │   │   │   └── midi.ts            # MIDI input/output
│   │   │   ├── converters/
│   │   │   │   ├── musicxml.ts        # MusicXML conversion
│   │   │   │   ├── midi.ts            # MIDI conversion
│   │   │   │   └── internal.ts        # Internal format
│   │   │   └── collaboration/
│   │   │       └── yjs-provider.ts    # Yjs CRDT
│   │   ├── stores/
│   │   │   ├── scoreStore.ts          # Zustand store
│   │   │   ├── authStore.ts
│   │   │   └── collabStore.ts
│   │   ├── hooks/
│   │   │   ├── useMidi.ts
│   │   │   ├── useCollab.ts
│   │   │   └── usePlayback.ts
│   │   └── types/
│   │       ├── score.ts               # TypeScript types
│   │       └── api.ts
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── backend/                  # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── scores.ts
│   │   │   ├── users.ts
│   │   │   ├── export.ts
│   │   │   └── search.ts
│   │   ├── controllers/
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── score.service.ts
│   │   │   ├── export.service.ts
│   │   │   └── search.service.ts
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Score.ts
│   │   │   ├── Comment.ts
│   │   │   └── Like.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   ├── rateLimit.ts
│   │   │   └── validation.ts
│   │   ├── websocket/
│   │   │   └── collaboration.ts       # Socket.io handlers
│   │   ├── workers/
│   │   │   └── export-worker.ts       # Background jobs
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
├── docs/
│   ├── API.md                # API documentation
│   ├── SETUP.md              # Setup guide
│   ├── DEPLOYMENT.md         # Deployment guide
│   └── ARCHITECTURE.md       # Architecture docs
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── docker-compose.yml        # Local development
├── .env.example
└── README.md
```

## 🗄️ Data Models

### MongoDB Schema (Using Mongoose)

```typescript
// User Model
interface IUser {
  _id: ObjectId;
  email: string;
  passwordHash?: string;  // Optional for OAuth users
  name: string;
  avatarUrl?: string;
  provider: 'email' | 'google' | 'github';
  providerId?: string;
  createdAt: Date;
  updatedAt: Date;
  scores: ObjectId[];      // Reference to Score
  likedScores: ObjectId[];
}

// Score Model
interface IScore {
  _id: ObjectId;
  title: string;
  description?: string;
  composerName?: string;
  ownerId: ObjectId;       // Reference to User
  visibility: 'public' | 'private' | 'unlisted';

  // Music data (stored as JSON)
  musicData: {
    version: string;       // Format version
    staves: IStave[];
    tempo: number;
    timeSignature: string;
    keySignature: string;
    measures: number;
  };

  // File references
  musicXMLUrl?: string;    // Supabase Storage URL
  pdfUrl?: string;
  midiUrl?: string;
  thumbnailUrl?: string;

  // Metadata
  tags: string[];
  instruments: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  duration?: number;       // in seconds

  // Social
  likes: number;
  views: number;
  forkCount: number;
  originalScoreId?: ObjectId;  // If this is a fork

  // Collaboration
  collaborators: Array<{
    userId: ObjectId;
    role: 'editor' | 'viewer';
  }>;
  yjsState?: Buffer;       // Yjs document state

  // Versioning
  version: number;
  versionHistory: Array<{
    version: number;
    createdAt: Date;
    snapshot: any;
  }>;

  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

// Comment Model
interface IComment {
  _id: ObjectId;
  scoreId: ObjectId;
  userId: ObjectId;
  content: string;
  measure?: number;        // Optional: comment on specific measure
  createdAt: Date;
  updatedAt: Date;
  replies: IComment[];     // Nested comments
}

// Export Job Model
interface IExportJob {
  _id: ObjectId;
  scoreId: ObjectId;
  userId: ObjectId;
  format: 'pdf' | 'musicxml' | 'midi' | 'mp3';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  fileUrl?: string;
  error?: string;
  createdAt: Date;
  completedAt?: Date;
}
```

### Alternative: Supabase/PostgreSQL (Using Prisma)

```prisma
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  passwordHash  String?
  name          String
  avatarUrl     String?
  provider      String    @default("email")
  providerId    String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  scores        Score[]   @relation("OwnedScores")
  comments      Comment[]
  likes         Like[]
  collaborations ScoreCollaborator[]
}

model Score {
  id              String    @id @default(uuid())
  title           String
  description     String?
  composerName    String?
  ownerId         String
  owner           User      @relation("OwnedScores", fields: [ownerId], references: [id])
  visibility      Visibility @default(PRIVATE)

  // JSON fields for music data
  musicData       Json      // Internal score representation

  // File URLs
  musicXMLUrl     String?
  pdfUrl          String?
  midiUrl         String?
  thumbnailUrl    String?

  // Metadata
  tags            String[]
  instruments     String[]
  difficulty      Difficulty?
  duration        Int?

  // Social
  likes           Int       @default(0)
  views           Int       @default(0)
  forkCount       Int       @default(0)
  originalScoreId String?

  // Collaboration
  yjsState        Bytes?

  // Versioning
  version         Int       @default(1)

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  publishedAt     DateTime?

  comments        Comment[]
  likesList       Like[]
  collaborators   ScoreCollaborator[]
  exportJobs      ExportJob[]
}

model Comment {
  id        String   @id @default(uuid())
  scoreId   String
  score     Score    @relation(fields: [scoreId], references: [id], onDelete: Cascade)
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  content   String
  measure   Int?
  parentId  String?
  parent    Comment? @relation("CommentReplies", fields: [parentId], references: [id])
  replies   Comment[] @relation("CommentReplies")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Like {
  id        String   @id @default(uuid())
  scoreId   String
  score     Score    @relation(fields: [scoreId], references: [id], onDelete: Cascade)
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())

  @@unique([scoreId, userId])
}

model ScoreCollaborator {
  id        String   @id @default(uuid())
  scoreId   String
  score     Score    @relation(fields: [scoreId], references: [id], onDelete: Cascade)
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  role      CollaboratorRole
  createdAt DateTime @default(now())

  @@unique([scoreId, userId])
}

model ExportJob {
  id          String   @id @default(uuid())
  scoreId     String
  score       Score    @relation(fields: [scoreId], references: [id])
  userId      String
  format      ExportFormat
  status      JobStatus
  fileUrl     String?
  error       String?
  createdAt   DateTime @default(now())
  completedAt DateTime?
}

enum Visibility {
  PUBLIC
  PRIVATE
  UNLISTED
}

enum Difficulty {
  BEGINNER
  INTERMEDIATE
  ADVANCED
  EXPERT
}

enum CollaboratorRole {
  EDITOR
  VIEWER
}

enum ExportFormat {
  PDF
  MUSICXML
  MIDI
  MP3
}

enum JobStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
}
```

## 🎼 Internal Score Format (JSON)

```typescript
interface InternalScore {
  version: "1.0.0";
  metadata: {
    title: string;
    composer?: string;
    lyricist?: string;
    copyright?: string;
    tempo: number;           // BPM
    timeSignature: {
      beats: number;
      beatType: number;
    };
    keySignature: string;    // e.g., "C", "G", "D", "Bb"
  };

  staves: Array<{
    id: string;
    instrument: string;      // e.g., "Piano", "Violin"
    clef: "treble" | "bass" | "alto" | "tenor";
    measures: Array<{
      number: number;
      voices: Array<{
        id: string;
        notes: Array<{
          id: string;
          type: "note" | "rest" | "chord";
          pitch?: string | string[];  // e.g., "C/4" or ["C/4", "E/4", "G/4"]
          duration: "w" | "h" | "q" | "8" | "16" | "32";
          dotted?: boolean;
          accidental?: "#" | "b" | "n" | "##" | "bb";
          tie?: {
            type: "start" | "stop" | "continue";
            toNoteId?: string;
          };
          articulation?: "staccato" | "accent" | "tenuto" | "marcato";
          dynamics?: "pp" | "p" | "mp" | "mf" | "f" | "ff";
          lyrics?: string;
          tuplet?: {
            actual: number;
            normal: number;
          };
        }>;
      }>;
      repeatStart?: boolean;
      repeatEnd?: { times: number };
      barline?: "single" | "double" | "final" | "repeat";
    }>;
  }>;
}
```

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/signup              - Create new user
POST   /api/auth/login               - Login with email/password
POST   /api/auth/oauth/google        - OAuth Google login
POST   /api/auth/oauth/github        - OAuth GitHub login
POST   /api/auth/refresh             - Refresh access token
POST   /api/auth/logout              - Logout
GET    /api/auth/me                  - Get current user
```

### Scores
```
GET    /api/scores                   - List scores (with filters)
GET    /api/scores/:id               - Get score by ID
POST   /api/scores                   - Create new score
PUT    /api/scores/:id               - Update score
DELETE /api/scores/:id               - Delete score
POST   /api/scores/:id/publish       - Publish score
POST   /api/scores/:id/fork          - Fork a score
GET    /api/scores/:id/versions      - Get version history
POST   /api/scores/:id/restore       - Restore to version
```

### Social
```
POST   /api/scores/:id/like          - Like a score
DELETE /api/scores/:id/like          - Unlike a score
GET    /api/scores/:id/comments      - Get comments
POST   /api/scores/:id/comments      - Add comment
DELETE /api/comments/:id             - Delete comment
```

### Import/Export
```
POST   /api/import/musicxml          - Import MusicXML file
POST   /api/import/midi              - Import MIDI file
POST   /api/scores/:id/export        - Request export (returns job ID)
GET    /api/export-jobs/:jobId       - Check export status
GET    /api/export-jobs/:jobId/download - Download export result
```

### Search
```
GET    /api/search                   - Search scores
GET    /api/search/suggest           - Autocomplete suggestions
```

### Collaboration
```
GET    /api/scores/:id/collaborators - List collaborators
POST   /api/scores/:id/collaborators - Add collaborator
DELETE /api/scores/:id/collaborators/:userId - Remove collaborator
```

### WebSocket Events
```
connect    -> JOIN_ROOM(scoreId)
           -> SYNC_STATE(yjsUpdate)
           -> CURSOR_MOVE(position)
           -> USER_JOINED(user)
           -> USER_LEFT(user)
           -> EDIT_OPERATION(operation)
disconnect -> LEAVE_ROOM
```

## 🚀 Getting Started

### Prerequisites (All Free)
- Node.js 18+ (free)
- Git (free)
- Docker Desktop (free for personal use)
- VS Code (free)

### Setup Steps

1. **Clone and Install**
```bash
git clone <repo-url>
cd musescore-clone

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

2. **Environment Variables**
```bash
# Copy example env files
cp .env.example .env

# Edit .env with your free service credentials:
# - Supabase: https://supabase.com (free tier)
# - MongoDB Atlas: https://www.mongodb.com/cloud/atlas (free 512MB)
# - Sentry: https://sentry.io (5k errors/month free)
```

3. **Run Locally**
```bash
# Start all services with Docker Compose
docker-compose up

# Or run individually:
cd frontend && npm run dev    # http://localhost:5173
cd backend && npm run dev     # http://localhost:3000
```

## 📊 Free Service Limits & Workarounds

### Database (MongoDB Atlas Free)
- **Limit:** 512MB storage
- **Workaround:**
  - Store large files (MusicXML, PDF) in Supabase Storage, only URLs in DB
  - Implement pagination everywhere
  - Archive old scores after 6 months

### Storage (Supabase Free)
- **Limit:** 1GB storage
- **Workaround:**
  - Compress PDFs before storing
  - Generate PDFs on-demand instead of storing
  - Delete exports after 7 days

### Hosting (Vercel/Railway Free)
- **Limit:** 100GB bandwidth/month (Vercel), 500 hours/month (Railway)
- **Workaround:**
  - Use CDN caching aggressively
  - Implement lazy loading
  - Compress all assets

### Search (Self-hosted Meilisearch)
- **Limit:** Railway memory limits
- **Workaround:**
  - Index only published scores
  - Limit search results to 100
  - Use Algolia free tier (10k searches/month) if needed

## 📝 Development Roadmap

This document outlines the complete implementation plan. Next steps:
1. Setup project structure
2. Implement Phase 0-3 (foundation + composer)
3. Add collaboration and export features
4. Implement community features
5. Add tests and deploy

---

**Note:** This is a complete, production-ready plan using ONLY free services. No hidden costs.
