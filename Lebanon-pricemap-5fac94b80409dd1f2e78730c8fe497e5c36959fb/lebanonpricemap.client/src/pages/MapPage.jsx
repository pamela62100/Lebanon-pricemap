import { Link } from 'react-router-dom';
import { MapContainer, TileLayer } from 'react-leaflet';
import './MapPage.css';

function MapPage() {
  return (
    <div className="map-page">
      <aside className="sidebar">
        <div className="sidebar-top">
          <Link to="/" className="back-link" aria-label="Go back to home">
            ←
          </Link>

          <div>
            <h1 className="sidebar-title">WenArkhass</h1>
            <p className="sidebar-subtitle">
              Live prices and product availability across Lebanon
            </p>
          </div>

          <button className="submit-btn">Submit a Price</button>
        </div>
      </aside>

      <main className="map-area">
        <div className="map-pill">Live Map</div>

        <MapContainer
          center={[33.8938, 35.5018]}
          zoom={11}
          scrollWheelZoom={true}
          className="leaflet-map"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>
      </main>
    </div>
  );
}

export default MapPage;