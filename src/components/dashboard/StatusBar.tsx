import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  Wifi, 
  Server, 
  Database, 
  Cpu, 
  HardDrive,
  Activity,
  Globe,
  Zap
} from "lucide-react";

const StatusBar = () => {
  const [stats, setStats] = useState({
    cpu: 34,
    memory: 62,
    network: 128,
    dataPoints: 2847562,
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      // Simulate fluctuating stats
      setStats(prev => ({
        cpu: Math.min(100, Math.max(20, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.min(100, Math.max(40, prev.memory + (Math.random() - 0.5) * 5)),
        network: Math.min(500, Math.max(50, prev.network + (Math.random() - 0.5) * 50)),
        dataPoints: prev.dataPoints + Math.floor(Math.random() * 100),
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-0 left-0 right-0 h-10 bg-card/80 backdrop-blur-lg border-t border-primary/20 z-50"
    >
      <div className="h-full px-4 flex items-center justify-between">
        {/* Left Section - System Status */}
        <div className="flex items-center gap-6">
          {/* Connection Status */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Wifi className="w-4 h-4 text-neon-green" />
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-neon-green rounded-full animate-pulse" />
            </div>
            <span className="text-[10px] text-neon-green uppercase">Connected</span>
          </div>

          {/* Separator */}
          <div className="w-px h-4 bg-primary/20" />

          {/* API Status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Server className="w-3 h-3 text-primary/50" />
              <span className="text-[10px] text-muted-foreground">VEDAS</span>
              <div className="w-1.5 h-1.5 bg-neon-green rounded-full" />
            </div>
            <div className="flex items-center gap-1.5">
              <Database className="w-3 h-3 text-primary/50" />
              <span className="text-[10px] text-muted-foreground">BHUVAN</span>
              <div className="w-1.5 h-1.5 bg-neon-green rounded-full" />
            </div>
            <div className="flex items-center gap-1.5">
              <Globe className="w-3 h-3 text-primary/50" />
              <span className="text-[10px] text-muted-foreground">SENTINEL</span>
              <div className="w-1.5 h-1.5 bg-neon-green rounded-full" />
            </div>
          </div>
        </div>

        {/* Center Section - Performance Metrics */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Cpu className="w-3 h-3 text-primary/50" />
            <span className="text-[10px] text-muted-foreground">CPU</span>
            <span className="text-[10px] text-primary font-mono">{stats.cpu.toFixed(0)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <HardDrive className="w-3 h-3 text-primary/50" />
            <span className="text-[10px] text-muted-foreground">MEM</span>
            <span className="text-[10px] text-primary font-mono">{stats.memory.toFixed(0)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-3 h-3 text-primary/50" />
            <span className="text-[10px] text-muted-foreground">NET</span>
            <span className="text-[10px] text-primary font-mono">{stats.network.toFixed(0)} Mb/s</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-destructive" />
            <span className="text-[10px] text-muted-foreground">POINTS</span>
            <span className="text-[10px] text-destructive font-mono">{formatNumber(stats.dataPoints)}</span>
          </div>
        </div>

        {/* Right Section - Time */}
        <div className="flex items-center gap-4">
          <div className="text-[10px] text-muted-foreground">
            <span className="text-primary/50">LOCAL</span>{" "}
            <span className="font-mono text-primary">
              {currentTime.toLocaleTimeString()}
            </span>
          </div>
          <div className="text-[10px] text-muted-foreground">
            <span className="text-primary/50">UTC</span>{" "}
            <span className="font-mono text-primary">
              {currentTime.toISOString().slice(11, 19)}
            </span>
          </div>
          <div className="text-[10px] font-orbitron text-primary/50">
            MSDFD v1.0.0
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StatusBar;
