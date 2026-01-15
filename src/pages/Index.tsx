import { motion } from "framer-motion";
import { useState } from "react";
import TopNavBar from "@/components/dashboard/TopNavBar";
import LayerPanel from "@/components/dashboard/LayerPanel";
import SatelliteTracker from "@/components/dashboard/SatelliteTracker";
import DataReadout from "@/components/dashboard/DataReadout";
import StatusBar from "@/components/dashboard/StatusBar";
import GlobeViewer from "@/components/dashboard/GlobeViewer";
import TimelineSlider from "@/components/dashboard/TimelineSlider";
import MiniMap from "@/components/dashboard/MiniMap";
import AOIDrawingTool from "@/components/dashboard/AOIDrawingTool";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layers, Target, Satellite } from "lucide-react";

const Index = () => {
  const [rightPanelTab, setRightPanelTab] = useState<string>("satellites");

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Hex Pattern Background */}
      <div className="fixed inset-0 hex-pattern pointer-events-none" />
      
      {/* Ambient Glow Effects */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navigation */}
      <TopNavBar />

      {/* Main Content */}
      <main className="pt-14 pb-10 h-screen">
        <div className="h-full flex">
          {/* Left Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-80 p-4 flex flex-col gap-4 overflow-y-auto"
          >
            <LayerPanel />
            <DataReadout />
          </motion.aside>

          {/* Globe Viewer - Center */}
          <div className="flex-1 relative">
            <GlobeViewer />
            
            {/* Floating Mini Map */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="absolute bottom-24 left-4"
            >
              <MiniMap />
            </motion.div>
          </div>

          {/* Right Sidebar with Tabs */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="w-80 p-4 overflow-y-auto"
          >
            <Tabs value={rightPanelTab} onValueChange={setRightPanelTab} className="w-full">
              <TabsList className="w-full glassmorphism p-1 mb-4 h-auto">
                <TabsTrigger 
                  value="satellites" 
                  className="flex-1 py-2 text-xs font-mono data-[state=active]:bg-primary/20 data-[state=active]:text-primary transition-all"
                >
                  <Satellite className="w-3 h-3 mr-1.5" />
                  Satellites
                </TabsTrigger>
                <TabsTrigger 
                  value="aoi"
                  className="flex-1 py-2 text-xs font-mono data-[state=active]:bg-secondary/20 data-[state=active]:text-secondary transition-all"
                >
                  <Target className="w-3 h-3 mr-1.5" />
                  AOI Tools
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="satellites" className="mt-0">
                <SatelliteTracker />
              </TabsContent>
              
              <TabsContent value="aoi" className="mt-0">
                <AOIDrawingTool />
              </TabsContent>
            </Tabs>
          </motion.aside>
        </div>

        {/* Timeline Slider */}
        <TimelineSlider />
      </main>

      {/* Status Bar */}
      <StatusBar />

      {/* Scanline Overlay */}
      <div className="fixed inset-0 pointer-events-none scanline-overlay" />
    </div>
  );
};

export default Index;
