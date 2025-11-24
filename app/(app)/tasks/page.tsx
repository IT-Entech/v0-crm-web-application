"use client"

import { useEffect, useState } from "react"
import { Plus, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TasksTable } from "@/components/tasks/tasks-table"
import { TaskDialog } from "@/components/tasks/task-dialog"
import type { Task } from "@/types/tasks"
import { apiClient } from "@/lib/api/client"
import { useAuth } from "@/lib/auth/auth-provider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const { hasPermission } = useAuth()

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      const response = await apiClient.get<Task[]>("/api/tasks")
      setTasks(response)
    } catch (error) {
      console.error("[v0] Failed to load tasks:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateTask = () => {
    setSelectedTask(null)
    setIsDialogOpen(true)
  }

  const handleEditTask = (task: Task) => {
    setSelectedTask(task)
    setIsDialogOpen(true)
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      await apiClient.delete(`/api/tasks/${taskId}`)
      setTasks(tasks.filter((t) => t.id !== taskId))
    } catch (error) {
      console.error("[v0] Failed to delete task:", error)
    }
  }

  const handleSaveTask = async (task: Task) => {
    if (selectedTask) {
      setTasks(tasks.map((t) => (t.id === task.id ? task : t)))
    } else {
      setTasks([task, ...tasks])
    }
    setIsDialogOpen(false)
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    return matchesSearch && task.status === activeTab
  })

  const taskCounts = {
    all: tasks.length,
    Todo: tasks.filter((t) => t.status === "Todo").length,
    "In Progress": tasks.filter((t) => t.status === "In Progress").length,
    Completed: tasks.filter((t) => t.status === "Completed").length,
    Cancelled: tasks.filter((t) => t.status === "Cancelled").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Tasks</h1>
          <p className="text-muted-foreground">Manage your tasks and to-dos</p>
        </div>
        {hasPermission("tasks.create") && (
          <Button onClick={handleCreateTask}>
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All ({taskCounts.all})</TabsTrigger>
          <TabsTrigger value="Todo">To Do ({taskCounts.Todo})</TabsTrigger>
          <TabsTrigger value="In Progress">In Progress ({taskCounts["In Progress"]})</TabsTrigger>
          <TabsTrigger value="Completed">Completed ({taskCounts.Completed})</TabsTrigger>
          <TabsTrigger value="Cancelled">Cancelled ({taskCounts.Cancelled})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <TasksTable tasks={filteredTasks} isLoading={isLoading} onEdit={handleEditTask} onDelete={handleDeleteTask} />
        </TabsContent>
      </Tabs>

      <TaskDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} task={selectedTask} onSave={handleSaveTask} />
    </div>
  )
}
