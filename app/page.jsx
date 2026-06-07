"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TaskSkeleton } from "@/components/ui/task-skeleton"
import { Plus, Search, Pencil, Trash2, ClipboardList, ArrowUpDown } from "lucide-react"

function addDays(days) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

function isOverdue(task) {
  if (!task.dueDate || task.completed) return false
  const due = new Date(task.dueDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  due.setHours(0, 0, 0, 0)
  return due < today
}

function formatDate(dueDate) {
  if (!dueDate) return ""
  return new Date(dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export default function Page() {
  const [tasks, setTasks] = useState([])
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [sort, setSort] = useState("asc")
  const [sortBy, setSortBy] = useState("dueDate")
  const [form, setForm] = useState({ title: "", description: "", dueDate: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [deleteTaskId, setDeleteTaskId] = useState(null)
  const [deleteOpen, setDeleteOpen] = useState(false)

  useEffect(() => {
    fetchTasks()
  }, [])

  async function fetchTasks() {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/tasks")
      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        throw new Error(body.error || "Unable to load tasks")
      }
      const data = await response.json()
      setTasks(data.tasks ?? [])
    } catch (error) {
      console.error("Failed to load tasks:", error)
      setError(error.message || "Unable to load tasks")
    } finally {
      setLoading(false)
    }
  }

  const activeCount = tasks.filter((t) => !t.completed).length
  const completedCount = tasks.filter((t) => t.completed).length

  const visible = tasks
    .filter((t) => (filter === "active" ? !t.completed : filter === "completed" ? t.completed : true))
    .filter((t) => t.title.toLowerCase().includes(search.trim().toLowerCase()))
    .slice()
    .sort((a, b) => {
      let diff
      if (sortBy === "createdAt") {
        diff = a.createdAt - b.createdAt
      } else {
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        diff = new Date(a.dueDate) - new Date(b.dueDate)
      }
      return sort === "asc" ? diff : -diff
    })

  function openAdd() {
    setEditing(null)
    setForm({ title: "", description: "", dueDate: "" })
    setOpen(true)
  }

  function openEdit(task) {
    setEditing(task)
    setForm({ title: task.title, description: task.description || "", dueDate: task.dueDate || "" })
    setOpen(true)
  }

  async function save() {
    if (!form.title.trim()) return
    setLoading(true)
    setError("")

    try {
      if (editing) {
        const response = await fetch(`/api/tasks/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: form.title.trim(), description: form.description.trim(), dueDate: form.dueDate }),
        })

        if (!response.ok) {
          const body = await response.json().catch(() => ({}))
          throw new Error(body.error || "Unable to update task")
        }

        const updatedTask = await response.json()
        setTasks((prev) => prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
      } else {
        const response = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: form.title.trim(), description: form.description.trim(), dueDate: form.dueDate }),
        })

        if (!response.ok) {
          const body = await response.json().catch(() => ({}))
          throw new Error(body.error || "Unable to create task")
        }

        const createdTask = await response.json()
        setTasks((prev) => [createdTask, ...prev])
      }
      setOpen(false)
    } catch (error) {
      console.error(error)
      setError(error.message || "Unable to save task")
    } finally {
      setLoading(false)
    }
  }

  async function toggle(id) {
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/tasks/${id}/toggle`, { method: "PATCH" })
      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        throw new Error(body.error || "Unable to toggle task")
      }
      const updatedTask = await response.json()
      setTasks((prev) => prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
    } catch (error) {
      console.error(error)
      setError(error.message || "Unable to toggle task")
    } finally {
      setLoading(false)
    }
  }

  async function remove(id) {
    setDeleteTaskId(id)
    setDeleteOpen(true)
  }

  async function confirmDelete() {
    if (!deleteTaskId) return

    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/tasks/${deleteTaskId}`, { method: "DELETE" })
      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        throw new Error(body.error || "Unable to delete task")
      }
      setTasks((prev) => prev.filter((task) => task.id !== deleteTaskId))
    } catch (error) {
      console.error(error)
      setError(error.message || "Unable to delete task")
    } finally {
      setLoading(false)
      setDeleteOpen(false)
      setDeleteTaskId(null)
    }
  }

  return (
    <main className="min-h-svh bg-background">
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ClipboardList className="size-5" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Task Manager</h1>
              <p className="text-sm text-muted-foreground">Stay on top of your work</p>
            </div>
          </div>
          <Button onClick={openAdd} className="gap-2">
            <Plus className="size-4" />
            Add Task
          </Button>
        </header>

        {error ? (
          <div className="mt-6 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-primary-foreground">
            Loading tasks...
          </div>
        ) : null}

        <div className="mt-6 grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{activeCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{completedCount}</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Tabs value={filter} onValueChange={setFilter} className="w-full sm:w-auto">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="all" className="flex-1 sm:flex-none">All</TabsTrigger>
              <TabsTrigger value="active" className="flex-1 sm:flex-none">Active</TabsTrigger>
              <TabsTrigger value="completed" className="flex-1 sm:flex-none">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title..." className="pl-9" />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          {loading && tasks.length === 0 ? (
            Array.from({ length: 5 }, (_, index) => <TaskSkeleton key={index} />)
          ) : visible.length > 0 ? (
            visible.map((task) => {
              const overdue = isOverdue(task)
              return (
                <Card key={task.id} className={overdue ? "border-destructive/50" : ""}>
                  <CardContent className="flex items-start gap-3 p-4">
                    <Checkbox checked={task.completed} onCheckedChange={() => toggle(task.id)} className="mt-1" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className={`font-medium leading-snug ${task.completed ? "text-muted-foreground line-through" : ""}`}>
                          {task.title}
                        </h3>
                        <div className="flex shrink-0 items-center gap-1">
                          <Button variant="ghost" size="icon" className="size-8 text-muted-foreground" onClick={() => openEdit(task)} aria-label="Edit task">
                            <Pencil className="size-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-destructive" onClick={() => remove(task.id)} aria-label="Delete task">
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                      {task.description && (
                        <p className={`mt-1 text-sm text-muted-foreground ${task.completed ? "line-through" : ""}`}>{task.description}</p>
                      )}
                      {task.dueDate && (
                        <div className="mt-3">
                          {overdue ? (
                            <Badge variant="destructive">Overdue · {formatDate(task.dueDate)}</Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">{formatDate(task.dueDate)}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
              <ClipboardList className="size-6 text-muted-foreground" />
              <h2 className="mt-4 font-medium">No tasks found</h2>
              <p className="mt-1 max-w-xs text-sm text-muted-foreground">Try adjusting your search or filter, or add a new task.</p>
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={deleteOpen} onOpenChange={(open) => {
        if (!open) {
          setDeleteTaskId(null)
        }
        setDeleteOpen(open)
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit task" : "Add task"}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" autoFocus />
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={3} />
            <Input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>{editing ? "Save changes" : "Add task"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
