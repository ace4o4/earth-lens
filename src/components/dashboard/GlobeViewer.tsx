import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Maximize2, Minimize2, RotateCcw, ZoomIn, ZoomOut, Compass, Satellite, MapPin } from "lucide-react";
import { useSatelliteTracking, TrackedSatellite } from "@/hooks/useSatelliteTracking";

interface GlobeViewerProps {
  aoiPolygons?: Array<{
    id: string;
    points: { lat: number; lon: number }[];
    color: string;
    name: string;
  }>;
  onLocationClick?: (lat: number, lon: number) => void;
}

const GlobeViewer = ({ aoiPolygons = [], onLocationClick }: GlobeViewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [viewState, setViewState] = useState({
    zoom: 3,
    lat: 20.5937,
    lon: 78.9629,
  });
  const [hoveredSatellite, setHoveredSatellite] = useState<string | null>(null);

  const { satellites } = useSatelliteTracking(viewState.lat, viewState.lon);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.3) % 360);
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

  // Convert lat/lon to globe position (simplified projection)
  const latLonToPosition = (lat: number, lon: number, radius: number = 250) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + rotation) * (Math.PI / 180);
    
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    
    // Only show if on front side of globe
    const visible = z > -50;
    
    return { x: 250 + x * 0.8, y: 250 - y * 0.8, visible, z };
  };

  // Demo AOIs for visualization
  const demoAOIs = [
    {
      id: 'delhi',
      center: { lat: 28.6, lon: 77.2 },
      color: '#00f3ff',
      name: 'Delhi NCR'
    },
    {
      id: 'mumbai', 
      center: { lat: 19.0, lon: 72.9 },
      color: '#bc13fe',
      name: 'Mumbai'
    }
  ];

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
        <motion.div
          className="relative"
          style={{ perspective: "1000px" }}
        >
          {/* Outer Glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl scale-150" />
          
          {/* Globe SVG */}
          <svg width="500" height="500" className="relative">
            <defs>
              {/* Globe gradient */}
              <radialGradient id="globeGradient" cx="30%" cy="30%">
                <stop offset="0%" stopColor="hsl(var(--primary) / 0.15)" />
                <stop offset="50%" stopColor="hsl(240 15% 8%)" />
                <stop offset="100%" stopColor="hsl(240 10% 3%)" />
              </radialGradient>
              
              {/* Glow filter */}
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>

              {/* Satellite glow */}
              <filter id="satGlow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Globe base */}
            <circle
              cx="250"
              cy="250"
              r="200"
              fill="url(#globeGradient)"
              stroke="hsl(var(--primary) / 0.3)"
              strokeWidth="1"
            />

            {/* Latitude lines */}
            {[-60, -30, 0, 30, 60].map(lat => {
              const y = 250 - (lat / 90) * 180;
              const width = Math.cos(lat * Math.PI / 180) * 200;
              return (
                <ellipse
                  key={`lat-${lat}`}
                  cx="250"
                  cy={y}
                  rx={width}
                  ry={width * 0.2}
                  fill="none"
                  stroke="hsl(var(--primary) / 0.1)"
                  strokeWidth="0.5"
                />
              );
            })}

            {/* Longitude lines */}
            {[0, 30, 60, 90, 120, 150].map(lon => (
              <ellipse
                key={`lon-${lon}`}
                cx="250"
                cy="250"
                rx={Math.abs(Math.cos((lon + rotation) * Math.PI / 180)) * 200}
                ry="180"
                fill="none"
                stroke="hsl(var(--primary) / 0.1)"
                strokeWidth="0.5"
                transform={`rotate(${0} 250 250)`}
              />
            ))}

            {/* India region highlight */}
            <motion.ellipse
              cx={250 + Math.cos((78 + rotation) * Math.PI / 180) * 120}
              cy={250 - (20 / 90) * 150}
              rx="40"
              ry="50"
              fill="hsl(var(--primary) / 0.2)"
              stroke="hsl(var(--primary) / 0.5)"
              strokeWidth="1"
              filter="url(#glow)"
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* AOI Markers */}
            {demoAOIs.map(aoi => {
              const pos = latLonToPosition(aoi.center.lat, aoi.center.lon);
              if (!pos.visible) return null;
              
              return (
                <g key={aoi.id}>
                  <motion.circle
                    cx={pos.x}
                    cy={pos.y}
                    r="8"
                    fill={`${aoi.color}33`}
                    stroke={aoi.color}
                    strokeWidth="1.5"
                    filter="url(#glow)"
                    animate={{ 
                      r: [8, 12, 8],
                      opacity: [0.8, 1, 0.8]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <text
                    x={pos.x}
                    y={pos.y + 20}
                    textAnchor="middle"
                    fill={aoi.color}
                    fontSize="8"
                    fontFamily="Share Tech Mono"
                  >
                    {aoi.name}
                  </text>
                </g>
              );
            })}

            {/* Real Satellite Positions */}
            {satellites.map(sat => {
              if (!sat.position) return null;
              const pos = latLonToPosition(sat.position.lat, sat.position.lon, 280);
              if (!pos.visible) return null;

              const isHovered = hoveredSatellite === sat.id;
              const isPassing = sat.status === 'passing';
              const satColor = isPassing ? '#00ff00' : sat.providerColor.includes('destructive') ? '#ffae00' : '#00f3ff';

              return (
                <g 
                  key={sat.id}
                  onMouseEnter={() => setHoveredSatellite(sat.id)}
                  onMouseLeave={() => setHoveredSatellite(null)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Ground track line (simplified) */}
                  {sat.groundTrack.slice(0, 30).map((point, i) => {
                    const trackPos = latLonToPosition(point.lat, point.lon, 200);
                    if (!trackPos.visible || i % 3 !== 0) return null;
                    return (
                      <circle
                        key={`track-${sat.id}-${i}`}
                        cx={trackPos.x}
                        cy={trackPos.y}
                        r="1"
                        fill={satColor}
                        opacity={0.3}
                      />
                    );
                  })}

                  {/* Satellite swath cone */}
                  <line
                    x1={pos.x}
                    y1={pos.y}
                    x2={latLonToPosition(sat.position.lat, sat.position.lon, 200).x}
                    y2={latLonToPosition(sat.position.lat, sat.position.lon, 200).y}
                    stroke={satColor}
                    strokeWidth="1"
                    opacity="0.3"
                    strokeDasharray="3,3"
                  />

                  {/* Satellite marker */}
                  <motion.circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isHovered ? 6 : 4}
                    fill={satColor}
                    filter="url(#satGlow)"
                    animate={isPassing ? { 
                      scale: [1, 1.3, 1],
                      opacity: [0.8, 1, 0.8]
                    } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                  />

                  {/* Satellite label on hover */}
                  {isHovered && (
                    <g>
                      <rect
                        x={pos.x + 10}
                        y={pos.y - 25}
                        width="90"
                        height="35"
                        fill="hsl(240 15% 5% / 0.9)"
                        stroke={satColor}
                        strokeWidth="1"
                      />
                      <text x={pos.x + 15} y={pos.y - 12} fill={satColor} fontSize="8" fontFamily="Orbitron">
                        {sat.name}
                      </text>
                      <text x={pos.x + 15} y={pos.y - 2} fill="hsl(var(--muted-foreground))" fontSize="7" fontFamily="Share Tech Mono">
                        ALT: {sat.position.alt.toFixed(0)} km
                      </text>
                      <text x={pos.x + 15} y={pos.y + 6} fill="hsl(var(--muted-foreground))" fontSize="7" fontFamily="Share Tech Mono">
                        {sat.status.toUpperCase()}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Orbit rings */}
            <motion.ellipse
              cx="250"
              cy="250"
              rx="230"
              ry="60"
              fill="none"
              stroke="hsl(var(--neon-green) / 0.2)"
              strokeWidth="1"
              strokeDasharray="5,5"
              transform="rotate(-15 250 250)"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: '250px 250px' }}
            />

            <motion.ellipse
              cx="250"
              cy="250"
              rx="220"
              ry="180"
              fill="none"
              stroke="hsl(var(--destructive) / 0.15)"
              strokeWidth="1"
              strokeDasharray="3,7"
              transform="rotate(30 250 250)"
              animate={{ rotate: [360, 0] }}
              transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: '250px 250px' }}
            />
          </svg>
        </motion.div>
      </div>

      {/* Satellite Count Overlay */}
      <div className="absolute top-4 right-20 glassmorphism px-3 py-2">
        <div className="flex items-center gap-2">
          <Satellite className="w-4 h-4 text-neon-green" />
          <span className="text-xs text-muted-foreground">TRACKING</span>
          <span className="font-mono text-sm text-neon-green">
            {satellites.length}
          </span>
        </div>
        <div className="text-[10px] text-muted-foreground mt-1">
          {satellites.filter(s => s.status === 'passing').length} overhead
        </div>
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

      {/* Legend */}
      <div className="absolute bottom-20 left-4 glassmorphism px-3 py-2">
        <div className="text-[8px] text-muted-foreground mb-2 uppercase">Legend</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-neon-green" />
            <span className="text-[10px] text-muted-foreground">ESA Satellites</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-destructive" />
            <span className="text-[10px] text-muted-foreground">ISRO Satellites</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] text-muted-foreground">AOI Region</span>
          </div>
        </div>
      </div>

      {/* Attribution */}
      <div className="absolute bottom-4 right-4 text-[8px] text-muted-foreground/50">
        TLE Data: CelesTrak | © ISRO VEDAS | Bhuvan | Copernicus
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
