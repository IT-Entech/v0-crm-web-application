import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldAlert } from "lucide-react"

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <ShieldAlert className="mb-4 h-16 w-16 text-destructive" />
      <h1 className="mb-2 text-3xl font-bold">Access Denied</h1>
      <p className="mb-6 text-center text-muted-foreground">You don't have permission to access this resource.</p>
      <Button asChild>
        <Link href="/dashboard">Return to Dashboard</Link>
      </Button>
    </div>
  )
}
