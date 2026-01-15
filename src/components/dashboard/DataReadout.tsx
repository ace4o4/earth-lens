import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Gauge,
  TreePine,
  AlertTriangle
} from "lucide-react";
import CyberFrame from "../ui/CyberFrame";

interface MetricData {
  id: string;
  label: string;
  value: number;
  unit: string;
  icon: React.ElementType;
  color: string;
  min: number;
  max: number;
  warning?: number;
}

const DataReadout = () => {
  const [metrics, setMetrics] = useState<MetricData[]>([
    { id: "ndvi", label: "NDVI Index", value: 0.72, unit: "", icon: TreePine, color: "text-neon-green", min: -1, max: 1 },
    { id: "temp", label: "Surface Temp", value: 34.5, unit: "°C", icon: Thermometer, color: "text-destructive", min: 0, max: 50, warning: 40 },
    { id: "moisture", label: "Soil Moisture", value: 42, unit: "%", icon: Droplets, color: "text-primary", min: 0, max: 100, warning: 20 },
    { id: "aod", label: "Aerosol Depth", value: 0.35, unit: "AOD", icon: Wind, color: "text-secondary", min: 0, max: 2 },
    { id: "drought", label: "Drought Index", value: 2.1, unit: "SPI", icon: Gauge, color: "text-destructive", min: -3, max: 3 },
  ]);

  const [cursorPos, setCursorPos] = useState({ lat: 28.6139, lon: 77.209 });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(m => ({
        ...m,
        value: Math.max(m.min, Math.min(m.max, m.value + (Math.random() - 0.5) * 0.1))
      })));
      setCursorPos(prev => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.01,
        lon: prev.lon + (Math.random() - 0.5) * 0.01,
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const getProgressWidth = (value: number, min: number, max: number) => {
    return ((value - min) / (max - min)) * 100;
  };

  return (
    <CyberFrame title="Spectral Readout" className="w-72" variant="default">
      {/* Cursor Position */}
      <div className="mb-4 pb-3 border-b border-primary/20">
        <div className="text-[10px] text-muted-foreground mb-1">CURSOR POSITION</div>
        <div className="flex items-center gap-4 font-mono text-sm">
          <span className="text-primary">
            {cursorPos.lat.toFixed(4)}°N
          </span>
          <span className="text-secondary">
            {cursorPos.lon.toFixed(4)}°E
          </span>
        </div>
      </div>

      {/* Metrics */}
      <div className="space-y-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const progress = getProgressWidth(metric.value, metric.min, metric.max);
          const isWarning = metric.warning && metric.value >= metric.warning;

          return (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-1"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`w-3 h-3 ${metric.color}`} />
                  <span className="text-[10px] text-muted-foreground uppercase">
                    {metric.label}
                  </span>
                  {isWarning && (
                    <AlertTriangle className="w-3 h-3 text-destructive animate-pulse" />
                  )}
                </div>
                <span className={`font-mono text-sm ${metric.color}`}>
                  {metric.value.toFixed(2)}{metric.unit}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="h-1 bg-muted/30 overflow-hidden">
                <motion.div
                  className={`h-full ${isWarning ? 'bg-destructive' : 'bg-gradient-to-r from-primary to-secondary'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              {/* Scale */}
              <div className="flex justify-between text-[8px] text-muted-foreground">
                <span>{metric.min}</span>
                <span>{metric.max}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-primary/20">
        <div className="text-[10px] text-muted-foreground mb-2">DATA SOURCES</div>
        <div className="flex flex-wrap gap-2">
          <span className="text-[8px] px-1.5 py-0.5 border border-destructive/30 text-destructive">VEDAS</span>
          <span className="text-[8px] px-1.5 py-0.5 border border-secondary/30 text-secondary">BHUVAN</span>
          <span className="text-[8px] px-1.5 py-0.5 border border-neon-green/30 text-neon-green">SENTINEL</span>
        </div>
      </div>
    </CyberFrame>
  );
};

export default DataReadout;
