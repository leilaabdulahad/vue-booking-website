import express, { Request, Response } from 'express';
import { VercelRequest, VercelResponse } from '@vercel/node';

// Initialize Express app
const app = express();
app.use(express.json());

// Define your routes
app.get('/api/bookings/unavailable/:propertyId', async (req: Request, res: Response) => {
  try {
    const { propertyId } = req.params;
    // Fetch unavailable dates logic here
    const unavailableDates = []; // Replace with actual logic
    res.json({ unavailableDates });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching unavailable dates' });
  }
});

// Wrap the app in a Vercel-compatible handler function
export default function handler(req: VercelRequest, res: VercelResponse) {
  app(req as any, res as any); // Use `as any` to bypass strict type issues for now
}
