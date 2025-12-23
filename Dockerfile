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
RUN npm install

COPY . .

# Build the Next.js application
RUN npm run build

# Expose the listening port
EXPOSE 3000

# Start the application using npm start (which runs "next start")
# This automatically respects process.env.PORT
CMD ["npm", "start"]
