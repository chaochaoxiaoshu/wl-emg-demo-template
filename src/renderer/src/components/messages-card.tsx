import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MessagesSquare } from 'lucide-react'
import { useCallback, useEffect, useRef } from 'react'

interface Message {
  id: string
  sender: string
  content: string
  timestamp: string
  avatar?: string
}

const messages: Message[] = [
  {
    id: '4',
    sender: 'Alice',
    content: 'Just enjoying my coffee. What about you, Bob?',
    timestamp: '2023-05-20 10:15',
    avatar: '/placeholder.svg?height=40&width=40'
  },
  {
    id: '5',
    sender: 'Bob',
    content: "Same here! Charlie, how's your day going?",
    timestamp: '2023-05-20 10:20',
    avatar: '/placeholder.svg?height=40&width=40'
  },
  {
    id: '6',
    sender: 'Charlie',
    content: "It's been pretty good so far. Just got back from a morning run.",
    timestamp: '2023-05-20 10:25',
    avatar: '/placeholder.svg?height=40&width=40'
  },
  {
    id: '7',
    sender: 'Alice',
    content: 'That sounds nice, Charlie! I wish I had the energy to go for a run.',
    timestamp: '2023-05-20 10:30',
    avatar: '/placeholder.svg?height=40&width=40'
  },
  {
    id: '8',
    sender: 'Bob',
    content: "Same here, Alice. I'm more of a late-night person than a morning runner.",
    timestamp: '2023-05-20 10:35',
    avatar: '/placeholder.svg?height=40&width=40'
  },
  {
    id: '9',
    sender: 'Charlie',
    content: 'Haha, nothing wrong with that! Everyone has their own rhythm.',
    timestamp: '2023-05-20 10:40',
    avatar: '/placeholder.svg?height=40&width=40'
  },
  {
    id: '10',
    sender: 'Alice',
    content: 'True! So, what are you guys up to this weekend?',
    timestamp: '2023-05-20 10:45',
    avatar: '/placeholder.svg?height=40&width=40'
  },
  {
    id: '11',
    sender: 'Bob',
    content: "I'm planning to binge-watch a new series. Any recommendations?",
    timestamp: '2023-05-20 10:50',
    avatar: '/placeholder.svg?height=40&width=40'
  },
  {
    id: '12',
    sender: 'Charlie',
    content: "I heard 'The Great Adventure' is pretty good. Maybe give that a shot!",
    timestamp: '2023-05-20 10:55',
    avatar: '/placeholder.svg?height=40&width=40'
  },
  {
    id: '13',
    sender: 'Alice',
    content: "Oh, I've been meaning to watch that too! Let us know how it is, Bob.",
    timestamp: '2023-05-20 11:00',
    avatar: '/placeholder.svg?height=40&width=40'
  },
  {
    id: '14',
    sender: 'Bob',
    content: 'Will do! Thanks for the suggestion, Charlie.',
    timestamp: '2023-05-20 11:05',
    avatar: '/placeholder.svg?height=40&width=40'
  },
  {
    id: '15',
    sender: 'Charlie',
    content: 'No problem! Hope you both enjoy your weekend!',
    timestamp: '2023-05-20 11:10',
    avatar: '/placeholder.svg?height=40&width=40'
  }
]

export function MessagesCard() {
  useEffect(() => {
    window.electron.ipcRenderer.send('updateCurrentIndex', 2)
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessagesSquare className="size-6 mr-4" />
          <span className="text-xl">Messages</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={scrollAreaRef} className="h-[calc(78vh-160px)] pr-4 overflow-y-scroll">
          {messages.map((message) => (
            <div key={message.id} className="flex items-start space-x-4 mb-4">
              <Avatar>
                <AvatarImage src={message.avatar} alt={message.sender} />
                <AvatarFallback className="bg-white/40">
                  {message.sender[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{message.sender}</p>
                <p className="text-sm text-white/40">{message.content}</p>
                <p className="text-xs text-white/40">{message.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
