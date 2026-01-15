import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Satellite, Radio, Clock, MapPin } from "lucide-react";
import CyberFrame from "../ui/CyberFrame";

interface SatelliteData {
  id: string;
  name: string;
  noradId: string;
  status: "active" | "passing" | "horizon";
  altitude: number;
  velocity: number;
  lat: number;
  lon: number;
  nextPass: string;
  provider: string;
  providerColor: string;
}

const satellites: SatelliteData[] = [
  {
    id: "rs2",
    name: "ResourceSat-2",
    noradId: "37387",
    status: "active",
    altitude: 817,
    velocity: 7.45,
    lat: 28.6139,
    lon: 77.209,
    nextPass: "12:45 UTC",
    provider: "ISRO",
    providerColor: "text-destructive",
  },
  {
    id: "s2a",
    name: "Sentinel-2A",
    noradId: "40697",
    status: "passing",
    altitude: 786,
    velocity: 7.42,
    lat: 35.2154,
    lon: 82.4578,
    nextPass: "NOW",
    provider: "ESA",
    providerColor: "text-neon-green",
  },
  {
    id: "oceansat",
    name: "OceanSat-3",
    noradId: "54358",
    status: "horizon",
    altitude: 720,
    velocity: 7.48,
    lat: -12.4567,
    lon: 45.7891,
    nextPass: "14:22 UTC",
    provider: "ISRO",
    providerColor: "text-destructive",
  },
  {
    id: "cartosat",
    name: "CartoSat-3",
    noradId: "44804",
    status: "active",
    altitude: 509,
    velocity: 7.59,
    lat: 22.5726,
    lon: 88.3639,
    nextPass: "15:08 UTC",
    provider: "ISRO",
    providerColor: "text-destructive",
  },
];

const SatelliteTracker = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedSatellite, setSelectedSatellite] = useState<string | null>("s2a");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status: SatelliteData["status"]) => {
    switch (status) {
      case "active":
        return "bg-primary";
      case "passing":
        return "bg-neon-green animate-pulse";
      case "horizon":
        return "bg-muted-foreground";
    }
  };

  const getStatusLabel = (status: SatelliteData["status"]) => {
    switch (status) {
      case "active":
        return "TRACKING";
      case "passing":
        return "OVERHEAD";
      case "horizon":
        return "HORIZON";
    }
  };

  return (
    <CyberFrame title="Satellite Tracking" className="w-80" variant="purple">
      {/* Current Time */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-secondary/20">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-secondary" />
          <span className="text-xs text-muted-foreground">UTC TIME</span>
        </div>
        <span className="font-mono text-secondary text-sm">
          {currentTime.toISOString().slice(11, 19)}
        </span>
      </div>

      {/* Satellite List */}
      <div className="space-y-3 max-h-[40vh] overflow-y-auto">
        {satellites.map((sat, index) => (
          <motion.div
            key={sat.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedSatellite(sat.id)}
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
                <Satellite className={`w-4 h-4 ${sat.status === 'passing' ? 'text-neon-green' : 'text-primary'}`} />
                <span className="text-sm font-orbitron">{sat.name}</span>
              </div>
              <span className={`text-xs px-1.5 py-0.5 border border-current/30 ${sat.providerColor}`}>
                {sat.provider}
              </span>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${getStatusColor(sat.status)}`} />
              <span className="text-[10px] text-muted-foreground uppercase">
                {getStatusLabel(sat.status)}
              </span>
              {sat.status === "passing" && (
                <Radio className="w-3 h-3 text-neon-green animate-pulse" />
              )}
            </div>

            {/* Details */}
            {selectedSatellite === sat.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-3 pt-3 border-t border-primary/10 space-y-2"
              >
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div>
                    <span className="text-muted-foreground">NORAD ID</span>
                    <p className="text-primary">{sat.noradId}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">ALTITUDE</span>
                    <p className="text-primary">{sat.altitude} km</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">VELOCITY</span>
                    <p className="text-primary">{sat.velocity} km/s</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">NEXT PASS</span>
                    <p className={sat.nextPass === "NOW" ? "text-neon-green" : "text-primary"}>
                      {sat.nextPass}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[10px]">
                  <MapPin className="w-3 h-3 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {sat.lat.toFixed(4)}°, {sat.lon.toFixed(4)}°
                  </span>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </CyberFrame>
  );
};

export default SatelliteTracker;
