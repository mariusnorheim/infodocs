import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '../../../lib/prisma'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, description, categoryId } = req.body
  const session = await getSession({ req })

  // GET method
  if (req.method === 'GET') {
    handleGET(res)
  }
  // POST method
  else if (req.method === 'POST') {
    if (session) {
      handlePOST(name, description, categoryId, res)
    } else {
      res.status(401).send({ message: 'Unauthorized' })
    }
  } else {
    throw new Error(`The ${req.method} method is not supported on this route.`)
  }
}

// GET /api/group
async function handleGET(res) {
  try {
    const groups = await prisma.group.findMany({
      select: {
        name: true,
        description: true,
      },
    })
    await res.json(JSON.parse(JSON.stringify(groups)))
  } catch (error) {
    console.log(error.message)
  }
}

// POST /api/group
// Required fields in body: name (string)
// Optional fields in body: description (string)
async function handlePOST(name, description, categoryId, res) {
  try {
    const newGroup = await prisma.group.create({
      data: {
        name: name,
        description: description || '',
        category_id: categoryId,
      },
    })
    await res.json(JSON.parse(JSON.stringify(newGroup)))
  } catch (error) {
    console.log(error.message)
  }
}
