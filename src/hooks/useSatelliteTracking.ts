import { useState, useEffect, useCallback } from 'react';
import { 
  SATELLITE_TLES, 
  getSatellitePosition, 
  getGroundTrack,
  predictNextPass,
  isOverLocation,
  type SatellitePosition,
  type TLEData
} from '@/lib/satelliteUtils';

export interface TrackedSatellite {
  id: string;
  name: string;
  noradId: string;
  position: SatellitePosition | null;
  groundTrack: SatellitePosition[];
  status: 'active' | 'passing' | 'horizon';
  nextPass: string;
  provider: string;
  providerColor: string;
  tle: TLEData;
}

const SATELLITE_CONFIG: Record<string, { provider: string; providerColor: string }> = {
  'RESOURCESAT-2': { provider: 'ISRO', providerColor: 'text-destructive' },
  'SENTINEL-2A': { provider: 'ESA', providerColor: 'text-neon-green' },
  'CARTOSAT-3': { provider: 'ISRO', providerColor: 'text-destructive' },
  'OCEANSAT-3': { provider: 'ISRO', providerColor: 'text-destructive' },
  'RISAT-2BR1': { provider: 'ISRO', providerColor: 'text-destructive' },
  'SENTINEL-1A': { provider: 'ESA', providerColor: 'text-neon-green' },
};

export function useSatelliteTracking(observerLat: number = 28.6139, observerLon: number = 77.209) {
  const [satellites, setSatellites] = useState<TrackedSatellite[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const updatePositions = useCallback(() => {
    const now = new Date();
    const updated: TrackedSatellite[] = [];

    Object.entries(SATELLITE_TLES).forEach(([name, tle]) => {
      const position = getSatellitePosition(tle, now);
      const groundTrack = getGroundTrack(tle, 120, 2);
      
      let status: TrackedSatellite['status'] = 'active';
      let nextPassStr = '--:--';

      if (position) {
        // Check if satellite is overhead
        if (isOverLocation(position.lat, position.lon, observerLat, observerLon, 500)) {
          status = 'passing';
          nextPassStr = 'NOW';
        } else {
          // Predict next pass
          const nextPass = predictNextPass(tle, observerLat, observerLon);
          if (nextPass) {
            const diffMs = nextPass.time.getTime() - now.getTime();
            const diffMins = Math.floor(diffMs / 60000);
            
            if (diffMins < 60) {
              nextPassStr = `${diffMins}m`;
              status = 'horizon';
            } else if (diffMins < 1440) {
              const hours = Math.floor(diffMins / 60);
              nextPassStr = `${hours}h ${diffMins % 60}m`;
            } else {
              nextPassStr = nextPass.time.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
              }) + ' UTC';
            }
          }
        }
      }

      const config = SATELLITE_CONFIG[name] || { provider: 'Unknown', providerColor: 'text-muted-foreground' };

      updated.push({
        id: tle.noradId,
        name,
        noradId: tle.noradId,
        position,
        groundTrack,
        status,
        nextPass: nextPassStr,
        provider: config.provider,
        providerColor: config.providerColor,
        tle,
      });
    });

    setSatellites(updated);
    setLastUpdate(now);
  }, [observerLat, observerLon]);

  useEffect(() => {
    // Initial update
    updatePositions();

    // Update every 5 seconds
    const interval = setInterval(updatePositions, 5000);

    return () => clearInterval(interval);
  }, [updatePositions]);

  return { satellites, lastUpdate, refreshPositions: updatePositions };
}
