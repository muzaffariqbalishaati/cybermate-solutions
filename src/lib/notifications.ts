import prisma from './prisma';
import { NotificationType } from '@prisma/client';

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
}

export async function createNotification(params: CreateNotificationParams): Promise<void> {
  // Check user's notification preferences
  const pref = await prisma.notificationPreference.findUnique({
    where: {
      userId_type: { userId: params.userId, type: params.type },
    },
  });

  if (pref && !pref.inAppEnabled) return;

  await prisma.notification.create({
    data: {
      userId: params.userId,
      type: params.type,
      title: params.title,
      message: params.message,
      link: params.link,
    },
  });
}

export async function createBulkNotifications(
  userIds: string[],
  type: NotificationType,
  title: string,
  message: string,
  link?: string
): Promise<void> {
  await prisma.notification.createMany({
    data: userIds.map(userId => ({
      userId,
      type,
      title,
      message,
      link,
    })),
  });
}

export async function markNotificationRead(notificationId: string, userId: string): Promise<void> {
  await prisma.notification.updateMany({
    where: { id: notificationId, userId },
    data: { isRead: true, readAt: new Date() },
  });
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true, readAt: new Date() },
  });
}

export async function getUnreadCount(userId: string): Promise<number> {
  return prisma.notification.count({
    where: { userId, isRead: false },
  });
}

// Notify enrolled students of a course
export async function notifyCourseStudents(
  courseId: string,
  type: NotificationType,
  title: string,
  message: string,
  link?: string
): Promise<void> {
  const enrollments = await prisma.enrollment.findMany({
    where: { courseId, isActive: true },
    select: { userId: true },
  });

  const userIds = enrollments.map(e => e.userId);
  if (userIds.length > 0) {
    await createBulkNotifications(userIds, type, title, message, link);
  }
}
