import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const groupData: Prisma.GroupCreateInput[] = [
  {
    name: 'Frontend',
    description: 'Frontend technologies',
    category: {
      create: {
        name: 'Programming',
        description: 'Programming languages',
      },
    },
  },
  {
    name: 'Node/Javascript',
    description: 'Node and Javascript ecosystem',
    category: {
      connect: {
        id: 1,
      },
    },
  },
  {
    name: 'Cooking',
    description: 'Cooking tips',
    category: {
      create: {
        name: 'Food',
        description: 'Gastronomical tips',
      },
    },
  },
]

const userData: Prisma.UserCreateInput[] = [
  {
    name: 'Alice',
    email: 'alice@prisma.io',
    articles: {
      create: [
        {
          name: 'React',
          content: 'React wiki',
          group: {
            connect: {
              id: 1,
            },
          },
        },
      ],
    },
    posts: {
      create: [
        {
          name: 'Join the Prisma Slack',
          content: 'https://slack.prisma.io',
          article: {
            connect: {
              id: 1,
            },
          },
        },
      ],
    },
    resources: {
      create: [
        {
          name: 'React resource #1',
          description: 'Next.js tutorial',
          url: 'https://next.js/',
          post: {
            connect: {
              id: 1,
            },
          },
        },
      ],
    },
    snippets: {
      create: [
        {
          name: 'React snippet #1',
          description: 'Snippet for markdown',
          content: '<ReactMarkdown children={child} />',
          post: {
            connect: {
              id: 1,
            },
          },
        },
      ],
    },
    notes: {
      create: [
        {
          name: 'React note #1',
          description: 'Note for useEffect() function',
          content: 'Really useful.',
          post: {
            connect: {
              id: 1,
            },
          },
        },
      ],
    },
  },
  {
    name: 'Bob',
    email: 'bob@prisma.io',
    articles: {
      create: [
        {
          name: 'Typescript',
          content: 'Typescript wiki',
          group: {
            connect: {
              id: 1,
            },
          },
        },
      ],
    },
    posts: {
      create: [
        {
          name: 'Ask a question about Prisma on GitHub',
          content: 'https://www.github.com/prisma/prisma/discussions',
          article: {
            connect: {
              id: 2,
            },
          },
        },
      ],
    },
    resources: {
      create: [
        {
          name: 'Typescript resource #1',
          description: 'Typescript API',
          url: 'https://typescript.org/',
          post: {
            connect: {
              id: 2,
            },
          },
        },
      ],
    },
    snippets: {
      create: [
        {
          name: 'Typescript snippet #1',
          description: 'Typescript snippet for arrays',
          content: 'for ()',
          post: {
            connect: {
              id: 2,
            },
          },
        },
      ],
    },
    notes: {
      create: [
        {
          name: 'Typescript note #1',
          description: 'Note for express.Route() using Typescript',
          content: 'app.get()',
          post: {
            connect: {
              id: 2,
            },
          },
        },
      ],
    },
  },
]

async function main() {
  console.log(`Start seeding ...`)
  for (const g of groupData) {
    const group = await prisma.group.create({
      data: g,
    })
    console.log(`Created group with id: ${group.id}`)
  }
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    })
    console.log(`Created user with id: ${user.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
