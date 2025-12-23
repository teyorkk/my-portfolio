"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"

interface TooltipProps {
  children: React.ReactNode
  content: string
}

export function Tooltip({ children, content }: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  const [align, setAlign] = React.useState<"center" | "left" | "right">("center")
  const [arrowStyle, setArrowStyle] = React.useState<React.CSSProperties>({})
  const triggerRef = React.useRef<HTMLDivElement>(null)

  React.useLayoutEffect(() => {
    if (isVisible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      const center = rect.left + rect.width / 2
      const windowWidth = window.innerWidth
      const width = rect.width
      
      // If center is in the left 150px, align left
      if (center < 150) {
        setAlign("left")
        setArrowStyle({ left: `${width / 2}px`, transform: "translateX(-50%)" })
      } 
      // If center is in the right 150px, align right
      else if (windowWidth - center < 150) {
        setAlign("right")
        setArrowStyle({ right: `${width / 2}px`, transform: "translateX(50%)" })
      } else {
        setAlign("center")
        setArrowStyle({ left: "50%", transform: "translateX(-50%)" })
      }
    }
  }, [isVisible])

  const getPositionClasses = () => {
    switch (align) {
      case "left": return "left-0"
      case "right": return "right-0"
      default: return "left-1/2 -translate-x-1/2"
    }
  }

  return (
    <div 
      ref={triggerRef}
      className="relative flex items-center justify-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`absolute bottom-full mb-2 px-3 py-1.5 text-xs text-primary-foreground bg-primary rounded-md whitespace-nowrap z-50 shadow-lg pointer-events-none ${getPositionClasses()}`}
          >
            {content}
            <div 
              className="absolute top-full -mt-1 border-4 border-transparent border-t-primary" 
              style={arrowStyle}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
