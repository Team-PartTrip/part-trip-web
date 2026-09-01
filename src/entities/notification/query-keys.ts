export const notificationQueryKeys = {
  all: ['notifications'] as const,
  list: (category: string) => [...notificationQueryKeys.all, 'list', category] as const,
  unreadCount: () => [...notificationQueryKeys.all, 'unread-count'] as const,
}
