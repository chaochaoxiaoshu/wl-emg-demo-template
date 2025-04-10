import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { CloudSunRain } from 'lucide-react'
import { Snowflake } from 'lucide-react'
import { useEffect } from 'react'

export function WeatherCard() {
  useEffect(() => {
    window.electron.ipcRenderer.send('updateCurrentIndex', 6)
  }, [])
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CloudSunRain className="size-6 mr-4" />
          <span className="text-xl">Weather</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col justify-center items-center h-[400px]">
          <Snowflake className="size-12" />
          <span className="text-2xl font-semibold">Snow</span>
          <span className="mt-4 text-9xl font-bold">-8°</span>
          <span className="mt-4 text-2xl font-medium">Beijing</span>
        </div>
      </CardContent>
    </Card>
  )
}
