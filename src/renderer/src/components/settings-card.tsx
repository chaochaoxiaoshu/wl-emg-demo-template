import { Settings, Bell, Moon, Sun, Volume2, Globe, RefreshCw, Lock } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Slider } from '@radix-ui/react-slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { ScrollArea } from './ui/scroll-area'
import { useEffect } from 'react'

export function SettingsCard() {
  useEffect(() => {
    window.electron.ipcRenderer.send('updateCurrentIndex', 3)
  }, [])
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Settings className="size-6 mr-4" />
          <span className="text-xl">Settings</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Bell className="size-5" />
                <Label htmlFor="notifications">Notifications</Label>
              </div>
              <Switch id="notifications" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Moon className="size-5" />
                <Label htmlFor="dark-mode">Dark Mode</Label>
              </div>
              <Switch id="dark-mode" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Sun className="size-5" />
                <Label htmlFor="auto-brightness">Auto Brightness</Label>
              </div>
              <Switch id="auto-brightness" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <Volume2 className="size-5" />
                <Label>Volume</Label>
              </div>
              <Slider defaultValue={[50]} max={100} step={1} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Globe className="size-5" />
                <Label>Language</Label>
              </div>
              <Select defaultValue="en">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Lock className="size-5" />
                <Label htmlFor="privacy-mode">Privacy Mode</Label>
              </div>
              <Switch id="privacy-mode" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <RefreshCw className="size-5" />
                <Label htmlFor="auto-update">Auto Update</Label>
              </div>
              <Switch id="auto-update" />
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
