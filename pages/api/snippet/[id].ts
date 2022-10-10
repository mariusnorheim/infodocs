import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '../../../lib/prisma'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const snippetId = req.query.id
  const { name, description, content } = req.body
  const session = await getSession({ req })

  // DELETE method
  if (req.method === 'DELETE') {
    if (session) {
      handleDELETE(snippetId, res)
    } else {
      res.status(401).send({ message: 'Unauthorized' })
    }
  }
  // PUT method
  else if (req.method === 'PUT') {
    if (session) {
      handlePUT(snippetId, name, description, content, res)
    } else {
      res.status(401).send({ message: 'Unauthorized' })
    }
  } else {
    throw new Error(`The ${req.method} method is not supported at this route.`)
  }
}

// DELETE /api/snippet/:id
async function handleDELETE(snippetId, res) {
  try {
    const deleteSnippet = await prisma.snippet.delete({
      where: { id: Number(snippetId) },
    })
    await res.json(JSON.parse(JSON.stringify(deleteSnippet)))
  } catch (error) {
    console.log(error.message)
  }
}

// PUT /api/category/:id
async function handlePUT(snippetId, name, description, content, res) {
  try {
    const updateSnippet = await prisma.snippet.update({
      where: { id: Number(snippetId) },
      data: {
        name: name,
        description: description,
        content: content,
      },
    })
    await res.json(JSON.parse(JSON.stringify(updateSnippet)))
  } catch (error) {
    console.log(error.message)
  }
}
