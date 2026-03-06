import './App.css';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import HowItWorksSection from './components/HowItWorksSection';
import CategoriesSection from './components/CategoriesSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
function App() {
    return (
        <div className="landing-page">
            <Navbar />
            <HeroSection />
            <FeaturesSection />
            <HowItWorksSection/>
            <CategoriesSection />
            <CTASection />
            <Footer />
        </div>
    );
}

export default App;