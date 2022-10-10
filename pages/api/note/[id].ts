import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '../../../lib/prisma'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const noteId = req.query.id
  const { name, description, content } = req.body
  const session = await getSession({ req })

  // DELETE method
  if (req.method === 'DELETE') {
    if (session) {
      handleDELETE(noteId, res)
    } else {
      res.status(401).send({ message: 'Unauthorized' })
    }
  }
  // PUT method
  else if (req.method === 'PUT') {
    if (session) {
      handlePUT(noteId, name, description, content, res)
    } else {
      res.status(401).send({ message: 'Unauthorized' })
    }
  } else {
    throw new Error(`The ${req.method} method is not supported at this route.`)
  }
}

// DELETE /api/note/:id
async function handleDELETE(noteId, res) {
  try {
    const deleteNote = await prisma.note.delete({
      where: { id: Number(noteId) },
    })
    await res.json(JSON.parse(JSON.stringify(deleteNote)))
  } catch (error) {
    console.log(error.message)
  }
}

// PUT /api/note/:id
async function handlePUT(noteId, name, description, content, res) {
  try {
    const updateNote = await prisma.note.update({
      where: { id: Number(noteId) },
      data: {
        name: name,
        description: description,
        content: content,
      },
    })
    await res.json(JSON.parse(JSON.stringify(updateNote)))
  } catch (error) {
    console.log(error.message)
  }
}
