import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { PersonStanding, Play } from 'lucide-react'
import { ChartContainer, type ChartConfig } from '@/components/ui/chart'
import { Bar, BarChart } from 'recharts'
import { useEffect } from 'react'

const chartData = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 }
]

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: '#2563eb'
  },
  mobile: {
    label: 'Mobile',
    color: '#60a5fa'
  }
} satisfies ChartConfig

export function ActivityCard() {
  useEffect(() => {
    window.electron.ipcRenderer.send('updateCurrentIndex', 1)
  }, [])
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <PersonStanding className="size-6 mr-4" />
          <span className="text-xl">Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col justify-center items-center h-[400px]">
          <span className="text-base font-semibold">Steps today</span>
          <span className="mt-2 text-5xl font-bold">1204</span>
          <div className="flex-1" />
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={chartData}>
              <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
              <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
            </BarChart>
          </ChartContainer>
          <div className="flex-1" />
          <div className="flex items-center">
            <div className="flex justify-center items-center size-6 bg-foreground rounded-full">
              <Play className="size-3 text-white" />
            </div>
            <span className="ml-4">Start new session</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
