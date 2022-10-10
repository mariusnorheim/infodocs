import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '../../../lib/prisma'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const categoryId = req.query.id
  const { name, description } = req.body
  const session = await getSession({ req })

  // DELETE method
  if (req.method === 'DELETE') {
    if (session) {
      handleDELETE(categoryId, res)
    } else {
      res.status(401).send({ message: 'Unauthorized' })
    }
  }
  // PUT method
  else if (req.method === 'PUT') {
    if (session) {
      handlePUT(categoryId, name, description, res)
    } else {
      res.status(401).send({ message: 'Unauthorized' })
    }
  } else {
    throw new Error(`The ${req.method} method is not supported at this route.`)
  }
}

// DELETE /api/category/:id
async function handleDELETE(categoryId, res) {
  try {
    const deleteCategory = await prisma.category.delete({
      where: { id: Number(categoryId) },
    })
    await res.json(JSON.parse(JSON.stringify(deleteCategory)))
  } catch (error) {
    console.log(error.message)
  }
}

// PUT /api/category/:id
async function handlePUT(categoryId, name, description, res) {
  try {
    const updateCategory = await prisma.category.update({
      where: { id: Number(categoryId) },
      data: {
        name: name,
        description: description,
      },
    })
    await res.json(JSON.parse(JSON.stringify(updateCategory)))
  } catch (error) {
    console.log(error.message)
  }
}
