import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create sample users (these would normally be created via Supabase Auth)
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'alice@example.com' },
      update: {},
      create: {
        id: 'user_alice',
        email: 'alice@example.com',
        displayName: 'Alice Johnson'
      }
    }),
    prisma.user.upsert({
      where: { email: 'bob@example.com' },
      update: {},
      create: {
        id: 'user_bob',
        email: 'bob@example.com',
        displayName: 'Bob Smith'
      }
    }),
    prisma.user.upsert({
      where: { email: 'charlie@example.com' },
      update: {},
      create: {
        id: 'user_charlie',
        email: 'charlie@example.com',
        displayName: 'Charlie Brown'
      }
    })
  ])

  console.log('👥 Created users')

  // Create study groups
  const groups = await Promise.all([
    prisma.studyGroup.upsert({
      where: { id: 'group_dsa' },
      update: {},
      create: {
        id: 'group_dsa',
        name: 'Data Structures & Algorithms',
        description: 'Master DSA concepts together',
        topic: 'Computer Science'
      }
    }),
    prisma.studyGroup.upsert({
      where: { id: 'group_web' },
      update: {},
      create: {
        id: 'group_web',
        name: 'Web Development',
        description: 'Full-stack web development study group',
        topic: 'Web Development'
      }
    }),
    prisma.studyGroup.upsert({
      where: { id: 'group_ml' },
      update: {},
      create: {
        id: 'group_ml',
        name: 'Machine Learning',
        description: 'Learn ML algorithms and applications',
        topic: 'Artificial Intelligence'
      }
    }),
    prisma.studyGroup.upsert({
      where: { id: 'group_interview' },
      update: {},
      create: {
        id: 'group_interview',
        name: 'Interview Preparation',
        description: 'Technical interview practice and tips',
        topic: 'Career Preparation'
      }
    })
  ])

  console.log('📚 Created study groups')

  // Add members to groups
  const memberships = [
    { groupId: 'group_dsa', userId: 'user_alice', role: 'admin' },
    { groupId: 'group_dsa', userId: 'user_bob', role: 'member' },
    { groupId: 'group_dsa', userId: 'user_charlie', role: 'member' },
    { groupId: 'group_web', userId: 'user_alice', role: 'member' },
    { groupId: 'group_web', userId: 'user_bob', role: 'admin' },
    { groupId: 'group_ml', userId: 'user_charlie', role: 'admin' },
    { groupId: 'group_ml', userId: 'user_alice', role: 'member' },
    { groupId: 'group_interview', userId: 'user_bob', role: 'member' },
    { groupId: 'group_interview', userId: 'user_charlie', role: 'member' }
  ]

  for (const membership of memberships) {
    await prisma.studyGroupMember.upsert({
      where: {
        groupId_userId: {
          groupId: membership.groupId,
          userId: membership.userId
        }
      },
      update: {},
      create: membership
    })
  }

  console.log('👥 Added group memberships')

  // Create sample messages
  const messages = [
    {
      groupId: 'group_dsa',
      authorId: 'user_alice',
      text: 'Hey everyone! I just solved the Binary Tree Maximum Path Sum problem. Anyone want to discuss different approaches?',
      type: 'message'
    },
    {
      groupId: 'group_dsa',
      authorId: 'user_bob',
      text: 'That\'s awesome! I struggled with that one. Could you share your approach?',
      type: 'message'
    },
    {
      groupId: 'group_dsa',
      authorId: 'user_charlie',
      text: 'I have a great video resource for tree problems. Let me share it with you all.',
      type: 'resource'
    },
    {
      groupId: 'group_web',
      authorId: 'user_bob',
      text: 'Welcome to the Web Development study group! Let\'s start by sharing what frameworks everyone is working with.',
      type: 'announcement'
    },
    {
      groupId: 'group_web',
      authorId: 'user_alice',
      text: 'I\'m currently learning React and Next.js. Really enjoying the developer experience!',
      type: 'message'
    },
    {
      groupId: 'group_ml',
      authorId: 'user_charlie',
      text: 'Today we\'ll be covering linear regression. Make sure you have your Python environment set up!',
      type: 'announcement'
    },
    {
      groupId: 'group_ml',
      authorId: 'user_alice',
      text: 'Quick question - what\'s the difference between supervised and unsupervised learning?',
      type: 'message'
    },
    {
      groupId: 'group_interview',
      authorId: 'user_bob',
      text: 'Just had a great mock interview session. The key is to think out loud and explain your approach!',
      type: 'message'
    },
    {
      groupId: 'group_interview',
      authorId: 'user_charlie',
      text: 'Remember: STAR method for behavioral questions - Situation, Task, Action, Result',
      type: 'message'
    }
  ]

  for (const message of messages) {
    await prisma.groupMessage.create({
      data: message
    })
  }

  console.log('💬 Created group messages')

  // Create sample study materials
  const materials = [
    {
      ownerId: 'user_alice',
      title: 'Introduction to Algorithms (CLRS)',
      type: 'PDF' as const,
      subject: 'Computer Science',
      topics: ['Algorithms', 'Data Structures', 'Complexity Analysis'],
      url: 'https://example.com/clrs.pdf',
      description: 'Comprehensive textbook on algorithms and data structures'
    },
    {
      ownerId: 'user_bob',
      title: 'React Official Tutorial',
      type: 'LINK' as const,
      subject: 'Web Development',
      topics: ['React', 'JavaScript', 'Frontend'],
      url: 'https://react.dev/learn',
      description: 'Official React tutorial covering all the basics'
    },
    {
      ownerId: 'user_charlie',
      title: 'Machine Learning Course - Andrew Ng',
      type: 'YOUTUBE' as const,
      subject: 'Machine Learning',
      topics: ['ML', 'Neural Networks', 'Statistics'],
      url: 'https://youtube.com/playlist?list=PLkDaE6sCZn6FNC6YRfRQc_FbeQrF8BwGI',
      description: 'Comprehensive ML course by Andrew Ng'
    },
    {
      ownerId: 'user_alice',
      title: 'System Design Interview Guide',
      type: 'PDF' as const,
      subject: 'System Design',
      topics: ['System Design', 'Scalability', 'Architecture'],
      url: 'https://example.com/system-design.pdf',
      description: 'Complete guide to system design interviews'
    }
  ]

  for (const material of materials) {
    await prisma.studyMaterial.create({
      data: material
    })
  }

  console.log('📖 Created study materials')

  // Create sample learning tasks
  const tasks = [
    {
      userId: 'user_alice',
      title: 'Complete Binary Search Tree implementation',
      subject: 'Data Structures',
      description: 'Implement BST with insert, delete, and search operations',
      priority: 'high' as const,
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      completed: false
    },
    {
      userId: 'user_alice',
      title: 'Review sorting algorithms',
      subject: 'Algorithms',
      description: 'Study quicksort, mergesort, and heapsort',
      priority: 'medium' as const,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
      completed: false
    },
    {
      userId: 'user_alice',
      title: 'Practice dynamic programming problems',
      subject: 'Algorithms',
      description: 'Solve 5 DP problems on LeetCode',
      priority: 'medium' as const,
      dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
      completed: true,
      completedAt: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
    }
  ]

  for (const task of tasks) {
    await prisma.learningTask.create({
      data: task
    })
  }

  console.log('✅ Created learning tasks')

  // Create daily progress entries
  const today = new Date()
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
  
  await prisma.dailyProgress.create({
    data: {
      userId: 'user_alice',
      date: yesterday,
      completedCount: 1,
      totalCount: 1,
      studyHours: 2.5
    }
  })

  await prisma.dailyProgress.create({
    data: {
      userId: 'user_alice',
      date: today,
      completedCount: 0,
      totalCount: 2,
      studyHours: 0
    }
  })

  console.log('📊 Created daily progress entries')

  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })