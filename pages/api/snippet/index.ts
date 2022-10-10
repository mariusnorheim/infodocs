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

// GET /api/snippet
async function handleGET(res) {
  try {
    const snippets = await prisma.snippet.findMany({
      select: {
        name: true,
        description: true,
        content: true,
      },
    })
    await res.json(JSON.parse(JSON.stringify(snippets)))
  } catch (error) {
    console.log(error.message)
  }
}

// POST /api/snippet
// Required fields in body: name (string), content (string), author (string), postId (number)
// Optional fields in body: description (string)
async function handlePOST(name, description, content, author, postId, res) {
  try {
    const newSnippet = await prisma.snippet.create({
      data: {
        name: name,
        description: description || '',
        content: content,
        author: { connect: { email: author } },
        post: { connect: { id: postId } },
      },
    })
    await res.json(JSON.parse(JSON.stringify(newSnippet)))
  } catch (error) {
    console.log(error.message)
  }
}
