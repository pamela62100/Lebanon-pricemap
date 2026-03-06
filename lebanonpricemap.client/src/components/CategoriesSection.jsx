function CategoriesSection() {
    return (
        <section className="categories-section">
            <div className="section-header">
                <h2>Track Multiple Categories</h2>
                <p>
                    From daily essentials to specialized items, we&apos;ve got you
                    covered.
                </p>
            </div>

            <div className="categories-grid">
                <div className="category-card">
                    <div className="category-icon">🛒</div>
                    <h3>Groceries</h3>
                    <p>Food & Supplies</p>
                </div>

                <div className="category-card">
                    <div className="category-icon">⛽</div>
                    <h3>Gas Stations</h3>
                    <p>Fuel Prices</p>
                </div>

                <div className="category-card">
                    <div className="category-icon">💊</div>
                    <h3>Pharmacies</h3>
                    <p>Medicine & Health</p>
                </div>

                <div className="category-card">
                    <div className="category-icon">🔌</div>
                    <h3>Electronics</h3>
                    <p>Accessories</p>
                </div>
            </div>
        </section>
    );
}

export default CategoriesSection;