import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { 
  PenTool, 
  Square, 
  Circle, 
  Trash2, 
  Save, 
  X,
  MapPin,
  Crosshair,
  RotateCcw
} from "lucide-react";
import CyberFrame from "../ui/CyberFrame";
import CyberButton from "../ui/CyberButton";

export interface AOIPolygon {
  id: string;
  name: string;
  points: { lat: number; lon: number }[];
  color: string;
  area: number; // in sq km
  createdAt: Date;
}

interface AOIDrawingToolProps {
  onAOICreated?: (aoi: AOIPolygon) => void;
  onAOIDeleted?: (id: string) => void;
  savedAOIs?: AOIPolygon[];
}

const AOIDrawingTool = ({ onAOICreated, onAOIDeleted, savedAOIs = [] }: AOIDrawingToolProps) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingMode, setDrawingMode] = useState<'polygon' | 'rectangle' | 'circle'>('polygon');
  const [currentPoints, setCurrentPoints] = useState<{ lat: number; lon: number }[]>([]);
  const [aoiName, setAoiName] = useState('');
  const [selectedAOI, setSelectedAOI] = useState<string | null>(null);

  // Demo AOIs
  const [localAOIs, setLocalAOIs] = useState<AOIPolygon[]>([
    {
      id: 'demo-1',
      name: 'Delhi NCR Region',
      points: [
        { lat: 28.85, lon: 76.85 },
        { lat: 28.85, lon: 77.35 },
        { lat: 28.35, lon: 77.35 },
        { lat: 28.35, lon: 76.85 },
      ],
      color: '#00f3ff',
      area: 2847,
      createdAt: new Date('2024-01-10'),
    },
    {
      id: 'demo-2',
      name: 'Mumbai Metropolitan',
      points: [
        { lat: 19.25, lon: 72.75 },
        { lat: 19.25, lon: 73.05 },
        { lat: 18.85, lon: 73.05 },
        { lat: 18.85, lon: 72.75 },
      ],
      color: '#bc13fe',
      area: 1458,
      createdAt: new Date('2024-01-12'),
    },
  ]);

  const allAOIs = [...localAOIs, ...savedAOIs];

  const startDrawing = (mode: 'polygon' | 'rectangle' | 'circle') => {
    setDrawingMode(mode);
    setIsDrawing(true);
    setCurrentPoints([]);
    setAoiName('');
  };

  const cancelDrawing = () => {
    setIsDrawing(false);
    setCurrentPoints([]);
    setAoiName('');
  };

  const addPoint = (lat: number, lon: number) => {
    if (isDrawing) {
      setCurrentPoints(prev => [...prev, { lat, lon }]);
    }
  };

  const finishDrawing = () => {
    if (currentPoints.length >= 3 && aoiName.trim()) {
      const newAOI: AOIPolygon = {
        id: `aoi-${Date.now()}`,
        name: aoiName,
        points: currentPoints,
        color: ['#00f3ff', '#bc13fe', '#ffae00', '#00ff00'][Math.floor(Math.random() * 4)],
        area: calculateArea(currentPoints),
        createdAt: new Date(),
      };
      
      setLocalAOIs(prev => [...prev, newAOI]);
      onAOICreated?.(newAOI);
      cancelDrawing();
    }
  };

  const deleteAOI = (id: string) => {
    setLocalAOIs(prev => prev.filter(aoi => aoi.id !== id));
    onAOIDeleted?.(id);
    setSelectedAOI(null);
  };

  const calculateArea = (points: { lat: number; lon: number }[]): number => {
    // Simplified area calculation (Shoelace formula approximation)
    if (points.length < 3) return 0;
    
    let area = 0;
    const n = points.length;
    
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      area += points[i].lon * points[j].lat;
      area -= points[j].lon * points[i].lat;
    }
    
    // Convert to approximate sq km (rough estimate at mid-latitudes)
    return Math.abs(area) * 111 * 111 / 2;
  };

  return (
    <CyberFrame title="AOI Manager" className="w-72" variant="default">
      {/* Drawing Mode Selection */}
      <div className="mb-4">
        <div className="text-[10px] text-muted-foreground mb-2 uppercase">Draw Mode</div>
        <div className="flex gap-2">
          <CyberButton
            variant={drawingMode === 'polygon' && isDrawing ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => startDrawing('polygon')}
            icon={<PenTool className="w-3 h-3" />}
          >
            Polygon
          </CyberButton>
          <CyberButton
            variant={drawingMode === 'rectangle' && isDrawing ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => startDrawing('rectangle')}
            icon={<Square className="w-3 h-3" />}
          >
            Rect
          </CyberButton>
          <CyberButton
            variant={drawingMode === 'circle' && isDrawing ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => startDrawing('circle')}
            icon={<Circle className="w-3 h-3" />}
          >
            Circle
          </CyberButton>
        </div>
      </div>

      {/* Active Drawing Panel */}
      <AnimatePresence>
        {isDrawing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-3 bg-primary/5 border border-primary/20"
          >
            <div className="flex items-center gap-2 mb-3">
              <Crosshair className="w-4 h-4 text-neon-green animate-pulse" />
              <span className="text-xs text-neon-green uppercase">Drawing Active</span>
            </div>

            {/* AOI Name Input */}
            <input
              type="text"
              value={aoiName}
              onChange={(e) => setAoiName(e.target.value)}
              placeholder="AOI Name..."
              className="w-full px-2 py-1.5 bg-muted/30 border border-primary/20 text-sm mb-3
                       placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            />

            {/* Points Counter */}
            <div className="text-[10px] text-muted-foreground mb-3">
              <span className="text-primary">{currentPoints.length}</span> points defined
              {currentPoints.length < 3 && ' (min 3 required)'}
            </div>

            {/* Current Points List */}
            {currentPoints.length > 0 && (
              <div className="max-h-20 overflow-y-auto mb-3 space-y-1">
                {currentPoints.map((point, i) => (
                  <div key={i} className="flex items-center gap-2 text-[10px]">
                    <MapPin className="w-3 h-3 text-primary/50" />
                    <span className="text-muted-foreground">
                      {point.lat.toFixed(4)}°, {point.lon.toFixed(4)}°
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Demo: Add sample point */}
            <CyberButton
              variant="ghost"
              size="sm"
              onClick={() => {
                const baseLat = 28.6 + (Math.random() - 0.5) * 0.5;
                const baseLon = 77.2 + (Math.random() - 0.5) * 0.5;
                addPoint(baseLat, baseLon);
              }}
              className="w-full mb-2"
              icon={<MapPin className="w-3 h-3" />}
            >
              Add Point (Demo)
            </CyberButton>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <CyberButton
                variant="primary"
                size="sm"
                onClick={finishDrawing}
                disabled={currentPoints.length < 3 || !aoiName.trim()}
                icon={<Save className="w-3 h-3" />}
                className="flex-1"
              >
                Save
              </CyberButton>
              <CyberButton
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPoints([])}
                icon={<RotateCcw className="w-3 h-3" />}
              >
                Clear
              </CyberButton>
              <CyberButton
                variant="danger"
                size="sm"
                onClick={cancelDrawing}
                icon={<X className="w-3 h-3" />}
              >
                Cancel
              </CyberButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Saved AOIs */}
      <div>
        <div className="text-[10px] text-muted-foreground mb-2 uppercase flex items-center justify-between">
          <span>Saved Regions ({allAOIs.length})</span>
        </div>

        <div className="space-y-2 max-h-[30vh] overflow-y-auto">
          {allAOIs.map((aoi) => (
            <motion.div
              key={aoi.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`
                p-2 border cursor-pointer transition-all
                ${selectedAOI === aoi.id 
                  ? 'border-primary bg-primary/10' 
                  : 'border-primary/20 hover:border-primary/40 hover:bg-muted/30'}
              `}
              onClick={() => setSelectedAOI(selectedAOI === aoi.id ? null : aoi.id)}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: aoi.color }}
                  />
                  <span className="text-xs font-medium">{aoi.name}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteAOI(aoi.id);
                  }}
                  className="p-1 hover:bg-destructive/20 transition-colors"
                >
                  <Trash2 className="w-3 h-3 text-destructive/70 hover:text-destructive" />
                </button>
              </div>

              {/* AOI Details */}
              <AnimatePresence>
                {selectedAOI === aoi.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 pt-2 border-t border-primary/10"
                  >
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div>
                        <span className="text-muted-foreground">Area</span>
                        <p className="text-primary">{aoi.area.toLocaleString()} km²</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Vertices</span>
                        <p className="text-primary">{aoi.points.length}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Created</span>
                        <p className="text-primary">{aoi.createdAt.toLocaleDateString()}</p>
                      </div>
                    </div>

                    {/* Coordinates */}
                    <div className="mt-2 pt-2 border-t border-primary/10">
                      <span className="text-[8px] text-muted-foreground uppercase">Bounds</span>
                      <div className="text-[10px] text-muted-foreground font-mono mt-1">
                        {Math.min(...aoi.points.map(p => p.lat)).toFixed(2)}° - {Math.max(...aoi.points.map(p => p.lat)).toFixed(2)}°N
                        <br />
                        {Math.min(...aoi.points.map(p => p.lon)).toFixed(2)}° - {Math.max(...aoi.points.map(p => p.lon)).toFixed(2)}°E
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-2">
                      <CyberButton variant="ghost" size="sm" className="flex-1">
                        Zoom To
                      </CyberButton>
                      <CyberButton variant="primary" size="sm" className="flex-1">
                        Analyze
                      </CyberButton>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}

          {allAOIs.length === 0 && (
            <div className="text-center py-4 text-muted-foreground text-xs">
              No AOIs defined. Start drawing to create one.
            </div>
          )}
        </div>
      </div>
    </CyberFrame>
  );
};

export default AOIDrawingTool;
