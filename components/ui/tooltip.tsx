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
  const triggerRef = React.useRef<HTMLDivElement>(null)

  React.useLayoutEffect(() => {
    if (isVisible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      const center = rect.left + rect.width / 2
      const windowWidth = window.innerWidth
      
      // If center is in the left 150px, align left
      if (center < 150) {
        setAlign("left")
      } 
      // If center is in the right 150px, align right
      else if (windowWidth - center < 150) {
        setAlign("right")
      } else {
        setAlign("center")
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

  const getArrowStyle = () => {
    if (!triggerRef.current) return {}
    const width = triggerRef.current.offsetWidth
    switch (align) {
      case "left": return { left: `${width / 2}px`, transform: "translateX(-50%)" }
      case "right": return { right: `${width / 2}px`, transform: "translateX(50%)" }
      default: return { left: "50%", transform: "translateX(-50%)" }
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
              style={getArrowStyle()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
