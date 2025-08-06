import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchTmdb, getTmdbImage } from '../../utils.jsx';
import Header from '../../components/Header.jsx';
import { CastCard, MediaCard } from './Cards.jsx';

const CastDetails = () => {
  const { personId } = useParams();
  const [person, setPerson] = useState(null);
  const [credits, setCredits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPerson = async () => {
      setIsLoading(true);
      try {
        // Fetch person details
        const personData = await fetchTmdb(`/person/${personId}?language=en-US`);
        setPerson(personData);
        // Fetch combined credits (movies & TV)
        const creditsData = await fetchTmdb(`/person/${personId}/combined_credits?language=en-US`);
        // Sort by popularity or release date
        const sortedCredits = (creditsData.cast || []).sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        setCredits(sortedCredits);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (personId) loadPerson();
  }, [personId]);

  if (isLoading) {
    return <div className="min-h-screen bg-black flex items-center justify-center"><div className="text-white text-xl">Loading...</div></div>;
  }
  if (error) {
    return <div className="min-h-screen bg-black flex items-center justify-center"><div className="text-red-500 text-xl">Error: {error}</div></div>;
  }
  if (!person) {
    return <div className="min-h-screen bg-black flex items-center justify-center"><div className="text-white text-xl">No data found.</div></div>;
  }

  return (
    <div className="min-h-screen bg-[#090a0a] pb-12">
      <Header />
      <div className="px-8 pt-8 flex flex-col md:flex-row gap-8">
        {/* Profile Image */}
        <div className="flex-shrink-0 w-48 md:w-64">
          <img
            src={getTmdbImage(person.profile_path, 'w300')}
            alt={person.name}
            className="rounded-2xl w-full object-cover bg-neutral-800"
            style={{ minHeight: '320px' }}
          />
        </div>
        {/* Bio and Info */}
        <div className="flex-1 text-white">
          <h1 className="text-3xl md:text-5xl font-bold mb-2">{person.name}</h1>
          <p className="text-neutral-400 mb-2">{person.known_for_department}</p>
          {person.birthday && (
            <p className="mb-1">Born: {person.birthday}{person.place_of_birth ? ` in ${person.place_of_birth}` : ''}</p>
          )}
          {person.deathday && (
            <p className="mb-1">Died: {person.deathday}</p>
          )}
          {person.biography && (
            <p className="mt-4 text-base text-neutral-200 whitespace-pre-line max-w-2xl">{person.biography}</p>
          )}
        </div>
      </div>
      {/* Known For / Credits */}
      <div className="px-8 pt-8">
        <h2 className="text-2xl font-semibold text-white mb-4">Known For</h2>
        <div className="flex flex-row gap-4 overflow-x-auto pb-4">
          {credits.slice(0, 12).map(item => (
            <div key={item.credit_id || item.id} className="min-w-[10rem]">
              <MediaCard item={item} />
            </div>
          ))}
        </div>
      </div>
      {/* All Credits */}
      <div className="px-8 pt-8">
        <h2 className="text-2xl font-semibold text-white mb-4">All Credits</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {credits.map(item => (
            <MediaCard key={item.credit_id || item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CastDetails;