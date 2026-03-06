function HowItWorksSection() {
    return (
        <section className="how-section">
            <div className="section-header">
                <h2>How It Works</h2>
                <p>
                    Quickly find fair prices, compare nearby options, and help keep
                    information updated across Lebanon.
                </p>
            </div>

            <div className="how-grid">
                <div className="how-card">
                    <div className="how-step">1</div>
                    <h3>Search or Explore</h3>
                    <p>
                        Search for a product or browse the live map to find nearby
                        shops and available essentials.
                    </p>
                </div>

                <div className="how-card">
                    <div className="how-step">2</div>
                    <h3>Compare Prices</h3>
                    <p>
                        View prices, stock availability, and nearby locations to
                        decide where to go before leaving home.
                    </p>
                </div>

                <div className="how-card">
                    <div className="how-step">3</div>
                    <h3>Submit Updates</h3>
                    <p>
                        Share new prices with proof, improve accuracy, and help the
                        community make smarter buying decisions.
                    </p>
                </div>
            </div>
        </section>
    );
}

export default HowItWorksSection;