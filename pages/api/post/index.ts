import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '../../../lib/prisma'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { name, content, articleId } = req.body;
  const session = await getSession({ req });

  // GET method
  if (req.method === "GET") {
    handleGET(res)
  }
  // POST method
  else if (req.method === "POST") {
    if (session) {
      const author = session?.user?.email
      handlePOST(name, content, author, articleId, res)
    } else {
      res.status(401).send({ message: 'Unauthorized' })
    }
  } else {
    throw new Error(`The ${req.method} method is not supported on this route.`)
  }
}

// GET /api/post
async function handleGET(res) {
  try {
    const posts = await prisma.post.findMany({
      select: {
        name: true,
        content: true,
        article: { select: { id: true } },
        author: { select: { email: true } },
      },
    });
    await res.json(JSON.parse(JSON.stringify(posts)));
  } catch (error) {
    console.log(error.message)
  }
}

// POST /api/post
// Required fields in body: name (string), content(string)
async function handlePOST(name, content, author, articleId res) {
  try {
    const newPost = await prisma.post.create({
      data: {
        name: name,
        content: content,
        author: { connect: { email: author } },
        article: { connect: { id: articleId } }
      },
    });
    await res.json(JSON.parse(JSON.stringify(newPost)));
  } catch (error) {
    console.log(error.message)
  }
}