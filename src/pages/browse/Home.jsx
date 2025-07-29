import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTmdb, getTmdbImage, formatReleaseDate, getContentRating, isInWatchlist, toggleWatchlist } from '../../utils.jsx';
import { Play, ThumbsUp, Plus, Info } from 'lucide-react';
import { toast } from 'sonner';
import CarouselItem from '../../components/carouselItem.jsx';
import Header from '../../components/Header.jsx';
import { SpotlightSkeleton, CategorySkeleton } from '../../components/Skeletons.jsx';
import { getAllContinueWatching } from '../../components/progress/index.jsx';
import config from '../../config.json';

const { tmdbBaseUrl } = config;

const categories = [
  {
    title: 'Trending Movies',
    url: `${tmdbBaseUrl}/trending/movie/week?language=en-US&append_to_response=images,content_ratings&include_image_language=en`,
    detailUrl: tmdbBaseUrl,
    updateHero: true
  },
  {
    title: 'Trending TV Shows',
    url: `${tmdbBaseUrl}/trending/tv/week?language=en-US&append_to_response=images,content_ratings&include_image_language=en`,
    detailUrl: tmdbBaseUrl
  },
  {
    title: 'Top Rated Movies',
    url: `${tmdbBaseUrl}/movie/top_rated?language=en-US&page=1&append_to_response=images,content_ratings&include_image_language=en`,
    detailUrl: tmdbBaseUrl
  },
  {
    title: 'Top Rated TV Shows',
    url: `${tmdbBaseUrl}/tv/top_rated?language=en-US&page=1&append_to_response=images,content_ratings&include_image_language=en`,
    detailUrl: tmdbBaseUrl
  },
  {
    title: 'Popular Movies',
    url: `${tmdbBaseUrl}/movie/popular?language=en-US&page=1&append_to_response=images,content_ratings&include_image_language=en`,
    detailUrl: tmdbBaseUrl
  },
  {
    title: 'Popular TV Shows',
    url: `${tmdbBaseUrl}/tv/popular?language=en-US&page=1&append_to_response=images,content_ratings&include_image_language=en`,
    detailUrl: tmdbBaseUrl
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
  const mediaType = item.title ? 'movie' : 'tv';
  
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
          <span className="text-neutral-300">{formatReleaseDate(item.release_date || item.first_air_date)}</span>
          <span className="text-neutral-300">•</span>
          <span className="text-neutral-300">
            {item.runtime ? `${Math.floor(item.runtime / 60)}h ${item.runtime % 60}m` : 
             item.number_of_seasons ? `${item.number_of_seasons} seasons` : '0-100 seasons'}
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
          <div className="flex items-center gap-2 justify-center">
            <button onClick={handleWatchClick} className="bg-white text-black px-6 py-2 rounded-full font-semibold text-lg flex items-center gap-2 hover:bg-neutral-200 transition-all cursor-pointer">
              <Play className="w-6 h-6" fill="currentColor" />
              Watch now
            </button>
            <button onClick={handleInfoClick} className="bg-white/15 text-white p-2.5 rounded-full hover:bg-white/25 transition-all cursor-pointer">
              <Info className="w-6 h-6" />
            </button>
            <button onClick={handleLikeClick} className="bg-white/15 text-white p-2.5 rounded-full hover:bg-white/25 transition-all cursor-pointer">
              <ThumbsUp className="w-6 h-6" />
            </button>
            <button 
              onClick={handleWatchlistToggle}
              className={`text-white p-2.5 rounded-full transition-all cursor-pointer ${inWatchlist ? 'bg-white/25' : 'bg-white/15 hover:bg-white/25'}`}
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span className="bg-white/15 text-white p-2 pl-3 pr-12 font-light">{getContentRating(item)}</span>
          </div>
        </div>
        
        {/* Genre tags */}
        <div className="flex gap-2 text-neutral-600 text-sm mb-3 animate-fade-in-delayed-5 justify-center md:justify-start">
          {
            item.genres.slice(0, 3).map((genre, index) => (
              <React.Fragment key={genre.id}>
                <span>{genre.name}</span>
                {index < Math.min(item.genres.length - 1, 2) && <span>•</span>}
              </React.Fragment>
            ))
          }
        </div>
      </div>
    </div>
  );
};

