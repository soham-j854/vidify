FROM node:18-alpine

# Install dependencies for yt-dlp (Python, ffmpeg)
RUN apk add --no-cache python3 py3-pip ffmpeg

# Create a virtual environment and install yt-dlp
# This avoids PEP 668 "externally-managed-environment" errors
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip3 install -U yt-dlp

WORKDIR /app

COPY package*.json ./
# Install ALL dependencies (including devDependencies) so we can build
# Use --legacy-peer-deps to ignore the eslint version conflict
RUN npm install --legacy-peer-deps

COPY . .

# Build the Next.js application
RUN npm run build

# Expose the listening port
EXPOSE 3000

# Next.js collects usage statistics by default, we can disable this
ENV NEXT_TELEMETRY_DISABLED=1

# Ensure Next.js listens on all interfaces (vital for Docker/Railway)
ENV HOSTNAME="0.0.0.0"

# Start the application using npm start
CMD ["npm", "start"]
