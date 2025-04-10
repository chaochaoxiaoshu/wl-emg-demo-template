'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { CheckSquare, Trash2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Todo {
  id: number
  task: string
  completed: boolean
}

export function TodoListCard() {
  useEffect(() => {
    window.electron.ipcRenderer.send('updateCurrentIndex', 4)
  }, [])

  const scrollAreaRef = useRef<HTMLDivElement | null>(null)

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!scrollAreaRef.current) return
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault()
        scrollAreaRef.current.scrollTo({
          top: scrollAreaRef.current.scrollTop - 100,
          behavior: 'smooth'
        })
        break
      case 'ArrowDown':
        event.preventDefault()
        scrollAreaRef.current.scrollTo({
          top: scrollAreaRef.current.scrollTop + 100,
          behavior: 'smooth'
        })
        break
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, task: 'Complete project proposal', completed: false },
    { id: 2, task: "Review team's progress", completed: true },
    { id: 3, task: 'Prepare for client meeting', completed: false },
    { id: 4, task: 'Update documentation', completed: false },
    { id: 5, task: 'Schedule team building activity', completed: true },
    { id: 6, task: 'Prepare for client meeting', completed: false },
    { id: 7, task: 'Prepare for client meeting', completed: false }
  ])
  const [newTask, setNewTask] = useState('')

  const addTodo = () => {
    if (newTask.trim()) {
      setTodos([...todos, { id: Date.now(), task: newTask, completed: false }])
      setNewTask('')
    }
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CheckSquare className="size-6 mr-4" />
          <span className="text-xl">TodoList</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Input
            className="border-white/40 placeholder:text-white/40"
            type="text"
            placeholder="Add a new task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyUp={(e) => e.key === 'Enter' && addTodo()}
          />
          <Button className="bg-white/20 hover:bg-white/40 text-white" onClick={addTodo}>
            Add
          </Button>
        </div>
        <div ref={scrollAreaRef} className="h-[calc(78vh-240px)] pr-4 overflow-y-scroll">
          {todos.map((todo) => (
            <Card key={todo.id} className="mb-4 p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Checkbox
                    className="data-[state=checked]:bg-white/40 data-[state=checked]:border-white/60"
                    checked={todo.completed}
                    onCheckedChange={() => toggleTodo(todo.id)}
                  />
                  <p
                    className={`text-sm font-medium ${
                      todo.completed ? 'line-through text-white/40' : ''
                    }`}
                  >
                    {todo.task}
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => deleteTodo(todo.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
