import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Satellite, Radio, Clock, MapPin, RefreshCw, ChevronDown, ChevronRight } from "lucide-react";
import CyberFrame from "../ui/CyberFrame";
import { useSatelliteTracking, TrackedSatellite } from "@/hooks/useSatelliteTracking";
import CyberButton from "../ui/CyberButton";

interface SatelliteTrackerProps {
  observerLat?: number;
  observerLon?: number;
  onSatelliteSelect?: (satellite: TrackedSatellite) => void;
}

const SatelliteTracker = ({ 
  observerLat = 28.6139, 
  observerLon = 77.209,
  onSatelliteSelect 
}: SatelliteTrackerProps) => {
  const { satellites, lastUpdate, refreshPositions } = useSatelliteTracking(observerLat, observerLon);
  const [selectedSatellite, setSelectedSatellite] = useState<string | null>(null);
  const [showGroundTrack, setShowGroundTrack] = useState(true);

  const handleSatelliteClick = (sat: TrackedSatellite) => {
    setSelectedSatellite(selectedSatellite === sat.id ? null : sat.id);
    onSatelliteSelect?.(sat);
  };

  const getStatusColor = (status: TrackedSatellite["status"]) => {
    switch (status) {
      case "active":
        return "bg-primary";
      case "passing":
        return "bg-neon-green animate-pulse";
      case "horizon":
        return "bg-destructive";
    }
  };

  const getStatusLabel = (status: TrackedSatellite["status"]) => {
    switch (status) {
      case "active":
        return "TRACKING";
      case "passing":
        return "OVERHEAD";
      case "horizon":
        return "APPROACHING";
    }
  };

  const formatAltitude = (alt: number) => `${alt.toFixed(0)} km`;
  const formatVelocity = (vel: number) => `${vel.toFixed(2)} km/s`;

  return (
    <CyberFrame title="Satellite Tracking" className="w-80" variant="purple">
      {/* Header with refresh */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-secondary/20">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-secondary" />
          <span className="text-xs text-muted-foreground">LAST UPDATE</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-secondary text-sm">
            {lastUpdate.toISOString().slice(11, 19)} UTC
          </span>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9, rotate: 180 }}
            onClick={refreshPositions}
            className="p-1 hover:bg-secondary/10 transition-colors"
          >
            <RefreshCw className="w-3 h-3 text-secondary" />
          </motion.button>
        </div>
      </div>

      {/* Observer Location */}
      <div className="mb-4 p-2 bg-muted/20 border border-primary/10">
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <MapPin className="w-3 h-3 text-primary" />
          <span>OBSERVER: </span>
          <span className="text-primary font-mono">
            {observerLat.toFixed(4)}°N, {observerLon.toFixed(4)}°E
          </span>
        </div>
      </div>

      {/* Satellite List */}
      <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
        {satellites.map((sat, index) => (
          <motion.div
            key={sat.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => handleSatelliteClick(sat)}
            className={`
              p-3 cursor-pointer transition-all duration-300
              border border-transparent
              ${selectedSatellite === sat.id 
                ? 'bg-secondary/10 border-secondary/30' 
                : 'hover:bg-muted/30'}
            `}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={sat.status === 'passing' ? { 
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0]
                  } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Satellite className={`w-4 h-4 ${sat.status === 'passing' ? 'text-neon-green' : 'text-primary'}`} />
                </motion.div>
                <span className="text-sm font-orbitron">{sat.name}</span>
              </div>
              <span className={`text-xs px-1.5 py-0.5 border border-current/30 ${sat.providerColor}`}>
                {sat.provider}
              </span>
            </div>

            {/* Status & Position */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(sat.status)}`} />
                <span className="text-[10px] text-muted-foreground uppercase">
                  {getStatusLabel(sat.status)}
                </span>
                {sat.status === "passing" && (
                  <Radio className="w-3 h-3 text-neon-green animate-pulse" />
                )}
              </div>
              <span className={`text-[10px] font-mono ${sat.nextPass === 'NOW' ? 'text-neon-green' : 'text-muted-foreground'}`}>
                {sat.nextPass}
              </span>
            </div>

            {/* Quick Stats */}
            {sat.position && (
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ALT</span>
                  <span className="text-primary font-mono">{formatAltitude(sat.position.alt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">VEL</span>
                  <span className="text-primary font-mono">{formatVelocity(sat.position.velocity)}</span>
                </div>
              </div>
            )}

            {/* Expanded Details */}
            <AnimatePresence>
              {selectedSatellite === sat.id && sat.position && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 pt-3 border-t border-primary/10 space-y-3"
                >
                  {/* Position Details */}
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div>
                      <span className="text-muted-foreground">NORAD ID</span>
                      <p className="text-primary font-mono">{sat.noradId}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">ALTITUDE</span>
                      <p className="text-primary font-mono">{formatAltitude(sat.position.alt)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">VELOCITY</span>
                      <p className="text-primary font-mono">{formatVelocity(sat.position.velocity)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">NEXT PASS</span>
                      <p className={sat.nextPass === "NOW" ? "text-neon-green font-mono" : "text-primary font-mono"}>
                        {sat.nextPass}
                      </p>
                    </div>
                  </div>

                  {/* Current Position */}
                  <div className="text-[10px]">
                    <span className="text-muted-foreground">SUBSATELLITE POINT</span>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-primary/50" />
                      <span className="text-primary font-mono">
                        {sat.position.lat.toFixed(4)}°{sat.position.lat >= 0 ? 'N' : 'S'}, {' '}
                        {sat.position.lon.toFixed(4)}°{sat.position.lon >= 0 ? 'E' : 'W'}
                      </span>
                    </div>
                  </div>

                  {/* Ground Track Toggle */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground">
                      GROUND TRACK ({sat.groundTrack.length} points)
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowGroundTrack(!showGroundTrack);
                      }}
                      className="text-[10px] text-secondary hover:text-secondary/80"
                    >
                      {showGroundTrack ? 'Hide' : 'Show'}
                    </button>
                  </div>

                  {/* TLE Data Preview */}
                  <div className="text-[8px] font-mono text-muted-foreground/50 bg-muted/20 p-2 overflow-x-auto">
                    <div className="whitespace-nowrap">{sat.tle.line1.substring(0, 40)}...</div>
                    <div className="whitespace-nowrap">{sat.tle.line2.substring(0, 40)}...</div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <CyberButton variant="ghost" size="sm" className="flex-1">
                      Track
                    </CyberButton>
                    <CyberButton variant="primary" size="sm" className="flex-1">
                      Predict
                    </CyberButton>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Summary Footer */}
      <div className="mt-4 pt-3 border-t border-secondary/20 flex items-center justify-between text-[10px]">
        <span className="text-muted-foreground">
          {satellites.filter(s => s.status === 'passing').length} overhead
        </span>
        <span className="text-muted-foreground">
          {satellites.length} tracked
        </span>
      </div>
    </CyberFrame>
  );
};

export default SatelliteTracker;
