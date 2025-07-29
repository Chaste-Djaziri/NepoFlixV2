import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Home from './pages/browse/Home.jsx';
import Movies from './pages/browse/Movies.jsx';
import Tv from './pages/browse/Tv.jsx';
import Anime from './pages/browse/Anime.jsx';
import Details from './pages/details/Details.jsx';
import Watchlist from './pages/Watchlist.jsx';
import Search from './pages/Search.jsx';
import Ios from './pages/misc/Ios.jsx';
import PrimeNet from './pages/embeds/primenet.jsx';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/tv" element={<Tv />} />
        <Route path="/anime" element={<Anime />} />
        <Route path="/movie/:tmdbId" element={<Details />} />
        <Route path="/tv/:tmdbId" element={<Details />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/search" element={<Search />} />
        <Route path="/ios" element={<Ios />} />
        <Route path="/e/primenet/:tmdbid" element={<PrimeNet />} />
        <Route path="/e/primenet/:tmdbid/:season/:episode" element={<PrimeNet />} />
      </Routes>
      <Toaster 
        position="bottom-center"
        theme="dark"
        duration={3000}
        unstyled
        closeButton
      />
    </Router>
  )
}
