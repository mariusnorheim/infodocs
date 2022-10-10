import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '../../../lib/prisma'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, description, url, postId } = req.body
  const session = await getSession({ req })

  // GET method
  if (req.method === 'GET') {
    handleGET(res)
  }
  // POST method
  else if (req.method === 'POST') {
    if (session) {
      const author = session?.user?.email
      handlePOST(name, description, url, author, postId, res)
    } else {
      res.status(401).send({ message: 'Unauthorized' })
    }
  } else {
    throw new Error(`The ${req.method} method is not supported on this route.`)
  }
}

// GET /api/resource
async function handleGET(res) {
  try {
    const resources = await prisma.resource.findMany({
      select: {
        name: true,
        description: true,
        url: true,
      },
    })
    await res.json(JSON.parse(JSON.stringify(resources)))
  } catch (error) {
    console.log(error.message)
  }
}

// POST /api/resource
// Required fields in body: name (string)
// Optional fields in body: description (string)
async function handlePOST(name, description, url, author, postId, res) {
  try {
    const newResource = await prisma.resource.create({
      data: {
        name: name,
        description: description || '',
        url: url,
        author: { connect: { email: author } },
        post: { connect: { id: postId } },
      },
    })
    await res.json(JSON.parse(JSON.stringify(newResource)))
  } catch (error) {
    console.log(error.message)
  }
}
