import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '../../../lib/prisma'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, content, groupId } = req.body
  const session = await getSession({ req })

  // GET method
  if (req.method === 'GET') {
    handleGET(res)
  }
  // POST method
  else if (req.method === 'POST') {
    if (session) {
      const author = session?.user?.email
      handlePOST(name, content, groupId, author, res)
    } else {
      res.status(401).send({ message: 'Unauthorized' })
    }
  } else {
    throw new Error(`The ${req.method} method is not supported on this route.`)
  }
}

// GET /api/article
async function handleGET(res) {
  try {
    const articles = await prisma.article.findMany({
      select: {
        name: true,
        content: true,
        author: { select: { email: true } },
        group: { select: { name: true } },
      },
    })
    await res.json(JSON.parse(JSON.stringify(articles)))
  } catch (error) {
    console.log(error.message)
  }
}

// POST /api/article
// Required fields in body: name (string), content(string)
async function handlePOST(name, content, groupId, author, res) {
  try {
    const newArticle = await prisma.article.create({
      data: {
        name: name,
        content: content,
        author: { connect: { email: author } },
        group: { connect: { id: groupId } },
      },
    })
    res.json(newArticle)
  } catch (error) {
    console.log(error.message)
  }
}
