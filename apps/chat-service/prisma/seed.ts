import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create sample users
  const user1 = await prisma.users.upsert({
    where: { email: 'admin@adidas.com' },
    update: {},
    create: {
      email: 'admin@adidas.com',
      name: 'Adidas Admin',
      avatar: 'https://ui-avatars.com/api/?name=Adidas+Admin&background=000&color=fff',
      username: 'admin',
      displayName: 'Admin Adidas',
      created_at: new Date(),
      updated_at: new Date(),
      date_joined: new Date(),
      password: 'pbkdf2_sha256$720000$sample$JEXwqKpSjnuNmBE42U9DFtjLO6x2fIPCnOQ9oA59iHo=',
      first_name: '',
      last_name: '',
      admin: true,
      activated: true
    }
  })

  const user2 = await prisma.users.upsert({
    where: { email: 'support@adidas.com' },
    update: {},
    create: {
      email: 'support@adidas.com',
      name: 'Adidas Support',
      avatar: 'https://ui-avatars.com/api/?name=Adidas+Support&background=000&color=fff',
      username: 'support',
      displayName: 'Support Adidas',
      created_at: new Date(),
      updated_at: new Date(),
      date_joined: new Date(),
      password: 'pbkdf2_sha256$720000$sample$JEXwqKpSjnuNmBE42U9DFtjLO6x2fIPCnOQ9oA59iHo=',
      first_name: '',
      last_name: '',
      activated: true
    }
  })

  // Create sample rooms
  const generalRoom = await prisma.rooms.upsert({
    where: { id: 'general' },
    update: {},
    create: {
      id: 'general',
      name: 'General Chat',
      type: 'public',
      last_message: 'Welcome to Adidas chat!',
      last_message_at: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    }
  })

  const supportRoom = await prisma.rooms.upsert({
    where: { id: 'support' },
    update: {},
    create: {
      id: 'support',
      name: 'Customer Support',
      type: 'public',
      last_message: 'How can we help you today?',
      last_message_at: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    }
  })

  // Create sample messages
  await prisma.messages.createMany({
    data: [
      {
        content: 'Welcome to Adidas chat! How can we help you today?',
        type: 'TEXT',
        room_id: 'general',
        user_id: user1.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        content: 'Feel free to ask any questions about our products!',
        type: 'TEXT',
        room_id: 'general',
        user_id: user2.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        content: 'Our customer support team is here to help!',
        type: 'TEXT',
        room_id: 'support',
        user_id: user2.id,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]
  })

  console.log('✅ Database seeded successfully!')
  console.log(`👤 Created users: ${user1.email}, ${user2.email}`)
  console.log(`🏠 Created rooms: ${generalRoom.name}, ${supportRoom.name}`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
