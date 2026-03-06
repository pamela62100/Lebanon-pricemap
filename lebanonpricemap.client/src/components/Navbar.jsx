import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <header className="navbar">
            <div className="logo">
                <span className="logo-icon">📍</span>
                <span className="logo-text">PriceMap Lebanon</span>
            </div>

            <Link to="/map" className="launch-btn">Open App</Link>
        </header>
    );
}

export default Navbar;