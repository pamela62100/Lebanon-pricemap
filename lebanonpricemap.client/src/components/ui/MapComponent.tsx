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
  markers?: { 
    position: [number, number]; 
    label: string; 
    price?: string; 
    category?: string;
    isBestPrice?: boolean;
    storeName?: string;
  }[];
  className?: string;
}

const BestPriceIcon = L.divIcon({
  html: `<div class="relative flex items-center justify-center">
    <span class="material-symbols-outlined text-[#B38B3F] filter drop-shadow-md" style="font-size: 32px;">location_on</span>
    <span class="absolute -top-4 text-[#B38B3F] filter drop-shadow-sm font-black" style="font-size: 16px;">👑</span>
  </div>`,
  className: 'custom-div-icon',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const StandardIcon = L.divIcon({
  html: `<div class="w-3 h-3 rounded-full bg-text-muted/40 border-2 border-white shadow-sm"></div>`,
  className: 'custom-div-icon-dot',
  iconSize: [12, 12],
  iconAnchor: [6, 6],
  popupAnchor: [0, -6],
});

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
          <MarkerComp 
            key={i} 
            position={m.position} 
            icon={m.isBestPrice ? BestPriceIcon : StandardIcon}
            zIndexOffset={m.isBestPrice ? 1000 : 0}
          >
            <PopupComp className="luxe-popup">
              <div className="p-3 min-w-[140px]">
                {m.storeName && (
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-1">
                    {m.storeName}
                  </p>
                )}
                <p className={cn(
                  "font-serif text-base font-bold text-text-main leading-tight",
                  m.isBestPrice && "text-primary italic"
                )}>
                  {m.label}
                </p>
                {m.price && (
                  <div className="mt-3 pt-3 border-t border-border-primary flex justify-between items-center">
                    <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">Pricing</span>
                    <span className="font-serif text-sm font-black text-text-main">{m.price} <span className="text-[9px] font-sans">LBP</span></span>
                  </div>
                )}
                {m.isBestPrice && (
                  <div className="mt-2 bg-primary/5 border border-primary/20 rounded-md px-2 py-1 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[12px]">verified</span>
                    <span className="text-[9px] font-black text-primary uppercase tracking-widest">Market Leading Price</span>
                  </div>
                )}
              </div>
            </PopupComp>
          </MarkerComp>
        ))}
      </MapComp>
    </div>
  );
}
