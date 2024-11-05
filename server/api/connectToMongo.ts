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
  const collectionName = req.query.collection


  if (!['bookings', 'favorites', 'properties', 'users'].includes(collectionName as string)) {
    return res.status(400).json({ error: 'Invalid collection name' });
  }

  const collection = db.collection(collectionName as string)

  if (req.method === 'GET') {
    const data = await collection.find({}).toArray()
    res.status(200).json(data)
  }

  if (req.method === 'POST') {
    const newData = req.body
    const result = await collection.insertOne(newData)
    res.status(201).json(result)
  }
}
