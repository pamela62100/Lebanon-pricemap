import { Link } from 'react-router-dom';

function HeroSection() {
    return (
        <section className="hero-section">
            <div className="badge">Real-time Price Tracking</div>

            <h1 className="hero-title">Find Fair Prices Across Lebanon</h1>

            <p className="hero-description">
                Community-powered platform tracking real-time prices and availability
                for groceries, gas, medicine, and electronics across all regions.
            </p>

            <div className="hero-buttons">
                <Link to="/map" className="primary-btn">Explore Map</Link>
                <Link to="/map" className="secondary-btn">View Prices</Link>
            </div>

            <div className="stats">
                <div className="stat-card">
                    <h2>500+</h2>
                    <p>Shops Tracked</p>
                </div>

                <div className="stat-card">
                    <h2>10K+</h2>
                    <p>Price Updates</p>
                </div>

                <div className="stat-card">
                    <h2>24/7</h2>
                    <p>Live Updates</p>
                </div>
            </div>
        </section>
    );
}

export default HeroSection;