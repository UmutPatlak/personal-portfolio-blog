import { motion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

export type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'none';
export type RevealEffect = 'fade' | 'slide' | 'scale' | 'blur' | 'rotate' | 'flip';

interface ScrollRevealProps {
  children: ReactNode;
  direction?: RevealDirection;
  effect?: RevealEffect;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  once?: boolean;
  threshold?: number;
  /** Stagger children animation — wraps children with stagger container */
  stagger?: boolean;
  staggerDelay?: number;
}

function getVariants(
  direction: RevealDirection,
  effect: RevealEffect,
  distance: number,
): Variants {
  const directionMap: Record<RevealDirection, { x: number; y: number }> = {
    up: { x: 0, y: distance },
    down: { x: 0, y: -distance },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
    none: { x: 0, y: 0 },
  };

  const { x, y } = directionMap[direction];

  const base = {
    hidden: { opacity: 0, x, y } as Record<string, unknown>,
    visible: { opacity: 1, x: 0, y: 0 } as Record<string, unknown>,
  };

  switch (effect) {
    case 'scale':
      base.hidden.scale = 0.85;
      base.visible.scale = 1;
      break;
    case 'blur':
      base.hidden.filter = 'blur(12px)';
      base.visible.filter = 'blur(0px)';
      break;
    case 'rotate':
      base.hidden.rotate = direction === 'left' ? -8 : direction === 'right' ? 8 : -5;
      base.visible.rotate = 0;
      break;
    case 'flip':
      base.hidden.rotateX = 20;
      base.hidden.perspective = 800;
      base.visible.rotateX = 0;
      base.visible.perspective = 800;
      break;
    case 'slide':
      // Just translate, already covered by base
      break;
    case 'fade':
    default:
      break;
  }

  return base;
}

export function ScrollReveal({
  children,
  direction = 'up',
  effect = 'fade',
  delay = 0,
  duration = 0.6,
  distance = 60,
  className = '',
  once = true,
  threshold = 0.15,
  stagger = false,
  staggerDelay = 0.1,
}: ScrollRevealProps) {
  const variants = getVariants(direction, effect, distance);

  if (stagger) {
    return (
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once, amount: threshold }}
        transition={{ staggerChildren: staggerDelay, delayChildren: delay }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: threshold }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Wrap individual stagger children with this */
interface ScrollRevealItemProps {
  children: ReactNode;
  direction?: RevealDirection;
  effect?: RevealEffect;
  distance?: number;
  duration?: number;
  className?: string;
}

export function ScrollRevealItem({
  children,
  direction = 'up',
  effect = 'fade',
  distance = 40,
  duration = 0.5,
  className = '',
}: ScrollRevealItemProps) {
  const variants = getVariants(direction, effect, distance);

  return (
    <motion.div
      variants={variants}
      transition={{
        duration,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
