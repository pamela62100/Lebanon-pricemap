import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { cn } from '@/lib/utils';

// Fix for default marker icons in Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapComponentProps {
  center: [number, number];
  zoom: number;
  markers?: { position: [number, number]; label: string; price?: string; category?: string }[];
  className?: string;
}

export function MapComponent({ center, zoom, markers, className }: MapComponentProps) {
  const MapComp = MapContainer as any;
  const TileLayerComp = TileLayer as any;
  const ZoomControlComp = ZoomControl as any;
  const MarkerComp = Marker as any;
  const PopupComp = Popup as any;

  return (
    <div className={cn("w-full h-full relative overflow-hidden", className)}>
      <MapComp 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={true}
        zoomControl={false}
        className="w-full h-full"
      >
        <TileLayerComp
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        
        <ZoomControlComp position="bottomright" />

        {markers?.map((m, i) => (
          <MarkerComp key={i} position={m.position}>
            <PopupComp>
              <div className="p-1">
                <p className="font-bold text-sm">{m.label}</p>
                {m.price && <p className="text-primary font-bold">{m.price} LBP</p>}
              </div>
            </PopupComp>
          </MarkerComp>
        ))}
      </MapComp>
    </div>
  );
}
