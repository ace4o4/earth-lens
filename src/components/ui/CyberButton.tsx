import { motion } from "framer-motion";
import { ReactNode } from "react";

interface CyberButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
  icon?: ReactNode;
}

const CyberButton = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  icon,
}: CyberButtonProps) => {
  const baseStyles = `
    relative font-mono uppercase tracking-wider
    flex items-center justify-center gap-2
    transition-all duration-300 ease-out
    disabled:opacity-50 disabled:cursor-not-allowed
    overflow-hidden group
  `;

  const variantStyles = {
    primary: `
      bg-primary/10 border border-primary/50
      text-primary hover:bg-primary/20
      hover:shadow-[0_0_20px_hsl(var(--primary)/0.4)]
      hover:border-primary
    `,
    secondary: `
      bg-secondary/10 border border-secondary/50
      text-secondary hover:bg-secondary/20
      hover:shadow-[0_0_20px_hsl(var(--secondary)/0.4)]
      hover:border-secondary
    `,
    ghost: `
      bg-transparent border border-primary/20
      text-primary/70 hover:text-primary
      hover:bg-primary/10 hover:border-primary/50
    `,
    danger: `
      bg-destructive/10 border border-destructive/50
      text-destructive hover:bg-destructive/20
      hover:shadow-[0_0_20px_hsl(var(--destructive)/0.4)]
      hover:border-destructive
    `,
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {/* Hover glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
      </div>

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-current opacity-50" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-current opacity-50" />

      {icon && <span className="relative z-10">{icon}</span>}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

export default CyberButton;