const MediaCard = ({ item, isContinueWatching = false }) => {
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
    const mediaType = item.title ? 'movie' : 'tv';
    navigate(`/${mediaType}/${item.id}`);
  };

  if (isContinueWatching) { 
    return <CarouselItem item={item} variant="continue" />; 
  }
  
  return (
    <div className="relative group cursor-pointer animate-scale-in" onClick={handleClick}>
      <div className="relative overflow-hidden rounded-lg">
        <img 
          src={getTmdbImage(item.poster_path, 'w500')} 
          alt={item.title || item.name} 
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
        <h3 className="text-white font-semibold text-sm line-clamp-1">{item.title || item.name}</h3>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>{formatReleaseDate(item.release_date || item.first_air_date)}</span>
          <span>•</span>
          <span>{item.vote_average?.toFixed(1) || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
};

const CategorySection = ({ title, items, isLoading: categoryLoading, isContinueWatching = false }) => {
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
          {items.map((item) => {
            const key = isContinueWatching ? `${item.id}-${item.mediaType}-${item.season || 0}-${item.episode || 0}` : item.id;
            return (
              <div key={key} className="flex-shrink-0 w-32 md:w-48">
                <MediaCard item={item} isContinueWatching={isContinueWatching} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const [spotlightItem, setSpotlightItem] = useState(null);
  const [categoryData, setCategoryData] = useState({});
  const [continueWatchingItems, setContinueWatchingItems] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [spotlightLoading, setSpotlightLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load continue watching data
        const continueWatching = getAllContinueWatching();
        
        // Filter to show only the latest episode per show/movie
        const latestEpisodes = continueWatching.reduce((acc, item) => {
          const key = `${item.id}-${item.mediaType}`;
          if (!acc[key] || item.timestamp > acc[key].timestamp) {
            acc[key] = item;
          }
          return acc;
        }, {});
        
        setContinueWatchingItems(Object.values(latestEpisodes));
        
        const promises = categories.map(async (category) => {
          const route = category.url.replace(category.detailUrl, '');
          const data = await fetchTmdb(route);
          return { ...category, data: data.results || [] };
        });

        const results = await Promise.all(promises);
        const newCategoryData = {};
        
        results.forEach((result) => {
          newCategoryData[result.title] = result.data;
          
          // Set spotlight item from trending movies with detailed data
          if (result.updateHero && result.data.length > 0) {
            const heroItem = result.data[0];
            const detailRoute = `/${heroItem.title ? 'movie' : 'tv'}/${heroItem.id}?language=en-US&append_to_response=images,content_ratings${heroItem.title ? ',release_dates' : ''}&include_image_language=en`;
            
            fetchTmdb(detailRoute).then(detailedItem => {
              setSpotlightItem(detailedItem);
              setSpotlightLoading(false);
            }).catch(err => {
              console.error('Error fetching detailed hero data:', err);
              setSpotlightItem(heroItem);
              setSpotlightLoading(false);
            });
          }
        });
        
        setCategoryData(newCategoryData);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
        setSpotlightLoading(false);
        console.error('Error loading data:', err);
      }
    };

    loadData();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090a0a] pb-12 md:pb-0">
      <Header />
      
      <SpotlightSection item={spotlightItem} isLoading={spotlightLoading} />
      
      <div className="px-8 py-8 space-y-8">
        {continueWatchingItems.length > 0 && (
          <div className="animate-stagger" style={{animationDelay: '0ms'}}>
            <CategorySection 
              title="Continue Watching"
              items={continueWatchingItems}
              isLoading={false}
              isContinueWatching={true}
            />
          </div>
        )}
        
        {categories.map((category, index) => {
          const items = categoryData[category.title] || [];
          const delay = continueWatchingItems.length > 0 ? (index + 1) * 200 : index * 200;
          return (
            <div key={category.title} className="animate-stagger" style={{animationDelay: `${delay}ms`}}>
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

export default Home;
