# Vidify - YouTube Video Downloader

## Project Overview
A Next.js application that downloads YouTube videos and audio using the YTStream RapidAPI service.

## Architecture
- **Frontend**: Next.js React app (deployed to Cloudflare Pages)
- **Backend**: Next.js API routes on Render.com
  - `/api/info` - Fetches video metadata
  - `/api/download` - Returns download link for video/audio

## Setup Complete ✅

### Backend (Render.com - Currently Running)
The backend uses the **YTStream RapidAPI** service to bypass YouTube's authentication requirements.

**Deployed at:** Your Render.com URL

**Environment Variables Required:**
- `YTSTREAM_API_KEY` - RapidAPI key for YTStream service

### Frontend (Cloudflare Pages - Optional)
To deploy the frontend separately:
1. Push to GitHub
2. Connect Cloudflare Pages to your repo
3. Build command: `npm run build`
4. Build output: `.next`

Update API calls to point to your Render backend URL.

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
Get direct download link

**Request:**
```json
{
  "url": "https://www.youtube.com/watch?v=...",
  "format": "video|audio"
}
```

**Response:**
```json
{
  "success": true,
  "downloadUrl": "https://download-link-from-ytstream-api...",
  "format": "video|audio"
}
```

## Key Changes from yt-dlp
- Replaced local yt-dlp with YTStream RapidAPI for reliability
- No more bot detection errors
- Works on serverless platforms like Render
- Direct download links returned instead of streaming

## Files Modified
- `lib/ytstream.ts` - New YTStream API wrapper
- `app/api/info/route.ts` - Updated to use YTStream
- `app/api/download/route.ts` - Returns download link
- `app/page.tsx` - Updated download handler for new API response
