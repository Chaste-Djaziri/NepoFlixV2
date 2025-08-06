import { toast } from 'sonner';
import MobileDetect from 'mobile-detect';
import config from './config.json';

const { tmdbApiKey, tmdbBaseUrl, tmdbImageBaseUrl } = config;

// Migrate old localStorage data
export const migrateLocalStorageData = () => {
  try {
    // Migrate quickwatch-continue to continue
    const oldContinueData = localStorage.getItem('quickwatch-continue');
    if (oldContinueData) {
      const currentContinueData = localStorage.getItem('continue');
      if (!currentContinueData) { localStorage.setItem('continue', oldContinueData); }
      localStorage.removeItem('quickwatch-continue');
    }

    // Migrate quickwatch-watchlist to watchlist
    const oldWatchlistData = localStorage.getItem('quickwatch-watchlist');
    if (oldWatchlistData) {
      const currentWatchlistData = localStorage.getItem('watchlist');
      if (!currentWatchlistData) { localStorage.setItem('watchlist', oldWatchlistData); }
      localStorage.removeItem('quickwatch-watchlist');
    }
  } catch (error) {
    console.error('Error migrating localStorage data:', error);
  }
};

// Call migration on module load
migrateLocalStorageData();

// fetch data from tmdb api
export const fetchTmdb = async (route) => {
  try {
    const url = `${tmdbBaseUrl}${route}`;
    const response = await fetch(url, {
      headers: {'Authorization': tmdbApiKey, 'Content-Type': 'application/json'}
    });
    
    if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`) }
    
    const data = await response.json();
    return data;
  } catch (error) { console.error('Error fetching TMDB data:', error); throw error }
};

// get tmdb image url
export const getTmdbImage = (path, size = 'original') => {
  if (!path) return null;
  return `${tmdbImageBaseUrl}${size}${path}`;
};

// format the runtime of the movie
export const formatRuntime = (minutes) => {
  if (!minutes) return '';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

// format the release date of the movie
export const formatReleaseDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.getFullYear();
};

// get content rating for both tv/movies
export const getContentRating = (item) => {
  // TV shows with content_ratings
  if (item.content_ratings?.results) {
    const usRating = item.content_ratings.results.find(r => r.iso_3166_1 === 'US');
    return usRating?.rating || 'NR';
  }
  
  // Movies with release_dates
  if (item.release_dates?.results) {
    const usReleases = item.release_dates.results.find(r => r.iso_3166_1 === 'US');
    if (usReleases?.release_dates) {
      const validCertification = usReleases.release_dates.find(r => r.certification?.trim());
      return validCertification?.certification || 'NR';
    }
  }
  
  return 'NR';
};

// Watchlist utilities
export const getWatchlist = () => {
  try {
    const watchlist = localStorage.getItem('watchlist');
    return watchlist ? JSON.parse(watchlist) : [];
  } catch (error) {
    console.error('Error getting watchlist:', error);
    return [];
  }
};

export const addToWatchlist = (item) => {
  try {
    const watchlist = getWatchlist();
    const mediaType = item.media_type || (item.first_air_date ? 'tv' : 'movie');
    const title = item.title || item.name;
    
    // Check if item already exists in watchlist
    if (!watchlist.some(watchItem => watchItem.id === item.id.toString())) {
      watchlist.push({
        id: item.id.toString(),
        mediaType,
        title,
        posterPath: item.poster_path,
        backdropPath: item.backdrop_path
      });
      localStorage.setItem('watchlist', JSON.stringify(watchlist));
      toast(`Added "${title}" to watchlist`);
    }
    return true;
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    toast('Failed to add to watchlist');
    return false;
  }
};

export const removeFromWatchlist = (itemId) => {
  try {
    const watchlist = getWatchlist();
    const itemToRemove = watchlist.find(item => item.id === itemId.toString());
    const updatedWatchlist = watchlist.filter(item => item.id !== itemId.toString());
    localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
    
    if (itemToRemove) {
      toast(`Removed "${itemToRemove.title}" from watchlist`);
    }
    return true;
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    toast('Failed to remove from watchlist');
    return false;
  }
};

export const isInWatchlist = (itemId) => {
  try {
    const watchlist = getWatchlist();
    return watchlist.some(item => item.id === itemId.toString());
  } catch (error) {
    console.error('Error checking watchlist:', error);
    return false;
  }
};

export const toggleWatchlist = (item) => {
  const itemId = item.id;
  if (isInWatchlist(itemId)) {
    removeFromWatchlist(itemId);
    return false; // Item was removed
  } else {
    addToWatchlist(item);
    return true; // Item was added
  }
};

// Continue watching utilities
export const calculateProgressPercent = (watchedDuration, fullDuration) => {
  return Math.round((watchedDuration / fullDuration) * 100);
};

export const getRemainingTime = (watchedDuration, fullDuration) => {
  if (!fullDuration || !watchedDuration) return 0;
  const remainingSeconds = fullDuration - watchedDuration;
  const remainingMinutes = Math.round(remainingSeconds / 60);
  
  if (remainingMinutes >= 60) {
    const hours = Math.floor(remainingMinutes / 60);
    const mins = remainingMinutes % 60;
    return `${hours}h${mins}m`;
  }
  
  return `${remainingMinutes}m`;
};

// Get paths for carouselItem
export const getImagePath = (detailedItem, item) => {
  if (detailedItem.images?.backdrops) {
    const englishBackdrop = detailedItem.images.backdrops.find(backdrop => backdrop.iso_639_1 === 'en' || backdrop.iso_639_1 === null);
    if (englishBackdrop) { return englishBackdrop.file_path; }
  }
  
  if (detailedItem.backdrop_path || item.backdrop_path) {
    return detailedItem.backdrop_path || item.backdrop_path;
  }
  
  return detailedItem.poster_path || item.poster_path;
};

export const hasEnglishBackdrop = (detailedItem) => {
  if (detailedItem.images?.backdrops) {
    return detailedItem.images.backdrops.some(backdrop => backdrop.iso_639_1 === 'en' || backdrop.iso_639_1 === null);
  }
  return true;
};

export const getLogoPath = (detailedItem) => {
  if (detailedItem.images?.logos) {
    const englishLogo = detailedItem.images.logos.find(logo => logo.iso_639_1 === 'en' || logo.iso_639_1 === null);
    if (englishLogo) { return englishLogo.file_path; }
    // Fallback to any logo if no English logo
    if (detailedItem.images.logos.length > 0) {
      return detailedItem.images.logos[0].file_path;
    }
  }
  return null;
};

export const isMobileDevice = () => {
  const md = new MobileDetect(window.navigator.userAgent);
  return md.mobile() !== null || md.phone() !== null;
};

export const isPhone = () => {
  const md = new MobileDetect(window.navigator.userAgent);
  return md.phone() !== null;
};
