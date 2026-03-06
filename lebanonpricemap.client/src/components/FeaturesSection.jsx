function FeaturesSection() {
    return (
        <section className="features-section">
            <div className="section-header">
                <h2>Why Choose PriceMap?</h2>
                <p>
                    Built by the community, for the community. Transparent pricing
                    information at your fingertips.
                </p>
            </div>

            <div className="features-grid">
                <div className="feature-card">
                    <div className="feature-icon blue">📈</div>
                    <h3>Real-Time Prices</h3>
                    <p>
                        Track live price changes across all shops and regions. Get instant
                        updates when prices drop.
                    </p>
                </div>

                <div className="feature-card">
                    <div className="feature-icon green">📷</div>
                    <h3>Photo Verification</h3>
                    <p>
                        Every price submission requires photo proof. Build trust through
                        verified community contributions.
                    </p>
                </div>

                <div className="feature-card">
                    <div className="feature-icon blue">🛡️</div>
                    <h3>Reputation System</h3>
                    <p>
                        Earn points for accurate submissions. Higher reputation means more
                        trusted information.
                    </p>
                </div>

                <div className="feature-card">
                    <div className="feature-icon green">📍</div>
                    <h3>Interactive Map</h3>
                    <p>
                        Visualize prices geographically. Find the best deals near you with
                        our interactive map.
                    </p>
                </div>

                <div className="feature-card">
                    <div className="feature-icon blue">👥</div>
                    <h3>Shop Profiles</h3>
                    <p>
                        Shop owners can claim profiles, update prices, and engage directly
                        with customers.
                    </p>
                </div>

                <div className="feature-card">
                    <div className="feature-icon green">⭐</div>
                    <h3>Community Ratings</h3>
                    <p>
                        Rate shops based on pricing, availability, and service. Help others
                        make informed decisions.
                    </p>
                </div>
            </div>
        </section>
    );
}

export default FeaturesSection;