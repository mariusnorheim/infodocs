import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '../../../lib/prisma'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, description } = req.body
  const session = await getSession({ req })

  // GET method
  if (req.method === 'GET') {
    handleGET(res)
  }
  // POST method
  else if (req.method === 'POST') {
    if (session) {
      handlePOST(name, description, res)
    } else {
      res.status(401).send({ message: 'Unauthorized' })
    }
  } else {
    throw new Error(`The ${req.method} method is not supported on this route.`)
  }
}

// GET /api/category
async function handleGET(res) {
  try {
    const categories = await prisma.category.findMany({
      select: {
        name: true,
        description: true,
      },
    })
    await res.json(JSON.parse(JSON.stringify(categories)))
  } catch (error) {
    console.log(error.message)
  }
}

// POST /api/category
// Required fields in body: name (string)
// Optional fields in body: description (string)
async function handlePOST(name, description, res) {
  try {
    const newCategory = await prisma.category.create({
      data: {
        name: name,
        description: description || '',
      },
    })
    await res.json(JSON.parse(JSON.stringify(newCategory)))
  } catch (error) {
    console.log(error.message)
  }
}
