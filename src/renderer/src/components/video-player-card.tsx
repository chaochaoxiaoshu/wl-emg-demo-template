import { useCallback, useEffect, useRef, useState } from 'react'
import { Play, Video } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export function VideoPlayerCard() {
  useEffect(() => {
    window.electron.ipcRenderer.send('updateCurrentIndex', 5)
  }, [])

  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (isPlaying) {
      videoRef.current?.play()
    } else {
      videoRef.current?.pause()
    }
  }, [isPlaying])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case ' ':
          event.preventDefault()
          setIsPlaying(!isPlaying)
          break
        case 'Enter':
          event.preventDefault()
          setIsPlaying(!isPlaying)
          break
        case 'ArrowUp':
          event.preventDefault()
          scrollAreaRef.current?.scrollTo({
            top: scrollAreaRef.current.scrollTop - 200,
            behavior: 'smooth'
          })
          break
        case 'ArrowDown':
          event.preventDefault()
          scrollAreaRef.current?.scrollTo({
            top: scrollAreaRef.current.scrollTop + 200,
            behavior: 'smooth'
          })
          break
      }
    },
    [isPlaying]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Video className="size-6 mr-4" />
          <span className="text-xl">VideoPlayer</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          ref={scrollAreaRef}
          className="prose flex flex-col h-[calc(78vh-160px)] space-y-6 overflow-y-scroll"
        >
          <div className="relative" onClick={() => setIsPlaying(!isPlaying)}>
            <video ref={videoRef} src="http://vjs.zencdn.net/v/oceans.mp4" className="w-full" />
            {!isPlaying && (
              <Play className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white size-10" />
            )}
          </div>
          <h1>Wonders of the Animal Kingdom</h1>
          <p>
            Welcome to the fascinating world of animals, a realm filled with extraordinary
            diversity, intricate ecosystems, and awe-inspiring behaviors. From the vast savannahs of
            Africa to the mysterious depths of the oceans, animals inhabit nearly every corner of
            our planet, each adapted to thrive in their unique environment.
          </p>
          <h2>African Elephant</h2>
          <p>
            Let’s begin our journey with the majestic African elephant, the largest land animal on
            Earth. With their powerful trunks, sensitive tusks, and intricate social structures,
            these gentle giants roam the grasslands, leaving trails of wisdom in their path. Did you
            know elephants mourn their dead and can remember places and faces for decades?
          </p>
          <h2>Humpback Whale</h2>
          <p>
            Now, we dive into the oceans, where the humpback whale takes center stage. These marine
            giants are known for their hauntingly beautiful songs that echo across the seas.
            Scientists believe their complex melodies might serve as a form of communication or even
            a way to navigate the vast underwater expanse.
          </p>
          <h2>Peregrine Falcon</h2>
          <p>
            From the oceans to the skies, the peregrine falcon showcases nature’s speed and
            precision. This master hunter dives at speeds exceeding 240 miles per hour, making it
            the fastest animal on the planet. With keen eyesight that can spot prey from a mile
            away, it’s a true marvel of the avian world.
          </p>
          <h2>Leafcutter Ant</h2>
          <p>
            But not all animals dominate through size or speed. The leafcutter ant, for example, is
            a tiny architect that creates vast underground cities. Working together, colonies of
            these ants can strip entire trees of leaves to cultivate their fungal gardens, a
            remarkable display of teamwork and agricultural expertise.
          </p>
          <h2>Snow Leopard</h2>
          <p>
            And then there are creatures shrouded in mystery, like the elusive snow leopard. Found
            high in the remote mountain ranges of Central Asia, this ghost of the mountains moves
            gracefully through its harsh environment, perfectly camouflaged by its spotted coat.
            Their survival in such an unforgiving climate reminds us of nature’s resilience.
          </p>
          <h2>Conclusion</h2>
          <p>
            The animal kingdom is not just a collection of species—it’s a testament to evolution’s
            power, a network of interdependence, and a source of endless wonder. Each creature, big
            or small, plays a vital role in maintaining the delicate balance of life on Earth.
          </p>
          <p>
            As we marvel at these incredible animals, let us also remember our responsibility to
            protect them. Through conservation efforts, sustainable practices, and a deeper
            appreciation for the natural world, we can ensure that these wonders endure for
            generations to come.
          </p>
          <p>
            Thank you for joining this journey into the animal kingdom. Let’s continue to celebrate
            and protect the incredible diversity of life that shares our planet.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
