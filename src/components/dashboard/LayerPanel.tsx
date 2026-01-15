import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { 
  Layers, 
  Eye, 
  EyeOff, 
  ChevronDown, 
  ChevronRight,
  Satellite,
  Mountain,
  Droplets,
  TreePine,
  Building,
  AlertTriangle
} from "lucide-react";
import CyberFrame from "../ui/CyberFrame";
import { Slider } from "../ui/slider";

interface Layer {
  id: string;
  name: string;
  source: string;
  visible: boolean;
  opacity: number;
  icon: React.ElementType;
  status: "active" | "loading" | "offline";
}

interface LayerGroup {
  id: string;
  name: string;
  provider: string;
  providerColor: string;
  layers: Layer[];
}

const initialLayerGroups: LayerGroup[] = [
  {
    id: "isro",
    name: "ISRO VEDAS",
    provider: "ISRO",
    providerColor: "text-destructive",
    layers: [
      { id: "ndvi", name: "Vegetation Index (NDVI)", source: "VEDAS", visible: true, opacity: 80, icon: TreePine, status: "active" },
      { id: "soil-moisture", name: "Soil Moisture", source: "VEDAS", visible: false, opacity: 100, icon: Droplets, status: "active" },
      { id: "drought", name: "Drought Monitoring", source: "VEDAS", visible: false, opacity: 100, icon: AlertTriangle, status: "loading" },
    ],
  },
  {
    id: "bhuvan",
    name: "Bhuvan",
    provider: "BHUVAN",
    providerColor: "text-secondary",
    layers: [
      { id: "lulc", name: "Land Use Land Cover", source: "Bhuvan", visible: true, opacity: 60, icon: Mountain, status: "active" },
      { id: "urban", name: "Urban Infrastructure", source: "Bhuvan", visible: false, opacity: 100, icon: Building, status: "active" },
    ],
  },
  {
    id: "sentinel",
    name: "Sentinel Hub",
    provider: "ESA",
    providerColor: "text-neon-green",
    layers: [
      { id: "sentinel-2", name: "Sentinel-2 True Color", source: "Copernicus", visible: true, opacity: 100, icon: Satellite, status: "active" },
      { id: "sar", name: "SAR Imagery", source: "Copernicus", visible: false, opacity: 100, icon: Satellite, status: "offline" },
    ],
  },
];

interface LayerPanelProps {
  onLayerChange?: (layers: LayerGroup[]) => void;
}

const LayerPanel = ({ onLayerChange }: LayerPanelProps) => {
  const [layerGroups, setLayerGroups] = useState<LayerGroup[]>(initialLayerGroups);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["isro", "bhuvan", "sentinel"]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const toggleLayerVisibility = (groupId: string, layerId: string) => {
    setLayerGroups(prev =>
      prev.map(group =>
        group.id === groupId
          ? {
              ...group,
              layers: group.layers.map(layer =>
                layer.id === layerId
                  ? { ...layer, visible: !layer.visible }
                  : layer
              ),
            }
          : group
      )
    );
  };

  const updateLayerOpacity = (groupId: string, layerId: string, opacity: number) => {
    setLayerGroups(prev =>
      prev.map(group =>
        group.id === groupId
          ? {
              ...group,
              layers: group.layers.map(layer =>
                layer.id === layerId
                  ? { ...layer, opacity }
                  : layer
              ),
            }
          : group
      )
    );
  };

  const getStatusIndicator = (status: Layer["status"]) => {
    switch (status) {
      case "active":
        return <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />;
      case "loading":
        return <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />;
      case "offline":
        return <div className="w-2 h-2 rounded-full bg-muted-foreground" />;
    }
  };

  return (
    <CyberFrame title="Layer Control" className="w-80" variant="default">
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        {layerGroups.map((group, groupIndex) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: groupIndex * 0.1 }}
          >
            {/* Group Header */}
            <button
              onClick={() => toggleGroup(group.id)}
              className="w-full flex items-center justify-between p-2 bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                <span className="text-sm font-orbitron">{group.name}</span>
                <span className={`text-xs px-1.5 py-0.5 border border-current/30 ${group.providerColor}`}>
                  {group.provider}
                </span>
              </div>
              {expandedGroups.includes(group.id) ? (
                <ChevronDown className="w-4 h-4 text-primary/50" />
              ) : (
                <ChevronRight className="w-4 h-4 text-primary/50" />
              )}
            </button>

            {/* Group Layers */}
            <AnimatePresence>
              {expandedGroups.includes(group.id) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="pl-4 py-2 space-y-3 border-l border-primary/20">
                    {group.layers.map((layer) => (
                      <div key={layer.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getStatusIndicator(layer.status)}
                            <layer.icon className="w-4 h-4 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {layer.name}
                            </span>
                          </div>
                          <button
                            onClick={() => toggleLayerVisibility(group.id, layer.id)}
                            className="p-1 hover:bg-primary/10 transition-colors"
                          >
                            {layer.visible ? (
                              <Eye className="w-4 h-4 text-primary" />
                            ) : (
                              <EyeOff className="w-4 h-4 text-muted-foreground" />
                            )}
                          </button>
                        </div>

                        {/* Opacity Slider */}
                        {layer.visible && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex items-center gap-2 pl-6"
                          >
                            <span className="text-[10px] text-muted-foreground w-16">
                              Opacity
                            </span>
                            <Slider
                              value={[layer.opacity]}
                              onValueChange={(value) => updateLayerOpacity(group.id, layer.id, value[0])}
                              max={100}
                              step={1}
                              className="flex-1"
                            />
                            <span className="text-[10px] text-primary w-8">
                              {layer.opacity}%
                            </span>
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </CyberFrame>
  );
};

export default LayerPanel;
