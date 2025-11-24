import { formatDistanceToNow } from "date-fns"
import { Circle } from "lucide-react"

interface Activity {
  id: string
  type: string
  description: string
  timestamp: string
}

interface RecentActivityProps {
  activities: Activity[]
}

export function RecentActivity({ activities }: RecentActivityProps) {
  if (activities.length === 0) {
    return <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">No recent activity</div>
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-3">
          <Circle className="mt-1 h-2 w-2 fill-primary text-primary" />
          <div className="flex-1 space-y-1">
            <p className="text-sm text-foreground leading-relaxed">{activity.description}</p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
