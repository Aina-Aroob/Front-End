# Glasses Detection App Frontend

A simple web application that detects whether a person in an uploaded image is wearing glasses.

## Features

- Image upload and preview
- Real-time glasses detection
- Responsive design
- Modern UI with Bootstrap

## Setup

1. Clone the repository
2. Update the backend URL in `vercel.json` to point to your API endpoint
3. Deploy to Vercel:
   ```bash
   vercel
   ```

## Development

To run locally:
1. Install a local server (e.g., `live-server` or `http-server`)
2. Run the server in the project directory
3. Open `http://localhost:8080` in your browser

## Deployment

This project is configured for deployment on Vercel:

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Configure environment variables in Vercel dashboard if needed

## Project Structure

- `index.html` - Main HTML file
- `script.js` - JavaScript functionality
- `styles.css` - Custom styles
- `vercel.json` - Vercel deployment configuration

## Backend Integration

The frontend makes POST requests to `/detect` endpoint. Make sure to:
1. Update the backend URL in `vercel.json`
2. Ensure CORS is properly configured on the backend
3. Verify the API endpoint accepts image uploads

## License

MIT 