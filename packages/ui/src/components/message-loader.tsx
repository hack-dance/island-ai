import { motion } from "framer-motion"

const loadingContainer = {
  width: "1rem",
  height: "1rem",
  display: "flex",
  justifyContent: "space-around"
}

const loadingCircle = {
  display: "block",
  width: "0.25rem",
  height: "0.25rem",
  backgroundColor: "hsl(var(--foreground))",
  borderRadius: "0.25rem"
}

const loadingContainerVariants = {
  start: {
    transition: {
      staggerChildren: 0.2
    }
  },
  end: {
    transition: {
      staggerChildren: 0.2
    }
  }
}

const loadingCircleVariants = {
  start: {
    y: "50%"
  },
  end: {
    y: "150%"
  }
}

const loadingCircleTransition: {
  duration: number
  repeat: number
  repeatType: "loop" | "reverse" | "mirror"
  ease: string
} = {
  duration: 0.5,
  repeat: Infinity,
  repeatType: "reverse",
  ease: "easeInOut"
}

export default function MessageLoader() {
  return (
    <motion.div
      style={loadingContainer}
      variants={loadingContainerVariants}
      initial="start"
      animate="end"
    >
      <motion.span
        style={loadingCircle}
        variants={loadingCircleVariants}
        transition={loadingCircleTransition}
      />
      <motion.span
        style={loadingCircle}
        variants={loadingCircleVariants}
        transition={loadingCircleTransition}
      />
      <motion.span
        style={loadingCircle}
        variants={loadingCircleVariants}
        transition={loadingCircleTransition}
      />
    </motion.div>
  )
}
