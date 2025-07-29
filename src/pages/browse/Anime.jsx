import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Header from '../../components/Header.jsx';
import { SpotlightSkeleton, MediaCardSkeleton, CategorySkeleton } from '../../components/Skeletons.jsx';
import { fetchTmdbAnime, getTmdbImage, formatReleaseDate, isInWatchlist, toggleWatchlist } from '../../utils.jsx';

const animeCategories = [
  {
    title: 'Latest Anime',
    url: 'latest',
    detailUrl: 'latest'
  },
  {
    title: 'Popular Anime',
    url: 'popular',
    detailUrl: 'popular'
  },
  {
    title: 'Top Rated Anime',
    url: 'top_rated',
    detailUrl: 'top_rated'
  },
  {
    title: 'Airing This Week',
    url: 'airing_this_week',
    detailUrl: 'airing_this_week'
  },
  {
    title: 'Upcoming Anime',
    url: 'upcoming',
    detailUrl: 'upcoming'
  }
];

const SpotlightSection = ({ item, isLoading }) => {
  const [inWatchlist, setInWatchlist] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (item && item.id) { setInWatchlist(isInWatchlist(item.id)); }
  }, [item]);
  
  if (isLoading || !item) {
    return <SpotlightSkeleton />;
  }
  
  const backgroundImage = getTmdbImage(item.backdrop_path) || getTmdbImage(item.poster_path);
  const logoImage = item.images?.logos?.find(logo => logo.iso_639_1 === 'en')?.file_path;
  const mediaType = 'tv'; // Anime are TV shows
  
  const handleWatchlistToggle = (e) => {
    e.stopPropagation();
    const isAdded = toggleWatchlist(item);
    setInWatchlist(isAdded);
  };
  
  const handleWatchClick = () => { navigate(`/${mediaType}/${item.id}?watch=1`); };
  const handleInfoClick = () => { navigate(`/${mediaType}/${item.id}`); };
  const handleLikeClick = () => { toast(`Liked ${item.title || item.name}`); };

  return (
    <div id="spotlight" className="relative w-full h-[80vh] bg-cover bg-center bg-no-repeat flex items-end animate-slide-up" style={{backgroundImage: `url('${backgroundImage}')`}}>
      <div className="absolute inset-0 bg-gradient-to-r from-[#090a0a]/70 via-black/20 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#090a0a]/80 via-black/40 md:via-black/20 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#090a0a]/80 md:from-[#090a0a]/60 via-[#090a0a]/10 to-transparent"></div>

      {/* Content container */}
      <div className="relative z-10 p-4 md:p-8 pb-0 w-full md:pl-8 md:pr-0 md:text-left text-center">
        {logoImage ? (
          <img src={getTmdbImage(logoImage)} className="w-[80%] md:max-h-72 max-w-sm min-w-[13rem] mb-4 animate-fade-in-delayed mx-auto md:mx-0" alt={item.title || item.name} />
        ) : (
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 w-full md:w-[24rem] animate-fade-in-delayed">
            {item.title || item.name}
          </h1>
        )}
        
        {/* Rating and info */}
        <div className="flex items-center gap-2 mb-4 animate-fade-in-delayed-2 justify-center md:justify-start">
          <div className="bg-gradient-to-r from-[#90cea1] to-[#01b4e4] text-black px-1 py-[1px] rounded font-black tracking-tighter text-sm">TMDB</div>
          <span className="text-neutral-300">{item.vote_average?.toFixed(1) || '8.0'}</span>
          <span className="text-neutral-300">•</span>
          <span className="text-neutral-300">{formatReleaseDate(item.first_air_date)}</span>
          <span className="text-neutral-300">•</span>
          <span className="text-neutral-300">
            {item.number_of_seasons ? `${item.number_of_seasons} seasons` : '0-100 seasons'}
          </span>
          <span className="text-neutral-300">•</span>
          <span className="text-green-400">100% match</span>
        </div>
        
        {/* Description */}
        <p className="text-white text-base md:text-lg mb-8 md:mb-16 leading-6 max-w-xl line-clamp-3 overflow-ellipsis animate-fade-in-delayed-3 mx-auto md:mx-0">
          {item.overview}
        </p>
        
        {/* Action buttons */}
        <div className="flex flex-col md:flex-row mb-4 w-full md:justify-between items-center gap-4 animate-fade-in-delayed-4">
          <div className="flex gap-2">
            <button onClick={handleWatchClick} className="bg-white text-black px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Watch
            </button>
            <button onClick={handleInfoClick} className="bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors">
              More Info
            </button>
          </div>
          
          <div className="flex gap-2">
            <button onClick={handleWatchlistToggle} className={`p-2 rounded-full ${inWatchlist ? 'bg-blue-500 text-white' : 'bg-gray-600 text-white hover:bg-gray-700'} transition-colors`}>
              <svg className="w-5 h-5" fill={inWatchlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
            <button onClick={handleLikeClick} className="p-2 rounded-full bg-gray-600 text-white hover:bg-gray-700 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MediaCard = ({ item }) => {
  const [inWatchlist, setInWatchlist] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (item && item.id) { setInWatchlist(isInWatchlist(item.id)); }
  }, [item]);
  
  const handleWatchlistToggle = (e) => {
    e.stopPropagation();
    const isAdded = toggleWatchlist(item);
    setInWatchlist(isAdded);
  };
  
  const handleClick = () => {
    navigate(`/tv/${item.id}`);
  };

  return (
    <div className="relative group cursor-pointer animate-scale-in" onClick={handleClick}>
      <div className="relative overflow-hidden rounded-lg">
        <img 
          src={getTmdbImage(item.poster_path, 'w500')} 
          alt={item.name} 
          className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
        
        {/* Watchlist button */}
        <button 
          onClick={handleWatchlistToggle}
          className={`absolute top-2 right-2 p-1 rounded-full transition-all duration-200 ${
            inWatchlist 
              ? 'bg-blue-500 text-white' 
              : 'bg-black/50 text-white hover:bg-black/70'
          }`}
        >
          <svg className="w-4 h-4" fill={inWatchlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>
      
      <div className="mt-2">
        <h3 className="text-white font-semibold text-sm line-clamp-1">{item.name}</h3>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>{formatReleaseDate(item.first_air_date)}</span>
          <span>•</span>
          <span>{item.vote_average?.toFixed(1) || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
};

const CategorySection = ({ title, items, isLoading: categoryLoading }) => {
  const containerRef = React.useRef(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);
  
  const checkScrollButtons = () => {
    const container = containerRef.current;
    if (container) {
      setShowLeftButton(container.scrollLeft > 0);
      setShowRightButton(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    }
  };
  
  const scrollLeft = () => {
    const container = containerRef.current;
    if (container) {
      container.scrollBy({
        left: -400,
        behavior: 'smooth'
      });
    }
  };
  
  const scrollRight = () => {
    const container = containerRef.current;
    if (container) {
      container.scrollBy({
        left: 400,
        behavior: 'smooth'
      });
    }
  };
  
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      checkScrollButtons();
      container.addEventListener('scroll', checkScrollButtons);
      return () => container.removeEventListener('scroll', checkScrollButtons);
    }
  }, [items]);

  if (categoryLoading) {
    return <CategorySkeleton title={title} />;
  }

  return (
    <div className="space-y-4 relative">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <div className="relative">
        {/* Left scroll button - hidden on mobile */}
        {showLeftButton && (
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-black text-white p-2 rounded-full shadow-lg transition-all duration-200 hidden md:flex items-center justify-center w-10 h-10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        
        {/* Right scroll button - hidden on mobile */}
        {showRightButton && (
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-black text-white p-2 rounded-full shadow-lg transition-all duration-200 hidden md:flex items-center justify-center w-10 h-10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
        
        <div 
          ref={containerRef}
          className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item) => (
            <div key={item.id} className="flex-shrink-0 w-32 md:w-48">
              <MediaCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Anime = () => {
  const [spotlightItem, setSpotlightItem] = useState(null);
  const [categoryData, setCategoryData] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [spotlightLoading, setSpotlightLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Loading anime data...');
        
        // First, try to get the latest anime for spotlight
        const latestData = await fetchTmdbAnime(1);
        console.log('Latest anime data received:', latestData.results?.length || 0, 'items');
        
        if (latestData.results && latestData.results.length > 0) {
          const heroItem = latestData.results[0];
          setSpotlightItem(heroItem);
          setSpotlightLoading(false);
        } else {
          setSpotlightLoading(false);
        }
        
        // Load anime data for different categories
        const promises = animeCategories.map(async (category, index) => {
          console.log(`Fetching ${category.title} (page ${index + 1})`);
          const data = await fetchTmdbAnime(index + 1); // Use different pages for variety
          console.log(`${category.title} received:`, data.results?.length || 0, 'items');
          return { ...category, data: data.results || [] };
        });

        const results = await Promise.all(promises);
        console.log('All anime data loaded:', results);
        const newCategoryData = {};
        
        results.forEach((result) => {
          newCategoryData[result.title] = result.data;
        });
        
        setCategoryData(newCategoryData);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
        setSpotlightLoading(false);
        console.error('Error loading anime data:', err);
      }
    };

    loadData();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-500 text-xl">
          <div>Error: {error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090a0a] pb-12 md:pb-0">
      <Header />
      
      {isLoading && !spotlightItem && (
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-white text-xl">Loading anime...</div>
        </div>
      )}
      
      <SpotlightSection item={spotlightItem} isLoading={spotlightLoading} />
      
      <div className="px-8 py-8 space-y-8">
        {animeCategories.map((category, index) => {
          const items = categoryData[category.title] || [];
          return (
            <div key={category.title} className="animate-stagger" style={{animationDelay: `${index * 200}ms`}}>
              <CategorySection 
                title={category.title}
                items={items}
                isLoading={isLoading}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Anime; 