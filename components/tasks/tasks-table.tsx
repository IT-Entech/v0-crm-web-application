"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2, AlertCircle } from "lucide-react"
import type { Task } from "@/types/tasks"
import { useAuth } from "@/lib/auth/auth-provider"
import { formatDistanceToNow, format } from "date-fns"

interface TasksTableProps {
  tasks: Task[]
  isLoading: boolean
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
}

const priorityColors: Record<Task["priority"], "default" | "secondary" | "outline" | "destructive"> = {
  Low: "secondary",
  Medium: "outline",
  High: "default",
  Urgent: "destructive",
}

const statusColors: Record<Task["status"], "default" | "secondary" | "outline" | "destructive"> = {
  Todo: "secondary",
  "In Progress": "default",
  Completed: "outline",
  Cancelled: "destructive",
}

export function TasksTable({ tasks, isLoading, onEdit, onDelete }: TasksTableProps) {
  const { hasPermission } = useAuth()
  const [sortField, setSortField] = useState<keyof Task>("dueDate")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const handleSort = (field: keyof Task) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedTasks = [...tasks].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    return 0
  })

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-border bg-card">
        <p className="text-lg font-medium text-foreground">No tasks found</p>
        <p className="text-sm text-muted-foreground">Get started by creating your first task</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer text-foreground" onClick={() => handleSort("title")}>
              Task
            </TableHead>
            <TableHead className="text-foreground">Priority</TableHead>
            <TableHead className="text-foreground">Status</TableHead>
            <TableHead className="text-foreground">Related To</TableHead>
            <TableHead className="cursor-pointer text-foreground" onClick={() => handleSort("dueDate")}>
              Due Date
            </TableHead>
            <TableHead className="text-foreground">Created</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTasks.map((task) => {
            const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "Completed"

            return (
              <TableRow key={task.id}>
                <TableCell>
                  <div>
                    <p className="font-medium text-foreground">{task.title}</p>
                    {task.description && (
                      <p className="text-sm text-muted-foreground line-clamp-1">{task.description}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={priorityColors[task.priority]}>{task.priority}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={statusColors[task.status]}>{task.status}</Badge>
                </TableCell>
                <TableCell className="text-foreground">
                  {task.relatedTo ? (
                    <div>
                      <p className="text-sm">{task.relatedTo.type}</p>
                      <p className="text-xs text-muted-foreground">{task.relatedTo.name}</p>
                    </div>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  {task.dueDate ? (
                    <div className={`flex items-center gap-2 ${isOverdue ? "text-destructive" : "text-foreground"}`}>
                      {isOverdue && <AlertCircle className="h-3 w-3" />}
                      <div>
                        <p className="text-sm">{format(new Date(task.dueDate), "MMM dd, yyyy")}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {hasPermission("tasks.update") && (
                        <DropdownMenuItem onClick={() => onEdit(task)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                      )}
                      {hasPermission("tasks.delete") && (
                        <DropdownMenuItem onClick={() => onDelete(task.id)} className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
