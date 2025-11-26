"use client"

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState, useRef } from 'react';

const userIcon = L.divIcon({
  className: 'user-marker-container',
  html: `<div class="user-marker-dot"></div><div class="user-marker-pulse"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const greenIcon = L.divIcon({
  className: 'pressing-dot bg-green-500',
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

const orangeIcon = L.divIcon({
  className: 'pressing-dot bg-orange-500',
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

const redIcon = L.divIcon({
  className: 'pressing-dot bg-red-500',
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

const getIconByDistance = (distance: number, isHovered: boolean = false) => {
  let icon = distance < 1000 ? greenIcon : distance < 2000 ? orangeIcon : redIcon;
  if (isHovered) {
    return L.divIcon({
      className: `pressing-dot bg-${distance < 1000 ? 'green' : distance < 2000 ? 'orange' : 'red'}-500 hovered`,
      iconSize: [12, 12],
      iconAnchor: [6, 6],
    });
  }
  return icon;
}

interface Pressing {
  id: string;
  name: string;
  coords: { lat: number; lng: number };
  distance: number;
  pricePerKilo: number;
  rating: number;
}

interface MapViewProps {
  pressings: Pressing[];
  hoveredPressingId: string | null;
  triggerRecenter?: number;
}





function UserMarker({ position }: { position: [number, number] }) {
  const map = useMap();
  const markerRef = useRef<L.Marker | null>(null);

    useEffect(() => {
    if (!markerRef.current) {
      markerRef.current = L.marker(position, { icon: userIcon }).addTo(map);
      markerRef.current.bindPopup("Vous êtes ici");
    } else {
      markerRef.current.setLatLng(position);
    }

    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    };
  }, [map]);

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLatLng(position);
    }
  }, [position]);

  return null;
}

function MapEvents({ userPosition, triggerRecenter }: { userPosition: [number, number], triggerRecenter?: number }) {
  const map = useMap();

  useEffect(() => {
    if (userPosition) {
      map.setView(userPosition, map.getZoom());
    }
  }, [userPosition]);

  useEffect(() => {
    if (triggerRecenter !== undefined && triggerRecenter > 0 && userPosition) {
      map.setView(userPosition, 13);
    }
  }, [triggerRecenter, userPosition]);

  return null;
}

export default function MapView({ pressings, hoveredPressingId, triggerRecenter }: MapViewProps) {
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setUserPosition([position.coords.latitude, position.coords.longitude]);
      },
      (error) => console.error('Error getting user location:', error),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <MapContainer 
      center={userPosition || [4.05, 9.7]} 
      zoom={13} 
      scrollWheelZoom={false} 
      zoomControl={false} 
      className="w-full h-full z-0"
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
        url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
      />
      {userPosition && (
        <>
          <UserMarker position={userPosition} />
          <MapEvents userPosition={userPosition} triggerRecenter={triggerRecenter} />
        </>
      )}
      {pressings.map(pressing => {
        // VÉRIFICATION OPTIONNELLE : Si les coordonnées du pressing sont identiques à celles de l'utilisateur, ne pas le rendre
                const epsilon = 0.000001; // Tolerance for float comparison
        if (userPosition && 
            Math.abs(pressing.coords.lat - userPosition[0]) < epsilon && 
            Math.abs(pressing.coords.lng - userPosition[1]) < epsilon) {
          return null;
        }

        const distance = pressing.distance;
        const icon = getIconByDistance(distance, hoveredPressingId === pressing.id);
        return (
          <Marker 
            key={pressing.id} 
            position={[pressing.coords.lat, pressing.coords.lng]} 
            icon={icon}
          >
            <Popup closeButton={false}>
              <div className="w-48">
                <div className="font-bold text-base mb-1">{pressing.name}</div>
                <div className="text-sm text-muted-foreground mb-2">{pressing.distance} km</div>
                <div className="flex items-center justify-between text-xs border-t pt-2">
                  <div className="font-semibold">{pressing.pricePerKilo}F/kg</div>
                  <div className="flex items-center gap-1 font-bold text-yellow-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    {pressing.rating}
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
