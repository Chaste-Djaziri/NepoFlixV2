import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import config from "../../config.json";
import { searchSubtitles } from "wyzie-lib";
import VideoPlayer from "../../components/player/main";

const PrimeNet = () => {
  const { tmdbid, season, episode } = useParams();
  const [videoUrl, setVideoUrl] = useState("");
  const [originalM3U8Url, setOriginalM3U8Url] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Subtitle states
  const [showCaptionsPopup, setShowCaptionsPopup] = useState(false);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(false);
  const [availableSubtitles, setAvailableSubtitles] = useState([]);
  const [selectedSubtitle, setSelectedSubtitle] = useState(null);
  const [subtitlesLoading, setSubtitlesLoading] = useState(false);
  const [subtitleError, setSubtitleError] = useState("");
  const [subtitleCues, setSubtitleCues] = useState([]);

  const mediaType = season && episode ? "tv" : "movie";

  useEffect(() => {
    const fetchVideoUrl = async () => {
      try {
        setLoading(true);
        setError("");

        let apiUrl;
        if (season && episode) {
          apiUrl = `https://backend.xprime.tv/?id=${tmdbid}&season=${season}&episode=${episode}`;
        } else {
          apiUrl = `https://backend.xprime.tv/primenet?id=${tmdbid}`;
        }

        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (!data.url) {
          throw new Error("No video URL found in response");
        }

        setOriginalM3U8Url(data.url);

        const proxiedUrl = `${
          config.m3u8proxy
        }/m3u8-proxy?url=${encodeURIComponent(
          data.url
        )}&headers=${encodeURIComponent(
          JSON.stringify({ referer: "https://xprime.tv/" })
        )}`;
        setVideoUrl(proxiedUrl);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load video");
      } finally {
        setLoading(false);
      }
    };

    if (tmdbid) {
      fetchVideoUrl();
    }
  }, [tmdbid, season, episode]);

  useEffect(() => {
    const fetchSubtitles = async () => {
      if (!tmdbid) return;

      setSubtitlesLoading(true);
      try {
        const searchParams = {
          tmdb_id: parseInt(tmdbid),
          format: "srt",
        };

        if (season && episode) {
          searchParams.season = parseInt(season);
          searchParams.episode = parseInt(episode);
        }

        const subtitles = await searchSubtitles(searchParams);

        setAvailableSubtitles(subtitles || []);
      } catch (err) {
        console.error(err);
        setAvailableSubtitles([]);
        setSubtitleError(`Failed to fetch subtitles: ${err.message}`);
        setTimeout(() => setSubtitleError(""), 3000);
      } finally {
        setSubtitlesLoading(false);
      }
    };

    fetchSubtitles();
  }, [tmdbid, season, episode]);

  const selectSubtitle = async (subtitle, videoRef) => {
    console.log(subtitle);
    setSelectedSubtitle(subtitle);

    if (subtitle === null) {
      setSubtitlesEnabled(false);
      setSubtitleCues([]);
    } else {
      setSubtitlesEnabled(true);
      await loadSubtitleCues(subtitle);
    }
  };

  const parseSRT = (srtText) => {
    const blocks = srtText.trim().split(/\n\s*\n/);
    const cues = [];

    blocks.forEach((block) => {
      const lines = block.trim().split("\n");
      if (lines.length >= 3) {
        const index = lines[0];
        const timeString = lines[1];
        const text = lines.slice(2).join("\n");

        const timeMatch = timeString.match(
          /(\d{2}:\d{2}:\d{2},\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2},\d{3})/
        );
        if (timeMatch) {
          cues.push({
            index: parseInt(index),
            startTime: timeMatch[1],
            endTime: timeMatch[2],
            text: text,
          });
        }
      }
    });

    return cues;
  };

  const loadSubtitleCues = async (subtitle) => {
    if (!subtitle) return;

    try {
      let subtitleText = "";

      if (subtitle.url && subtitle.url.startsWith("http")) {
        const response = await fetch(subtitle.url, {
          mode: "cors",
          headers: { Accept: "text/plain, text/vtt, application/x-subrip" },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch subtitle: ${response.status}`);
        }

        subtitleText = await response.text();
      } else if (subtitle.content) {
        subtitleText = subtitle.content;
      } else if (subtitle.url) {
        subtitleText = subtitle.url;
      } else {
        throw new Error("No subtitle content or URL available");
      }

      // Parse SRT and set cues
      const parsedSrt = parseSRT(subtitleText);
      setSubtitleCues(parsedSrt);
    } catch (err) {
      console.error(err);
      setSubtitleError(`Failed to load subtitles: ${err.message}`);
      setTimeout(() => setSubtitleError(""), 3000);
      setSubtitleCues([]);
    }
  };

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-screen h-screen bg-black flex items-center justify-center text-white text-lg">
        Loading video...
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed top-0 left-0 w-screen h-screen bg-black flex items-center justify-center text-red-500 text-lg text-center p-5">
        <div>
          <div>Error: {error}</div>
          <button
            onClick={() => window.location.reload()}
            className="mt-5 px-5 py-2.5 bg-gray-800 text-white border-none rounded cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <VideoPlayer
      videoUrl={videoUrl}
      originalM3U8Url={originalM3U8Url}
      onError={setError}
      showCaptionsPopup={showCaptionsPopup}
      setShowCaptionsPopup={setShowCaptionsPopup}
      subtitlesEnabled={subtitlesEnabled}
      subtitleError={subtitleError}
      subtitlesLoading={subtitlesLoading}
      availableSubtitles={availableSubtitles}
      selectedSubtitle={selectedSubtitle}
      onSelectSubtitle={selectSubtitle}
      subtitleCues={subtitleCues}
      // Progress tracking props
      mediaId={tmdbid}
      mediaType={mediaType}
      season={season ? parseInt(season) : 0}
      episode={episode ? parseInt(episode) : 0}
      sourceIndex={0} // PrimeNet source index
    />
  );
};

export default PrimeNet;
