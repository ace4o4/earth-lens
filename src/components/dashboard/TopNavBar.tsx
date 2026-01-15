import { motion } from "framer-motion";
import { 
  Search, 
  Bell, 
  Settings, 
  User,
  Map,
  Layers3,
  Crosshair,
  Clock,
  Download
} from "lucide-react";
import CyberButton from "../ui/CyberButton";

interface TopNavBarProps {
  onSearchChange?: (query: string) => void;
}

const TopNavBar = ({ onSearchChange }: TopNavBarProps) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 h-14 bg-card/80 backdrop-blur-lg border-b border-primary/20 z-50"
    >
      <div className="h-full px-4 flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center gap-4">
          <motion.div
            className="relative"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-10 h-10 rounded-full border-2 border-primary/30 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full border border-primary animate-pulse-glow" />
              <div className="absolute w-2 h-2 bg-primary rounded-full top-1 right-1" />
            </div>
          </motion.div>
          <div>
            <h1 className="font-orbitron text-lg font-bold text-primary tracking-wider">
              GEO-FUSION
            </h1>
            <p className="text-[10px] text-muted-foreground -mt-1">
              Multi-Satellite Data Fusion Dashboard
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          <CyberButton variant="primary" size="sm" icon={<Map className="w-3 h-3" />}>
            Globe
          </CyberButton>
          <CyberButton variant="ghost" size="sm" icon={<Layers3 className="w-3 h-3" />}>
            Analysis
          </CyberButton>
          <CyberButton variant="ghost" size="sm" icon={<Crosshair className="w-3 h-3" />}>
            AOI
          </CyberButton>
          <CyberButton variant="ghost" size="sm" icon={<Clock className="w-3 h-3" />}>
            Timeline
          </CyberButton>
          <CyberButton variant="ghost" size="sm" icon={<Download className="w-3 h-3" />}>
            Export
          </CyberButton>
        </nav>

        {/* Search & Actions */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50" />
            <input
              type="text"
              placeholder="Search location..."
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-64 pl-10 pr-4 py-1.5 bg-muted/30 border border-primary/20 
                       text-sm placeholder:text-muted-foreground
                       focus:outline-none focus:border-primary/50 focus:bg-muted/50
                       transition-all duration-300"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground border border-primary/20 px-1">
              ⌘K
            </div>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-primary/10 transition-colors relative">
              <Bell className="w-4 h-4 text-primary/70" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </button>
            <button className="p-2 hover:bg-primary/10 transition-colors">
              <Settings className="w-4 h-4 text-primary/70" />
            </button>
            <button className="p-2 hover:bg-primary/10 transition-colors">
              <User className="w-4 h-4 text-primary/70" />
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default TopNavBar;
