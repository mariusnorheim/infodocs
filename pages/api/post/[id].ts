import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '../../../lib/prisma'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const postId = req.query.id
  const { name, content } = req.body
  const session = await getSession({ req })

  // DELETE method
  if (req.method === 'DELETE') {
    if (session) {
      handleDELETE(postId, res)
    } else {
      res.status(401).send({ message: 'Unauthorized' })
    }
  }
  // PUT method
  else if (req.method === 'PUT') {
    if (session) {
      handlePUT(postId, name, content, res)
    } else {
      res.status(401).send({ message: 'Unauthorized' })
    }
  } else {
    throw new Error(`The ${req.method} method is not supported at this route.`)
  }
}

// DELETE /api/post/:id
async function handleDELETE(postId, res) {
  try {
    const deletePost = await prisma.post.delete({
      where: { id: Number(postId) },
    })
    await res.json(JSON.parse(JSON.stringify(deletePost)))
  } catch (error) {
    console.log(error.message)
  }
}

// PUT /api/post/:id
async function handlePUT(postId, name, content, res) {
  try {
    const updatePost = await prisma.post.update({
      where: { id: Number(postId) },
      data: {
        name: name,
        content: content,
      },
    })
    await res.json(JSON.parse(JSON.stringify(updatePost)))
  } catch (error) {
    console.log(error.message)
  }
}
