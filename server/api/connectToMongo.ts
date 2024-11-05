import { MongoClient } from 'mongodb'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const uri = process.env.MONGODB_URI
let client: MongoClient | null = null

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!client) {
    client = new MongoClient(uri!)
    await client.connect()
  }

  const db = client.db('test')
  const collectionName = req.query.collection as string;

  if (!['bookings', 'favorites', 'properties', 'users'].includes(collectionName)) {
    return res.status(400).json({ error: 'Invalid collection name' })
  }

  const collection = db.collection(collectionName)

  if (req.method === 'GET') {
    const data = await collection.find({}).toArray()
    return res.status(200).json(data)
  }

  if (req.method === 'POST') {
    const newData = req.body;
    const result = await collection.insertOne(newData)
    return res.status(201).json(result)
  }

  // Handle unsupported methods
  return res.status(405).json({ error: 'Method Not Allowed' })
}