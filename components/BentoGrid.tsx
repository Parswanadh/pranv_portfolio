'use client'

import { motion } from 'framer-motion'
import { ReactNode, memo } from 'react'

type BentoSize = 'small' | 'medium' | 'large' | 'wide' | 'tall' | 'hero'

export interface BentoItem {
  id: string
  content: ReactNode
  size: BentoSize
  colSpan?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

interface BentoGridProps {
  items: BentoItem[]
  className?: string
}

const sizeClasses: Record<BentoSize, string> = {
  small: 'col-span-1 row-span-1',
  medium: 'col-span-1 row-span-1 md:col-span-2',
  large: 'col-span-1 row-span-2 md:col-span-2 md:row-span-2',
  wide: 'col-span-1 row-span-1 sm:col-span-2',
  tall: 'col-span-1 row-span-2',
  hero: 'col-span-1 row-span-1 sm:col-span-2 sm:row-span-2 lg:col-span-2 lg:row-span-2',
}

// Memoized renderer to prevent unnecessary re-renders during serialization
const BentoItemRenderer = memo(({ item, index }: { item: BentoItem; index: number }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      className={`${sizeClasses[item.size]} ${item.className || ''} rounded-xl overflow-hidden bento-card-mobile`}
    >
      {item.content}
    </motion.div>
  )
})
BentoItemRenderer.displayName = 'BentoItemRenderer'

export function BentoGrid({ items, className = '' }: BentoGridProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(160px,auto)] gap-4 bento-grid-mobile sm:bento-grid-tablet bento-grid-compact ${className}`}>
      {items.map((item, index) => (
        <BentoItemRenderer key={item.id} item={item} index={index} />
      ))}
    </div>
  )
}
