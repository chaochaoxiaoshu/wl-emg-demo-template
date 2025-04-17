import { useCallback, useEffect, useRef, useState } from 'react'
import broswer from '@/assets/img/broswer.svg'
import location from '@/assets/img/location.svg'
import mic from '@/assets/img/mic.svg'
import ticiqi from '@/assets/img/ticiqi.svg'
import camera from '@/assets/img/camera.svg'

const apps = [
  { icon: broswer, name: '浏览器' },
  { icon: location, name: '导航' },
  { icon: mic, name: '语音助手' },
  { icon: ticiqi, name: '提词器' },
  { icon: camera, name: '拍照' }
]

// 滚动的物理参数
const SCROLL_STEP = 10 // 每次按键滚动的基础距离
const DECELERATION = 0.92 // 减速系数（略微调高以更快停下来）
const SNAP_THRESHOLD = 1.5 // 停止滚动的阈值（降低以更快进入吸附状态）
const MAX_SCALE = 1.8 // 中心图标的最大缩放比例
const SNAP_DURATION = 300 // 吸附动画持续时间（毫秒），缩短以加快吸附速度

interface CenterItem {
  index: number
  distance: number
  element: HTMLDivElement
}

function App(): JSX.Element {
  const [isPressMode, setIsPressMode] = useState(false)
  const [scrollVelocity, setScrollVelocity] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const requestRef = useRef<number>()
  const itemsRef = useRef<(HTMLDivElement | null)[]>([])

  // 处理键盘事件
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'j') {
        setIsPressMode((prev) => !prev)
      }

      if (isPressMode) {
        if (e.key.toLowerCase() === 'a') {
          // 向左滚动
          setScrollVelocity((prev) => prev - SCROLL_STEP)
          setIsScrolling(true)
        } else if (e.key.toLowerCase() === 'd') {
          // 向右滚动
          setScrollVelocity((prev) => prev + SCROLL_STEP)
          setIsScrolling(true)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPressMode])

  // 获取当前中心位置附近的元素
  const getCenterItem = useCallback((): CenterItem | null => {
    if (!containerRef.current || itemsRef.current.length === 0) return null

    const containerRect = containerRef.current.getBoundingClientRect()
    const containerCenter = containerRect.left + containerRect.width / 2

    let closestItem: CenterItem | null = null
    let minDistance = Infinity

    itemsRef.current.forEach((item, index) => {
      if (!item) return

      const itemRect = item.getBoundingClientRect()
      const itemCenter = itemRect.left + itemRect.width / 2
      const distance = Math.abs(itemCenter - containerCenter)

      if (distance < minDistance) {
        minDistance = distance
        closestItem = { index, distance, element: item }
      }
    })

    return closestItem
  }, [containerRef, itemsRef])

  // 计算缩放比例
  const updateScaling = useCallback(() => {
    if (!containerRef.current) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const containerCenter = containerRect.left + containerRect.width / 2

    itemsRef.current.forEach((item) => {
      if (!item) return

      const itemRect = item.getBoundingClientRect()
      const itemCenter = itemRect.left + itemRect.width / 2
      const distance = Math.abs(itemCenter - containerCenter)
      const maxDistance = containerRect.width / 3 // 缩小有效范围，使缩放效果更加聚中

      // 距离越小，缩放比例越大，使用更强的缩放函数
      const scale = 1 + (MAX_SCALE - 1) * Math.pow(1 - Math.min(distance / maxDistance, 1), 2)

      // 使用属性设置替代样式直接设置，以便更好地利用GPU加速
      item.style.transform = `scale(${scale})`
      item.style.transition = 'transform 0.1s ease-out' // 更快的过渡时间
    })
  }, [containerRef, itemsRef])

  // 滚动到中心点附近的元素
  const snapToCenter = useCallback(() => {
    const centerItem = getCenterItem()
    if (!centerItem || !containerRef.current) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const containerCenter = containerRect.left + containerRect.width / 2
    const itemRect = centerItem.element.getBoundingClientRect()
    const itemCenter = itemRect.left + itemRect.width / 2

    // 计算需要滚动的距离
    const targetScrollLeft = containerRef.current.scrollLeft + (itemCenter - containerCenter)
    const startScrollLeft = containerRef.current.scrollLeft

    // 处理边缘情况 - 确保不会尝试滚动到超出范围的位置
    const maxScrollLeft = containerRef.current.scrollWidth - containerRef.current.clientWidth
    const adjustedTargetScrollLeft = Math.max(0, Math.min(maxScrollLeft, targetScrollLeft))
    const adjustedScrollDistance = adjustedTargetScrollLeft - startScrollLeft

    if (Math.abs(adjustedScrollDistance) < 1) return // 如果距离很小就不需要动画

    // 使用动画帧平滑过渡
    let startTime: number | null = null
    const duration = SNAP_DURATION

    const animateSnap = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)

      // 使用缓动函数使动画更自然，但起始加速更快
      const easeProgress = easeOutQuad(progress)

      if (containerRef.current) {
        containerRef.current.scrollLeft = startScrollLeft + adjustedScrollDistance * easeProgress
        updateScaling() // 在每一帧更新缩放比例
      }

      if (progress < 1) {
        requestAnimationFrame(animateSnap)
      }
    }

    requestAnimationFrame(animateSnap)
  }, [getCenterItem, containerRef, updateScaling])

  // 缓动函数：更加自然的加速过渡
  const easeOutQuad = (t: number): number => {
    // 结合两种缓动效果，开始更快，结束更平滑
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  }

  // 动画滚动效果
  const animateScroll = useCallback(() => {
    if (!containerRef.current) return

    if (Math.abs(scrollVelocity) < SNAP_THRESHOLD) {
      // 速度很小时停止滚动并对齐中心
      setScrollVelocity(0)
      setIsScrolling(false)
      snapToCenter() // 启动平滑吸附
      return
    }

    // 应用物理减速
    setScrollVelocity((prev) => prev * DECELERATION)

    // 更新滚动位置
    containerRef.current.scrollLeft += scrollVelocity

    // 立即更新元素缩放 - 每一帧都更新以获得即时效果
    updateScaling()

    // 继续动画
    requestRef.current = requestAnimationFrame(animateScroll)
  }, [scrollVelocity, snapToCenter, updateScaling])

  // 启动或停止滚动动画
  useEffect(() => {
    if (isScrolling) {
      // 开始滚动时立即更新一次缩放比例
      updateScaling()
      requestRef.current = requestAnimationFrame(animateScroll)
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [isScrolling, scrollVelocity, animateScroll, updateScaling])

  // 禁用鼠标和触控板事件
  useEffect(() => {
    const disableScrolling = (e: WheelEvent | TouchEvent) => {
      e.preventDefault()
      e.stopPropagation()
      return false
    }

    const container = containerRef.current
    if (container) {
      // 禁用鼠标滚轮事件
      container.addEventListener('wheel', disableScrolling, { passive: false })
      // 禁用触控板手势
      container.addEventListener('touchmove', disableScrolling, { passive: false })
      // 禁用拖拽事件
      container.addEventListener('mousedown', (e) => e.preventDefault())

      // 添加滚动事件监听器，确保在滚动时实时更新缩放
      const handleScroll = () => updateScaling()
      container.addEventListener('scroll', handleScroll)
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', disableScrolling)
        container.removeEventListener('touchmove', disableScrolling)
        container.removeEventListener('mousedown', (e) => e.preventDefault())
        container.removeEventListener('scroll', () => updateScaling())
      }
    }
  }, [containerRef, updateScaling])

  // 初始缩放更新
  useEffect(() => {
    updateScaling()
  }, [updateScaling])

  return (
    <div className="w-screen h-screen bg-black flex justify-center items-center">
      <div
        ref={containerRef}
        className="flex items-center h-full gap-x-[11vw] px-[50vw] overflow-x-auto no-scrollbar touch-none"
      >
        {apps.map((app, index) => (
          <div
            key={app.name}
            ref={(el) => (itemsRef.current[index] = el)}
            className="flex-none flex flex-col items-center space-y-6 transform will-change-transform"
          >
            <img src={app.icon} alt={app.name} className="size-32" />
            <span className="text-2xl">{app.name}</span>
          </div>
        ))}
      </div>
      {isPressMode && (
        <div className="absolute bottom-4 left-4 bg-white/20 px-4 py-2 rounded text-white">
          按下模式已启用 (A/D 键滚动)
        </div>
      )}
    </div>
  )
}

export default App
