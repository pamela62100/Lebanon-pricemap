import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { cn } from '@/lib/utils';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Default Leaflet marker
const DefaultIcon = L.icon({
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
    isBestPrice?: boolean;
    storeName?: string;
  }[];
  className?: string;
}

// Custom icons
const BestPriceIcon = L.divIcon({
  html: `<div class="relative text-[16px]"><span class="material-symbols-outlined text-[#B38B3F]">location_on</span><span class="absolute -top-4 text-[10px] font-bold">👑</span></div>`,
  className: 'custom-div-icon',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});
const StandardIcon = L.divIcon({
  html: `<div class="w-3 h-3 rounded-full bg-text-muted/40 border-2 border-white"></div>`,
  className: 'custom-div-icon-dot',
  iconSize: [12, 12],
  iconAnchor: [6, 6],
  popupAnchor: [0, -6],
});

export function MapComponent({ center, zoom, markers, className }: MapComponentProps) {
  return (
    <div className={cn('w-full h-full relative overflow-hidden rounded-lg', className)}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom
        zoomControl={false}
        className="w-full h-full rounded-lg"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors &copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <ZoomControl position="bottomright" />
        {markers?.map((m, i) => (
          <Marker
            key={i}
            position={m.position}
            icon={m.isBestPrice ? BestPriceIcon : StandardIcon}
            zIndexOffset={m.isBestPrice ? 1000 : 0}
          >
            <Popup className="text-sm">
              <div className="flex flex-col gap-0.5">
                {m.storeName && <p className="font-semibold">{m.storeName}</p>}
                <p className={m.isBestPrice ? 'text-primary italic font-bold' : ''}>{m.label}</p>
                {m.price && <p className="font-medium">{m.price} LBP</p>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}