import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Film, Bookmark, Home, Tv, Download, Play } from 'lucide-react';
import { toast } from 'sonner';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileHeaderOpacity, setMobileHeaderOpacity] = useState(1);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 10);
      setMobileHeaderOpacity(currentScrollY > lastScrollY && currentScrollY > 50 ? 0 : 1);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll);

    // Detect install availability
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    });

    // Hide install if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isStandalone) {
      setShowInstall(false);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        setDeferredPrompt(null);
        setShowInstall(false);
        toast.success('NepoFlix installed!');
      });
    }
  };

  const isActive = (path) => {
    if (path === '/' || path === '/home') {
      return currentPath === '/' || currentPath === '/index.html' || currentPath === '/home';
    }
    return currentPath === path;
  };

  return (
    <>
      {/* Desktop Header */}
      <header className={`fixed top-0 left-0 mx-16 py-3 px-4 pl-8 rounded-b-2xl text-white hidden md:flex items-center justify-between z-50 transition-all duration-200 ${
        isScrolled ? 'bg-zinc-800/60 backdrop-blur-md' : 'bg-transparent'
      }`} style={{ width: 'calc(100% - 8rem)' }}>
        <div className="flex items-center gap-2">
          <Link to="/" className="text-2xl mr-6 hover:text-blue-400 font-instrument">NepoFlix</Link>
          <Link to="/" className={`px-4 py-2 rounded-lg hover:bg-white hover:text-black ${
            isActive('/') ? 'bg-white/20 text-white' : 'text-gray-200'
          }`}>Home</Link>
          <Link to="/movies" className={`px-4 py-2 rounded-lg hover:bg-white hover:text-black ${
            isActive('/movies') ? 'bg-white/20 text-white' : 'text-gray-200'
          }`}>Movies</Link>
          <Link to="/tv" className={`px-4 py-2 rounded-lg hover:bg-white hover:text-black ${
            isActive('/tv') ? 'bg-white/20 text-white' : 'text-gray-200'
          }`}>TV Shows</Link>
          <Link to="/anime" className={`px-4 py-2 rounded-lg hover:bg-white hover:text-black ${
            isActive('/anime') ? 'bg-white/20 text-white' : 'text-gray-200'
          }`}>Anime</Link>
        </div>
        <div className="flex gap-2">
          <Link to="/search" className={`p-2 rounded-full hover:bg-white hover:text-black ${
            isActive('/search') ? 'bg-white/20 text-white' : 'text-gray-200'
          }`}><Search className="w-5 h-5" /></Link>
          <Link to="/watchlist" className={`p-2 rounded-full hover:bg-white hover:text-black ${
            isActive('/watchlist') ? 'bg-white/20 text-white' : 'text-gray-200'
          }`}><Bookmark className="w-5 h-5" /></Link>
        </div>
      </header>

      {/* Mobile Bottom Bar */}
      <div className="fixed bottom-[-1px] left-0 w-full flex justify-around items-center py-4 pb-8 z-50 md:hidden bg-[#232323ab] backdrop-blur-lg transition-opacity duration-300" style={{ opacity: mobileHeaderOpacity }}>
        <Link to="/" className={`flex flex-col items-center ${
          isActive('/') ? 'text-white' : 'text-zinc-400 hover:text-white'
        }`}><Home className="w-6 h-6" /><span className="text-xs mt-1">Home</span></Link>

        <Link to="/movies" className={`flex flex-col items-center ${
          isActive('/movies') ? 'text-white' : 'text-zinc-400 hover:text-white'
        }`}><Film className="w-6 h-6" /><span className="text-xs mt-1">Movies</span></Link>

        <Link to="/tv" className={`flex flex-col items-center ${
          isActive('/tv') ? 'text-white' : 'text-zinc-400 hover:text-white'
        }`}><Tv className="w-6 h-6" /><span className="text-xs mt-1">TV</span></Link>

        <Link to="/anime" className={`flex flex-col items-center ${
          isActive('/anime') ? 'text-white' : 'text-zinc-400 hover:text-white'
        }`}><Play className="w-6 h-6" /><span className="text-xs mt-1">Anime</span></Link>

        <Link to="/search" className={`flex flex-col items-center ${
          isActive('/search') ? 'text-white' : 'text-zinc-400 hover:text-white'
        }`}><Search className="w-6 h-6" /><span className="text-xs mt-1">Search</span></Link>

        <Link to="/watchlist" className={`flex flex-col items-center ${
          isActive('/watchlist') ? 'text-white' : 'text-zinc-400 hover:text-white'
        }`}><Bookmark className="w-6 h-6" /><span className="text-xs mt-1">Watchlist</span></Link>

        {showInstall && (
          <button onClick={handleInstallClick} className="flex flex-col items-center text-zinc-400 hover:text-white">
            <Download className="w-6 h-6" />
            <span className="text-xs mt-1">Install</span>
          </button>
        )}
      </div>
    </>
  );
};

export default Header;
