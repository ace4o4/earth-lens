import { motion } from "framer-motion";
import { ReactNode } from "react";

interface CyberFrameProps {
  children: ReactNode;
  title?: string;
  className?: string;
  variant?: "default" | "alert" | "success" | "purple";
  animate?: boolean;
}

const CyberFrame = ({ 
  children, 
  title, 
  className = "", 
  variant = "default",
  animate = true 
}: CyberFrameProps) => {
  const variantStyles = {
    default: "border-primary/30 before:bg-primary/20 after:bg-primary",
    alert: "border-destructive/30 before:bg-destructive/20 after:bg-destructive",
    success: "border-neon-green/30 before:bg-neon-green/20 after:bg-neon-green",
    purple: "border-secondary/30 before:bg-secondary/20 after:bg-secondary",
  };

  const glowStyles = {
    default: "shadow-[0_0_15px_hsl(var(--primary)/0.3)]",
    alert: "shadow-[0_0_15px_hsl(var(--destructive)/0.3)]",
    success: "shadow-[0_0_15px_hsl(var(--neon-green)/0.3)]",
    purple: "shadow-[0_0_15px_hsl(var(--secondary)/0.3)]",
  };

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 10 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`
        relative glassmorphism ${variantStyles[variant]} ${glowStyles[variant]}
        ${className}
      `}
    >
      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-primary" />
      <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-primary" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-primary" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-primary" />

      {/* Title Bar */}
      {title && (
        <div className="relative px-4 py-2 border-b border-primary/20">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse-glow" />
            <span className="text-xs font-orbitron uppercase tracking-widest text-primary">
              {title}
            </span>
          </div>
          {/* Scan line */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      )}

      {/* Content */}
      <div className="relative p-4">
        {children}
      </div>
    </motion.div>
  );
};

export default CyberFrame;
