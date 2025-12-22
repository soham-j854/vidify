# Vidify - YouTube Video Downloader

A modern Next.js web application for downloading YouTube videos and audio in high quality. Built with Next.js 14+ App Router, TypeScript, and Tailwind CSS.

## Features

- 🎥 Download YouTube videos in multiple quality options (144p to 2160p)
- 🎵 Download audio-only in high quality (M4A format)
- 🖼️ Video thumbnail preview
- 📊 Video metadata display (title, duration, channel, views)
- 🎨 Modern, responsive UI with dark mode support
- ⚡ Fast and efficient streaming downloads
- 🔒 Secure URL validation and error handling

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** and npm
- **Python 3.7+** (required for yt-dlp)
- **yt-dlp** - Install using: `pip install yt-dlp`
- **ffmpeg** (optional, for audio conversion) - Recommended for better audio quality

### Installing yt-dlp

```bash
pip install yt-dlp
```

Or using pipx (recommended):
```bash
pipx install yt-dlp
```

### Installing ffmpeg (Optional)

**Windows:**
- Download from [ffmpeg.org](https://ffmpeg.org/download.html)
- Add to PATH

**macOS:**
```bash
brew install ffmpeg
```

**Linux:**
```bash
sudo apt-get install ffmpeg
```

## Getting Started

1. **Clone the repository** (if applicable) or navigate to the project directory

2. **Install dependencies:**
```bash
npm install
```

3. **Run the development server:**
```bash
npm run dev
```

4. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
vidify/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Main download page
│   ├── api/
│   │   ├── info/route.ts       # Get video info (title, thumbnail, formats)
│   │   └── download/route.ts   # Download video/audio
│   └── globals.css             # Global styles
├── components/
│   ├── VideoInput.tsx          # URL input component
│   ├── VideoPreview.tsx        # Thumbnail and video info display
│   └── QualitySelector.tsx     # Quality/format selection
├── lib/
│   ├── ytdlp.ts                # yt-dlp wrapper utilities
│   ├── types.ts                # TypeScript types
│   └── utils.ts                # Utility functions
├── public/                     # Static assets
├── package.json
├── tsconfig.json
└── README.md
```

## Usage

1. **Enter a YouTube URL** in the input field (supports various YouTube URL formats)
2. **Click "Fetch Info"** to retrieve video metadata
3. **Select format** (Video or Audio) and quality (for video)
4. **Click "Download"** to start the download

The application will stream the file directly to your browser.

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Technical Details

### Architecture

The application uses:
- **Next.js 14+** with App Router for both frontend and backend
- **API Routes** for server-side yt-dlp integration
- **Streaming** for efficient file downloads
- **TypeScript** for type safety
- **Tailwind CSS** for styling

### Security

- URL validation and sanitization
- Command injection prevention (using spawn with argument arrays)
- Input length limits
- Error handling for edge cases

### Supported YouTube URL Formats

- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://m.youtube.com/watch?v=VIDEO_ID`

## Troubleshooting

### yt-dlp not found
- Ensure yt-dlp is installed: `pip install yt-dlp`
- Verify installation: `yt-dlp --version`
- Make sure Python is in your PATH

### Download fails
- Check that the video is not private or unavailable
- Verify your internet connection
- Try a different video URL

### Audio conversion issues
- Install ffmpeg for better audio format support
- The app will use the best available audio format if ffmpeg is not installed

## License

This project is for educational purposes. Please respect YouTube's Terms of Service and copyright laws when downloading content.

