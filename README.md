# MetaGen — AI Metadata Generator

React + react-router prototype. Upload photos/video, get AI-generated
title/description/keywords via your own Gemini API key(s), export CSV.

## Run locally
npm install
npm run dev

## Build for deploy (Vercel/Netlify, static hosting)
npm run build
# outputs to /dist

## Notes
- Everything runs client-side: your Gemini key(s) never leave the browser,
  calls go straight from here to Google's API.
- Videos are never uploaded whole — a single frame is grabbed via canvas
  and sent as a JPEG, same pipeline as a photo.
- Add multiple keys in Chemistry (settings) to build a rotation pool —
  if one hits a rate limit mid-batch, generation quietly moves to the next.
