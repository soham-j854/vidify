# Vidify - YouTube Video Downloader

## Project Overview
A Next.js application that downloads YouTube videos and audio using yt-dlp.

## Architecture
- **Frontend**: Next.js React app (can be deployed to Cloudflare Pages)
- **Backend**: Next.js API routes running on Replit
  - `/api/info` - Fetches video metadata
  - `/api/download` - Streams video/audio downloads

## Deployment

### Backend (Replit)
The backend is configured for VM deployment on Replit using `npm run build` and `npm run start`. This ensures yt-dlp and all dependencies are available.

To deploy:
1. Click the "Publish" button in Replit
2. Select "VM" deployment type
3. Your backend API will be available at: `https://[your-replit-url].repl.co`

### Frontend (Cloudflare Pages - Optional)
To deploy the frontend separately:
1. Push the code to GitHub
2. In Cloudflare Pages, connect your GitHub repo
3. Build command: `npm run build`
4. Build output: `.next`
5. Framework preset: Next.js

Update the API calls to point to your Replit backend URL.

## Dependencies
- `next` - React framework
- `yt-dlp` - Video download tool (system binary)
- Standard Node.js packages

## API Endpoints

### POST /api/info
Get video metadata

**Request:**
```json
{
  "url": "https://www.youtube.com/watch?v=..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "video_id",
    "title": "Video Title",
    "thumbnail": "https://...",
    "duration": 240,
    "uploader": "Channel Name",
    "formats": []
  }
}
```

### POST /api/download
Download video or audio (returns stream)

**Request:**
```json
{
  "url": "https://www.youtube.com/watch?v=...",
  "format": "video|audio",
  "quality": "720p|1080p|best"
}
```

**Response:** File stream (mp4 or m4a)

## Notes
- yt-dlp must be installed on the deployment environment
- Backend requires VM deployment (not autoscale) due to yt-dlp dependency
- The app validates YouTube URLs and prevents invalid requests
