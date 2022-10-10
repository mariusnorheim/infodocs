import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '../../../lib/prisma'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, description, content, postId } = req.body
  const session = await getSession({ req })

  // GET method
  if (req.method === 'GET') {
    handleGET(res)
  }
  // POST method
  else if (req.method === 'POST') {
    if (session) {
      const author = session?.user?.email
      handlePOST(name, description, content, author, postId, res)
    } else {
      res.status(401).send({ message: 'Unauthorized' })
    }
  } else {
    throw new Error(`The ${req.method} method is not supported on this route.`)
  }
}

// GET /api/note
async function handleGET(res) {
  try {
    const notes = await prisma.note.findMany({
      select: {
        name: true,
        description: true,
        content: true,
      },
    })
    await res.json(JSON.parse(JSON.stringify(notes)))
  } catch (error) {
    console.log(error.message)
  }
}

// POST /api/note
// Required fields in body: name (string)
// Optional fields in body: description (string)
async function handlePOST(name, description, content, author, postId, res) {
  try {
    const newNote = await prisma.note.create({
      data: {
        name: name,
        description: description || '',
        content: content,
        author: { connect: { email: author } },
        post: { connect: { id: postId } },
      },
    })
    await res.json(JSON.parse(JSON.stringify(newNote)))
  } catch (error) {
    console.log(error.message)
  }
}
