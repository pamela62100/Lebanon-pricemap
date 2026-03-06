import { Link } from 'react-router-dom';

function CTASection() {
    return (
        <section className="cta-section">
            <div className="cta-card">
                <h2>Start Finding Better Prices Today</h2>
                <p>
                    Join thousands of Lebanese citizens helping each other find fair
                    prices across the country.
                </p>
                <Link to="/map" className="primary-btn">Open PriceMap</Link>
            </div>
        </section>
    );
}

export default CTASection;