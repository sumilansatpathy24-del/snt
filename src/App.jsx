import { useState, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Fleet from './components/Fleet';
import WhyChooseUs from './components/WhyChooseUs';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FloatingWidgets from './components/FloatingWidgets';
import Career from './components/Career';
import Gallery from './components/Gallery';
import AdminDashboard from './components/AdminDashboard';
import { initialWebsiteData } from './utils/initialWebsiteData';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('main'); // 'main', 'career', 'gallery', 'admin'

  const [websiteData, setWebsiteData] = useState(() => {
    const stored = localStorage.getItem('snt_website_data');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Always use latest hero defaults from initialWebsiteData
        const merged = { ...parsed, hero: { ...initialWebsiteData.hero } };
        localStorage.setItem('snt_website_data', JSON.stringify(merged));
        return merged;
      } catch (e) {
        console.error('[LocalStorage Parsing Error]:', e);
      }
    }
    return initialWebsiteData;
  });

  const updateWebsiteData = (newData) => {
    setWebsiteData(newData);
    localStorage.setItem('snt_website_data', JSON.stringify(newData));
  };

  // Set page scroll behavior for smooth anchor navigation
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  // Handle scroll target when returning to main page
  useEffect(() => {
    if (currentPage === 'main') {
      const scrollTarget = sessionStorage.getItem('scrollTarget');
      if (scrollTarget) {
        sessionStorage.removeItem('scrollTarget');
        setTimeout(() => {
          const target = document.getElementById(scrollTarget);
          if (target) {
            window.scrollTo({
              top: target.offsetTop - 80,
              behavior: 'smooth',
            });
          }
        }, 100);
      }
    }
  }, [currentPage]);

  return (
    <div className="relative bg-[#020617] text-slate-100 min-h-screen">
      
      {/* Premium Loader Screen */}
      <LoadingScreen onComplete={() => setLoading(false)} />

      {/* Main website wrappers (hidden during initial loader phase) */}
      {!loading && (
        <div className="flex flex-col min-h-screen">
          {/* Header Bar */}
          <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} websiteData={websiteData} />

          <main className="flex-grow">
            {currentPage === 'main' && (
              <>
                <Hero websiteData={websiteData} />
                <About websiteData={websiteData} />
                <Services websiteData={websiteData} />
                <Fleet websiteData={websiteData} />
                <WhyChooseUs />
                <Contact websiteData={websiteData} />
              </>
            )}
            {currentPage === 'career' && <Career />}
            {currentPage === 'gallery' && <Gallery />}
            {currentPage === 'admin' && (
              <AdminDashboard 
                setCurrentPage={setCurrentPage} 
                websiteData={websiteData} 
                updateWebsiteData={updateWebsiteData} 
              />
            )}
          </main>

          {/* Footer Bar */}
          <Footer currentPage={currentPage} setCurrentPage={setCurrentPage} websiteData={websiteData} />

          {/* Floating Actions Stack */}
          <FloatingWidgets websiteData={websiteData} />
        </div>
      )}
    </div>
  );
}
