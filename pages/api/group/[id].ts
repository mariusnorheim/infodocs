import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '../../../lib/prisma'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const groupId = req.query.id
  const { name, description, categoryId } = req.body
  const session = await getSession({ req })

  // DELETE method
  if (req.method === 'DELETE') {
    if (session) {
      handleDELETE(groupId, res)
    } else {
      res.status(401).send({ message: 'Unauthorized' })
    }
  }
  // PUT method
  else if (req.method === 'PUT') {
    if (session) {
      handlePUT(groupId, name, description, categoryId, res)
    } else {
      res.status(401).send({ message: 'Unauthorized' })
    }
  } else {
    throw new Error(`The ${req.method} method is not supported at this route.`)
  }
}

// DELETE /api/group/:id
async function handleDELETE(groupId, res) {
  try {
    const deleteGroup = await prisma.group.delete({
      where: { id: Number(groupId) },
    })
    await res.json(JSON.parse(JSON.stringify(deleteGroup)))
  } catch (error) {
    console.log(error.message)
  }
}

// PUT /api/group/:id
async function handlePUT(groupId, name, description, categoryId, res) {
  try {
    const updateGroup = await prisma.group.update({
      where: { id: Number(groupId) },
      data: {
        name: name,
        description: description,
        category_id: categoryId,
      },
    })
    await res.json(JSON.parse(JSON.stringify(updateGroup)))
  } catch (error) {
    console.log(error.message)
  }
}
