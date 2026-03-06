function Footer() {
    return (
        <footer className="footer">
            <div className="footer-grid">
                <div className="footer-column">
                    <h3>PriceMap Lebanon</h3>
                    <p>
                        Real-time price and availability tracking to help people across
                        Lebanon find fair prices before leaving home.
                    </p>
                </div>

                <div className="footer-column">
                    <h4>Platform</h4>
                    <ul>
                        <li>Explore Map</li>
                        <li>View Prices</li>
                        <li>Submit Price</li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h4>Categories</h4>
                    <ul>
                        <li>Groceries</li>
                        <li>Gas</li>
                        <li>Pharmacies</li>
                        <li>Electronics</li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© 2026 PriceMap Lebanon. Built for smarter shopping decisions.</p>
            </div>
        </footer>
    );
}

export default Footer;