import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Maximize2, Minimize2, RotateCcw, ZoomIn, ZoomOut, Compass } from "lucide-react";

// Note: For full CesiumJS integration, you'd import from resium/cesium
// This is a stylized placeholder that demonstrates the UI
// Real implementation would use: import { Viewer, Entity, Globe } from "resium";

const GlobeViewer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [viewState, setViewState] = useState({
    zoom: 3,
    lat: 20.5937,
    lon: 78.9629, // India centered
  });

  // Animated rotation for the globe visualization
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.5) % 360);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleZoomIn = () => {
    setViewState(prev => ({ ...prev, zoom: Math.min(prev.zoom + 1, 18) }));
  };

  const handleZoomOut = () => {
    setViewState(prev => ({ ...prev, zoom: Math.max(prev.zoom - 1, 1) }));
  };

  const handleReset = () => {
    setViewState({ zoom: 3, lat: 20.5937, lon: 78.9629 });
  };

  return (
    <div
      ref={containerRef}
      className={`relative bg-void-black overflow-hidden ${
        isFullscreen ? "fixed inset-0 z-40" : "w-full h-full"
      }`}
    >
      {/* Grid Background */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      
      {/* Simulated Globe Visualization */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Globe Container */}
        <motion.div
          className="relative"
          style={{ perspective: "1000px" }}
        >
          {/* Outer Glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl scale-150" />
          
          {/* Globe */}
          <motion.div
            animate={{ rotateY: rotation }}
            transition={{ duration: 0.1, ease: "linear" }}
            className="relative w-[500px] h-[500px] rounded-full border border-primary/30"
            style={{
              background: `
                radial-gradient(circle at 30% 30%, hsl(var(--primary) / 0.1) 0%, transparent 50%),
                radial-gradient(circle at 70% 70%, hsl(var(--secondary) / 0.1) 0%, transparent 50%),
                linear-gradient(135deg, hsl(240 15% 8%) 0%, hsl(240 10% 3%) 100%)
              `,
              boxShadow: `
                inset 0 0 60px hsl(var(--primary) / 0.1),
                0 0 60px hsl(var(--primary) / 0.2),
                0 0 120px hsl(var(--secondary) / 0.1)
              `,
            }}
          >
            {/* Grid Lines (Latitude/Longitude) */}
            {[...Array(8)].map((_, i) => (
              <div
                key={`lat-${i}`}
                className="absolute left-0 right-0 border-t border-primary/10"
                style={{ top: `${(i + 1) * 11.1}%` }}
              />
            ))}
            {[...Array(12)].map((_, i) => (
              <div
                key={`lon-${i}`}
                className="absolute top-0 bottom-0 border-l border-primary/10"
                style={{
                  left: "50%",
                  transform: `rotateY(${i * 30}deg)`,
                  transformOrigin: "center",
                }}
              />
            ))}

            {/* India Highlight */}
            <motion.div
              className="absolute w-16 h-20 rounded-lg"
              style={{
                left: "55%",
                top: "35%",
                background: "linear-gradient(135deg, hsl(var(--primary) / 0.4) 0%, hsl(var(--secondary) / 0.3) 100%)",
                boxShadow: "0 0 30px hsl(var(--primary) / 0.5)",
              }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Satellite Orbit Ring */}
            <motion.div
              className="absolute inset-[-20px] rounded-full border border-dashed border-neon-green/30"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
              {/* Satellite Marker */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-3 h-3 bg-neon-green rounded-full shadow-[0_0_10px_hsl(var(--neon-green))]" />
              </div>
            </motion.div>

            {/* Second Orbit */}
            <motion.div
              className="absolute inset-[-40px] rounded-full border border-dashed border-destructive/20"
              style={{ transform: "rotateX(60deg)" }}
              animate={{ rotate: -360 }}
              transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-2 h-2 bg-destructive rounded-full shadow-[0_0_8px_hsl(var(--destructive))]" />
              </div>
            </motion.div>

            {/* Data Points */}
            {[
              { x: 60, y: 40, color: "bg-neon-green" },
              { x: 52, y: 45, color: "bg-destructive" },
              { x: 65, y: 35, color: "bg-primary" },
              { x: 58, y: 50, color: "bg-secondary" },
              { x: 45, y: 42, color: "bg-neon-green" },
            ].map((point, i) => (
              <motion.div
                key={i}
                className={`absolute w-2 h-2 ${point.color} rounded-full`}
                style={{ left: `${point.x}%`, top: `${point.y}%` }}
                animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Coordinates Display */}
      <div className="absolute top-4 left-4 glassmorphism px-3 py-2">
        <div className="text-[10px] text-muted-foreground mb-1">VIEW CENTER</div>
        <div className="font-mono text-sm text-primary">
          {viewState.lat.toFixed(4)}°N, {viewState.lon.toFixed(4)}°E
        </div>
        <div className="text-[10px] text-muted-foreground mt-1">
          ZOOM: {viewState.zoom}x
        </div>
      </div>

      {/* Controls */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleZoomIn}
          className="w-10 h-10 glassmorphism flex items-center justify-center hover:bg-primary/20 transition-colors"
        >
          <ZoomIn className="w-4 h-4 text-primary" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleZoomOut}
          className="w-10 h-10 glassmorphism flex items-center justify-center hover:bg-primary/20 transition-colors"
        >
          <ZoomOut className="w-4 h-4 text-primary" />
        </motion.button>
        <div className="w-10 h-px bg-primary/20" />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          className="w-10 h-10 glassmorphism flex items-center justify-center hover:bg-primary/20 transition-colors"
        >
          <RotateCcw className="w-4 h-4 text-primary" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 glassmorphism flex items-center justify-center hover:bg-primary/20 transition-colors"
        >
          <Compass className="w-4 h-4 text-primary" />
        </motion.button>
        <div className="w-10 h-px bg-primary/20" />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="w-10 h-10 glassmorphism flex items-center justify-center hover:bg-primary/20 transition-colors"
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4 text-primary" />
          ) : (
            <Maximize2 className="w-4 h-4 text-primary" />
          )}
        </motion.button>
      </div>

      {/* Attribution */}
      <div className="absolute bottom-4 right-4 text-[8px] text-muted-foreground/50">
        © ISRO VEDAS | Bhuvan | Copernicus | OpenStreetMap
      </div>

      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent"
          animate={{ y: ["-100%", "100vh"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </div>
  );
};

export default GlobeViewer;
