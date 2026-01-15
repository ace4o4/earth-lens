import * as satellite from 'satellite.js';

export interface SatellitePosition {
  lat: number;
  lon: number;
  alt: number;
  velocity: number;
}

export interface TLEData {
  name: string;
  line1: string;
  line2: string;
  noradId: string;
}

// Real TLE data for Indian and ESA satellites (updated periodically from CelesTrak)
// These are example TLEs - in production, fetch from CelesTrak API
export const SATELLITE_TLES: Record<string, TLEData> = {
  'RESOURCESAT-2': {
    name: 'RESOURCESAT-2',
    line1: '1 37387U 11015A   24015.50000000  .00000100  00000-0  10000-3 0  9999',
    line2: '2 37387  98.7500  80.0000 0001000  90.0000 270.0000 14.21500000100000',
    noradId: '37387'
  },
  'SENTINEL-2A': {
    name: 'SENTINEL-2A',
    line1: '1 40697U 15028A   24015.50000000  .00000050  00000-0  50000-4 0  9999',
    line2: '2 40697  98.5680 100.5000 0001200  85.0000 275.0000 14.30820000100000',
    noradId: '40697'
  },
  'CARTOSAT-3': {
    name: 'CARTOSAT-3',
    line1: '1 44804U 19089A   24015.50000000  .00000150  00000-0  15000-3 0  9999',
    line2: '2 44804  97.5000  60.0000 0001500  95.0000 265.0000 15.19000000100000',
    noradId: '44804'
  },
  'OCEANSAT-3': {
    name: 'OCEANSAT-3',
    line1: '1 54358U 22137A   24015.50000000  .00000080  00000-0  80000-4 0  9999',
    line2: '2 54358  98.3000  90.0000 0001100  88.0000 272.0000 14.25000000100000',
    noradId: '54358'
  },
  'RISAT-2BR1': {
    name: 'RISAT-2BR1',
    line1: '1 44857U 19089F   24015.50000000  .00000200  00000-0  20000-3 0  9999',
    line2: '2 44857  37.0000  45.0000 0010000 100.0000 260.0000 15.08000000100000',
    noradId: '44857'
  },
  'SENTINEL-1A': {
    name: 'SENTINEL-1A',
    line1: '1 39634U 14016A   24015.50000000  .00000040  00000-0  40000-4 0  9999',
    line2: '2 39634  98.1820  95.0000 0001300  82.0000 278.0000 14.59200000100000',
    noradId: '39634'
  }
};

export function getSatellitePosition(tle: TLEData, date: Date = new Date()): SatellitePosition | null {
  try {
    const satrec = satellite.twoline2satrec(tle.line1, tle.line2);
    const positionAndVelocity = satellite.propagate(satrec, date);
    
    if (typeof positionAndVelocity.position === 'boolean') {
      return null;
    }

    const positionEci = positionAndVelocity.position as satellite.EciVec3<number>;
    const velocityEci = positionAndVelocity.velocity as satellite.EciVec3<number>;
    
    const gmst = satellite.gstime(date);
    const positionGd = satellite.eciToGeodetic(positionEci, gmst);
    
    const lon = satellite.degreesLong(positionGd.longitude);
    const lat = satellite.degreesLat(positionGd.latitude);
    const alt = positionGd.height;
    
    const velocity = Math.sqrt(
      velocityEci.x ** 2 + velocityEci.y ** 2 + velocityEci.z ** 2
    );

    return { lat, lon, alt, velocity };
  } catch (error) {
    console.error('Error calculating satellite position:', error);
    return null;
  }
}

export function getGroundTrack(tle: TLEData, minutes: number = 90, stepMinutes: number = 1): SatellitePosition[] {
  const positions: SatellitePosition[] = [];
  const now = new Date();
  
  for (let i = -minutes / 2; i <= minutes / 2; i += stepMinutes) {
    const time = new Date(now.getTime() + i * 60 * 1000);
    const pos = getSatellitePosition(tle, time);
    if (pos) {
      positions.push(pos);
    }
  }
  
  return positions;
}

export function predictNextPass(
  tle: TLEData, 
  observerLat: number, 
  observerLon: number, 
  minElevation: number = 10
): { time: Date; maxElevation: number } | null {
  const now = new Date();
  const maxLookAhead = 24 * 60; // 24 hours in minutes
  
  let inPass = false;
  let passStart: Date | null = null;
  let maxElevation = 0;
  
  for (let i = 0; i < maxLookAhead; i++) {
    const time = new Date(now.getTime() + i * 60 * 1000);
    const pos = getSatellitePosition(tle, time);
    
    if (!pos) continue;
    
    // Calculate elevation angle
    const elevation = calculateElevation(
      observerLat, observerLon, 0,
      pos.lat, pos.lon, pos.alt
    );
    
    if (elevation > minElevation) {
      if (!inPass) {
        inPass = true;
        passStart = time;
        maxElevation = elevation;
      } else {
        maxElevation = Math.max(maxElevation, elevation);
      }
    } else if (inPass && passStart) {
      return { time: passStart, maxElevation };
    }
  }
  
  return null;
}

function calculateElevation(
  obsLat: number, obsLon: number, obsAlt: number,
  satLat: number, satLon: number, satAlt: number
): number {
  const R = 6371; // Earth radius in km
  
  const obsLatRad = obsLat * Math.PI / 180;
  const obsLonRad = obsLon * Math.PI / 180;
  const satLatRad = satLat * Math.PI / 180;
  const satLonRad = satLon * Math.PI / 180;
  
  const dLon = satLonRad - obsLonRad;
  
  const distance = Math.acos(
    Math.sin(obsLatRad) * Math.sin(satLatRad) +
    Math.cos(obsLatRad) * Math.cos(satLatRad) * Math.cos(dLon)
  ) * R;
  
  const height = satAlt - obsAlt;
  const elevation = Math.atan2(height, distance) * 180 / Math.PI;
  
  return Math.max(0, elevation);
}

export function isOverLocation(
  satLat: number, satLon: number,
  targetLat: number, targetLon: number,
  swathWidth: number = 200 // km
): boolean {
  const R = 6371;
  const lat1 = satLat * Math.PI / 180;
  const lat2 = targetLat * Math.PI / 180;
  const dLat = (targetLat - satLat) * Math.PI / 180;
  const dLon = (targetLon - satLon) * Math.PI / 180;
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return distance < swathWidth / 2;
}
