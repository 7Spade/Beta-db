"use client"

import { cn } from "@/utils"
import { useAuth } from "@root/src/features/auth/use-auth"
import { useNotifications } from "@root/src/lib/hooks/use-notifications"
import { Bell, Check, X } from "lucide-react"
import * as React from "react"

interface NotificationCenterProps { className?: string }

const NotificationCenter = React.forwardRef<HTMLDivElement, NotificationCenterProps>(
  ({ className, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const { user } = useAuth()
    const { notifications, unreadCount, markAsRead, dismiss } = useNotifications(user?.uid)

    const getTypeStyles = (type: string) => {
      switch (type) {
        case "success":
          return "border-green-200 bg-green-50 text-green-800"
        case "warning":
          return "border-yellow-200 bg-yellow-50 text-yellow-800"
        case "error":
          return "border-red-200 bg-red-50 text-red-800"
        default:
          return "border-blue-200 bg-blue-50 text-blue-800"
      }
    }

    return (
      <div ref={ref} className={cn("relative", className)} {...props}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-80 rounded-md border bg-popover shadow-lg z-50">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Notifications</h3>
              <p className="text-sm text-muted-foreground">
                {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No notifications
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 border-b last:border-b-0",
                      getTypeStyles(notification.type || 'info'),
                      notification.isRead && "opacity-60"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{notification.type}</h4>
                        <p className="text-sm mt-1">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {notification.createdAt ? new Date(notification.createdAt).toLocaleString() : ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-1 hover:bg-white/20 rounded transition-colors"
                            title="Mark as read"
                          >
                            <Check className="h-3 w-3" />
                          </button>
                        )}
                        <button
                          onClick={() => dismiss(notification.id)}
                          className="p-1 hover:bg-white/20 rounded transition-colors"
                          title="Dismiss"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    )
  }
)
NotificationCenter.displayName = "NotificationCenter"

export { NotificationCenter }
// removed invalid type export

