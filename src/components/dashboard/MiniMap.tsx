import { motion } from "framer-motion";

const MiniMap = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-48 h-36 glassmorphism overflow-hidden"
    >
      {/* Header */}
      <div className="px-2 py-1 border-b border-primary/20 flex items-center justify-between">
        <span className="text-[8px] font-orbitron text-primary uppercase">Overview</span>
        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
      </div>

      {/* Mini Globe */}
      <div className="relative w-full h-[calc(100%-24px)] bg-void-black">
        {/* Grid */}
        <div className="absolute inset-0 grid-pattern opacity-20" />

        {/* Simplified Map */}
        <svg viewBox="0 0 100 60" className="w-full h-full">
          {/* World outline - simplified */}
          <path
            d="M20 30 Q30 20 50 25 Q70 30 80 25 Q85 35 75 40 Q60 45 45 42 Q30 40 20 30"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="0.5"
            opacity="0.3"
          />
          
          {/* India highlight */}
          <polygon
            points="58,28 62,26 66,28 65,34 60,36 56,33"
            fill="hsl(var(--primary))"
            opacity="0.4"
          />

          {/* View extent box */}
          <rect
            x="54"
            y="24"
            width="16"
            height="14"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="1"
            className="animate-pulse-border"
          />

          {/* Satellite tracks */}
          <motion.circle
            r="1"
            fill="hsl(var(--neon-green))"
            animate={{
              cx: [20, 80],
              cy: [15, 45],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <motion.circle
            r="0.8"
            fill="hsl(var(--destructive))"
            animate={{
              cx: [80, 20],
              cy: [20, 40],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </svg>

        {/* Corner coordinates */}
        <div className="absolute bottom-1 left-1 text-[6px] text-muted-foreground font-mono">
          8°N, 68°E
        </div>
        <div className="absolute top-1 right-1 text-[6px] text-muted-foreground font-mono">
          37°N, 97°E
        </div>
      </div>
    </motion.div>
  );
};

export default MiniMap;
