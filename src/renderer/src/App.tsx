import { useState, useEffect } from 'react'
import { WeatherCard } from './components/weather-card'
import { motion } from 'motion/react'

import weatherIcon from '@/assets/img/tianqi.icon.png'

const app = { id: 'weather', icon: weatherIcon, component: WeatherCard }

function App(): JSX.Element {
  // 添加鼠标位置状态
  const [mousePosition, setMousePosition] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  })

  // 添加j键按下状态
  const [isJKeyPressed, setIsJKeyPressed] = useState(false)

  // 计算图标中心位置
  const centerX = window.innerWidth / 2
  const centerY = window.innerHeight / 2

  // 添加键盘移动速度配置
  const MOVE_SPEED = 10

  // 处理键盘事件
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 处理j键按下 - 切换模式
      if (e.key.toLowerCase() === 'j') {
        setIsJKeyPressed((prev) => !prev)
        return
      }

      setMousePosition((prev) => {
        let newX = prev.x
        let newY = prev.y

        switch (e.key.toLowerCase()) {
          // WASD控制
          case 'w':
            newY = Math.max(0, prev.y - MOVE_SPEED)
            break
          case 's':
            newY = Math.min(window.innerHeight, prev.y + MOVE_SPEED)
            break
          case 'a':
            newX = Math.max(0, prev.x - MOVE_SPEED)
            break
          case 'd':
            newX = Math.min(window.innerWidth, prev.x + MOVE_SPEED)
            break
        }

        return { x: newX, y: newY }
      })
    }

    // 添加键盘事件监听
    window.addEventListener('keydown', handleKeyDown)

    // 清理事件监听
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // 添加鼠标移动事件处理函数
  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({
      x: e.clientX,
      y: e.clientY
    })
  }

  // 计算光束角度和长度
  const calculateBeam = () => {
    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight
    // 调整虚拟点位置到屏幕下方偏中间位置
    const virtualPoint = {
      x: screenWidth * 0.6, // 从最右侧(1.0)改为偏右一点(0.6)
      y: screenHeight + 200
    }

    // 计算角度
    const angle = Math.atan2(virtualPoint.y - mousePosition.y, virtualPoint.x - mousePosition.x)

    // 计算光束长度
    const length = Math.sqrt(
      Math.pow(virtualPoint.x - mousePosition.x, 2) + Math.pow(virtualPoint.y - mousePosition.y, 2)
    )

    return { angle: angle * (180 / Math.PI), length }
  }

  const { angle, length } = calculateBeam()

  // 计算图标位置 - 基于屏幕中心位置计算偏移量
  const calculateIconPosition = () => {
    if (!isJKeyPressed) {
      // 不按j键时，图标在屏幕中心
      return {
        x: centerX - (6 * window.innerWidth) / 100,
        y: centerY - (6 * window.innerWidth) / 100
      }
    } else {
      // 按j键时，基于屏幕中心计算偏移
      // 计算鼠标相对于屏幕中心的偏移量
      const offsetX = mousePosition.x - centerX
      const offsetY = mousePosition.y - centerY

      // 将偏移量缩小（比如乘以0.3），使图标移动幅度小于鼠标
      const scaleFactor = 1

      return {
        x: centerX + offsetX * scaleFactor - (6 * window.innerWidth) / 100,
        y: centerY + offsetY * scaleFactor - (6 * window.innerWidth) / 100
      }
    }
  }

  const iconPosition = calculateIconPosition()

  return (
    <div className="w-screen h-screen bg-black/30" onMouseMove={handleMouseMove}>
      {/* 增强光束中心点效果 */}
      <div
        className="z-1000 pointer-events-none fixed w-6 h-6 rounded-full bg-white/40 blur-md"
        style={{
          left: mousePosition.x - 8,
          top: mousePosition.y - 8,
          boxShadow: `
            0 0 60px 30px rgba(255,255,255,0.2),
            0 0 30px 15px rgba(255,255,255,0.3),
            0 0 15px 5px rgba(255,255,255,0.4)
          `
        }}
      />
      <div
        className="z-1000 pointer-events-none fixed size-4 rounded-full border-white border-2 bg-white/20"
        style={{
          left: mousePosition.x - 8,
          top: mousePosition.y - 8
        }}
      />

      {/* 增强射线光束效果 */}
      <div
        className="z-1000 pointer-events-none fixed origin-left"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          width: length,
          height: '3px',
          background: `
            linear-gradient(90deg, 
              rgba(255,255,255,0.8) 0%,
              rgba(255,255,255,0.4) 40%,
              rgba(255,255,255,0.1) 100%
            )
          `,
          transform: `rotate(${angle}deg)`,
          opacity: 0.7,
          filter: 'blur(0.5px)',
          boxShadow: '0 0 20px 2px rgba(255,255,255,0.3)'
        }}
      />

      {/* 添加辅助光束效果 */}
      <div
        className="pointer-events-none fixed origin-left"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          width: length,
          height: '1px',
          background: `
            linear-gradient(90deg, 
              rgba(255,255,255,0.5) 0%,
              rgba(255,255,255,0.2) 100%
            )
          `,
          transform: `rotate(${angle}deg) translateY(2px)`,
          opacity: 0.5,
          filter: 'blur(1px)'
        }}
      />

      <motion.div
        key={app.id}
        className="absolute flex flex-col items-center gap-2 cursor-pointer rounded-2xl z-50"
        animate={{
          x: iconPosition.x,
          y: iconPosition.y
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 15,
          mass: 1,
          bounce: 0.5
        }}
      >
        <div className="transform rounded-2xl w-[12vw] h-[12vw] flex items-center justify-center">
          <img src={app.icon} className="w-full h-full object-cover" />
        </div>
      </motion.div>
    </div>
  )
}

export default App
