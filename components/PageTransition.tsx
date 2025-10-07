import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface PageTransitionProps {
  children: ReactNode;
  pageKey: string;
  className?: string;
}

interface SlideTransitionProps extends PageTransitionProps {
  direction?: 'left' | 'right' | 'up' | 'down';
}

// Basic fade transition
export function PageTransition({ children, pageKey, className = '' }: PageTransitionProps) {
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.98
    },
    in: {
      opacity: 1,
      y: 0,
      scale: 1
    },
    out: {
      opacity: 0,
      y: -20,
      scale: 1.02
    }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.4
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pageKey}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Fade transition - simple opacity change
export function FadeTransition({ children, pageKey, className = '' }: PageTransitionProps) {
  const fadeVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    out: { opacity: 0 }
  };

  const fadeTransition = {
    type: 'tween',
    duration: 0.3
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pageKey}
        initial="initial"
        animate="in"
        exit="out"
        variants={fadeVariants}
        transition={fadeTransition}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Slide transition - sliding from different directions
export function SlideTransition({ children, pageKey, direction = 'right', className = '' }: SlideTransitionProps) {
  const getSlideVariants = (dir: string) => {
    const variants = {
      left: { initial: { x: -100, opacity: 0 }, in: { x: 0, opacity: 1 }, out: { x: 100, opacity: 0 } },
      right: { initial: { x: 100, opacity: 0 }, in: { x: 0, opacity: 1 }, out: { x: -100, opacity: 0 } },
      up: { initial: { y: -100, opacity: 0 }, in: { y: 0, opacity: 1 }, out: { y: 100, opacity: 0 } },
      down: { initial: { y: 100, opacity: 0 }, in: { y: 0, opacity: 1 }, out: { y: -100, opacity: 0 } }
    };
    return variants[dir as keyof typeof variants];
  };

  const slideTransition = {
    type: 'spring',
    damping: 25,
    stiffness: 200
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pageKey}
        initial="initial"
        animate="in"
        exit="out"
        variants={getSlideVariants(direction)}
        transition={slideTransition}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Scale transition - growing/shrinking effect
export function ScaleTransition({ children, pageKey, className = '' }: PageTransitionProps) {
  const scaleVariants = {
    initial: { 
      opacity: 0, 
      scale: 0.8,
      rotate: -10
    },
    in: { 
      opacity: 1, 
      scale: 1,
      rotate: 0
    },
    out: { 
      opacity: 0, 
      scale: 1.1,
      rotate: 10
    }
  };

  const scaleTransition = {
    type: 'spring',
    damping: 20,
    stiffness: 260
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pageKey}
        initial="initial"
        animate="in"
        exit="out"
        variants={scaleVariants}
        transition={scaleTransition}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Flip transition - 3D flip effect
export function FlipTransition({ children, pageKey, className = '' }: PageTransitionProps) {
  const flipVariants = {
    initial: {
      opacity: 0,
      rotateY: 90,
      scale: 0.8
    },
    in: {
      opacity: 1,
      rotateY: 0,
      scale: 1
    },
    out: {
      opacity: 0,
      rotateY: -90,
      scale: 0.8
    }
  };

  const flipTransition = {
    type: 'spring',
    damping: 25,
    stiffness: 180
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pageKey}
        initial="initial"
        animate="in"
        exit="out"
        variants={flipVariants}
        transition={flipTransition}
        style={{ perspective: 1000 }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Bounce transition - playful bouncy effect
export function BounceTransition({ children, pageKey, className = '' }: PageTransitionProps) {
  const bounceVariants = {
    initial: { 
      opacity: 0, 
      y: -100,
      scale: 0.5
    },
    in: { 
      opacity: 1, 
      y: 0,
      scale: 1
    },
    out: { 
      opacity: 0, 
      y: 100,
      scale: 0.5
    }
  };

  const bounceTransition = {
    type: 'spring',
    damping: 15,
    stiffness: 150,
    bounce: 0.6
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pageKey}
        initial="initial"
        animate="in"
        exit="out"
        variants={bounceVariants}
        transition={bounceTransition}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Rotate transition - spinning effect
export function RotateTransition({ children, pageKey, className = '' }: PageTransitionProps) {
  const rotateVariants = {
    initial: { 
      opacity: 0, 
      rotate: -180,
      scale: 0.5
    },
    in: { 
      opacity: 1, 
      rotate: 0,
      scale: 1
    },
    out: { 
      opacity: 0, 
      rotate: 180,
      scale: 0.5
    }
  };

  const rotateTransition = {
    type: 'spring',
    damping: 20,
    stiffness: 200
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pageKey}
        initial="initial"
        animate="in"
        exit="out"
        variants={rotateVariants}
        transition={rotateTransition}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}