// src/pages/details/Sources.jsx

export function getSource(source, type, id, season = 0, episode = 0) {
  switch (source) {
    case "Native":
      return type === "movie"
        ? `/e/primenet/${id}`
        : `/e/primenet/${id}/${season}/${episode}`;

    case "VidLink":
      return type === "movie"
        ? `https://vidlink.pro/movie/${id}?primaryColor=FFFFFF&secondaryColor=2392EE&title=true&poster=false&autoplay=false`
        : `https://vidlink.pro/tv/${id}/${season}/${episode}?primaryColor=2392EE&secondaryColor=FFFFFF&title=true&poster=false&autoplay=false&nextbutton=true`;

    case "VidsrcXYZ":
      return type === "movie"
        ? `https://vidsrc.xyz/embed/movie?tmdb=${id}`
        : `https://vidsrc.xyz/embed/tv/${id}/${season}-${episode}`;

    case "VidsrcSU":
      return type === "movie"
        ? `https://vidsrc.su/embed/movie/${id}?serverselector=false`
        : `https://vidsrc.su/embed/tv/${id}/${season}/${episode}?serverselector=false`;

    case "Vidora":
      return type === "movie"
        ? `https://vidora.su/movie/${id}?autoplay=true&colour=2392EE&autonextepisode=true&pausescreen=false`
        : `https://vidora.su/tv/${id}/${season}/${episode}?autoplay=true&colour=2392EE&autonextepisode=true&pausescreen=false`;

    case "VidFast":
      return type === "movie"
        ? `https://vidfast.pro/movie/${id}?autoPlay=true&theme=2392EE&poster=false`
        : `https://vidfast.pro/tv/${id}/${season}/${episode}?autoPlay=true&theme=2392EE&poster=false`;

    case "Videasy":
      return type === "movie"
        ? `https://player.videasy.net/movie/${id}?color=2392EE`
        : `https://player.videasy.net/tv/${id}/${season}/${episode}?color=2392EE&nextEpisode=true&episodeSelector=true&autoplayNextEpisode=false`;

    default:
      throw new Error("Invalid source");
  }
}
