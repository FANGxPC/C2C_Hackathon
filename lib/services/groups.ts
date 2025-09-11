import { db } from '../db'

export async function getStudyGroups(userId: string) {
  return await db.studyGroup.findMany({
    where: {
      members: {
        some: { userId }
      }
    },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              displayName: true,
              avatarUrl: true
            }
          }
        }
      },
      messages: {
        take: 1,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              displayName: true
            }
          }
        }
      },
      _count: {
        select: {
          members: true,
          messages: true
        }
      }
    },
    orderBy: { updatedAt: 'desc' }
  })
}

export async function getGroupMessages(groupId: string, userId: string) {
  // Verify user is member of group
  const membership = await db.studyGroupMember.findUnique({
    where: {
      groupId_userId: { groupId, userId }
    }
  })

  if (!membership) {
    throw new Error('Access denied')
  }

  return await db.groupMessage.findMany({
    where: { groupId },
    include: {
      author: {
        select: {
          id: true,
          displayName: true,
          avatarUrl: true
        }
      }
    },
    orderBy: { createdAt: 'asc' }
  })
}

export async function createGroupMessage(
  groupId: string, 
  authorId: string, 
  data: { text: string, type?: string }
) {
  // Verify user is member of group
  const membership = await db.studyGroupMember.findUnique({
    where: {
      groupId_userId: { groupId, userId: authorId }
    }
  })

  if (!membership) {
    throw new Error('Access denied')
  }

  const message = await db.groupMessage.create({
    data: {
      groupId,
      authorId,
      text: data.text,
      type: data.type || 'message'
    },
    include: {
      author: {
        select: {
          id: true,
          displayName: true,
          avatarUrl: true
        }
      }
    }
  })

  // Update group's updatedAt
  await db.studyGroup.update({
    where: { id: groupId },
    data: { updatedAt: new Date() }
  })

  return message
}