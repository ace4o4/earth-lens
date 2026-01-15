import { motion } from "framer-motion";
import { useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Calendar } from "lucide-react";
import CyberButton from "../ui/CyberButton";

const TimelineSlider = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date("2024-01-15"));
  const [selectedRange, setSelectedRange] = useState({ start: 0, end: 100 });

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleStepBack = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() - 7);
      return newDate;
    });
  };

  const handleStepForward = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + 7);
      return newDate;
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-12 left-1/2 -translate-x-1/2 z-40"
    >
      <div className="glassmorphism px-6 py-4 min-w-[600px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-xs font-orbitron text-primary uppercase tracking-wider">
              Temporal Navigator
            </span>
          </div>
          <div className="text-sm font-mono text-secondary">
            {formatDate(currentDate)}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 mb-4">
          {/* Playback Controls */}
          <div className="flex items-center gap-2">
            <CyberButton variant="ghost" size="sm" onClick={handleStepBack}>
              <SkipBack className="w-4 h-4" />
            </CyberButton>
            <CyberButton 
              variant={isPlaying ? "secondary" : "primary"} 
              size="sm" 
              onClick={handlePlayPause}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </CyberButton>
            <CyberButton variant="ghost" size="sm" onClick={handleStepForward}>
              <SkipForward className="w-4 h-4" />
            </CyberButton>
          </div>

          {/* Timeline Track */}
          <div className="flex-1 relative h-8">
            {/* Background Track */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 bg-muted/30" />
            
            {/* Month Markers */}
            <div className="absolute inset-x-0 top-0 flex justify-between">
              {months.map((month, i) => (
                <div key={month} className="flex flex-col items-center">
                  <div className="w-px h-2 bg-primary/30" />
                  <span className="text-[8px] text-muted-foreground mt-1">
                    {month}
                  </span>
                </div>
              ))}
            </div>

            {/* Active Range */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-primary to-secondary"
              style={{
                left: `${selectedRange.start}%`,
                width: `${selectedRange.end - selectedRange.start}%`,
              }}
            />

            {/* Current Position Indicator */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 cursor-pointer"
              style={{ left: "45%" }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              whileHover={{ scale: 1.2 }}
            >
              <div className="w-4 h-4 bg-primary rounded-full border-2 border-background shadow-[0_0_10px_hsl(var(--primary))]" />
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] text-primary whitespace-nowrap">
                {formatDate(currentDate)}
              </div>
            </motion.div>
          </div>

          {/* Speed Control */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground">SPEED</span>
            <select className="bg-muted/30 border border-primary/20 text-xs px-2 py-1 text-primary">
              <option value="0.5">0.5x</option>
              <option value="1">1x</option>
              <option value="2">2x</option>
              <option value="5">5x</option>
            </select>
          </div>
        </div>

        {/* Data Availability Indicators */}
        <div className="flex items-center gap-4 pt-2 border-t border-primary/10">
          <span className="text-[10px] text-muted-foreground">DATA COVERAGE:</span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-neon-green rounded-full" />
              <span className="text-[10px] text-neon-green">SENTINEL-2</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-destructive rounded-full" />
              <span className="text-[10px] text-destructive">VEDAS</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-secondary rounded-full" />
              <span className="text-[10px] text-secondary">BHUVAN</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TimelineSlider;
