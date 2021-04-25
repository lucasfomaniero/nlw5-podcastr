import { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';

type Episode = {
  id: string;
  title: string,
  members: string,
  thumbnail: string,
  duration: number,
  url: string;
}

type PlayerContextData = {
  episodeList: Episode[],
  currentEpisodeIndex: number,
  isPlaying: boolean,
  isLooping: boolean,
  isShuffling: boolean,
  play: (episode: Episode) => void,
  playList: (list: Episode[], index: number) => void,
  setPlayingState: (state: boolean) => void,
  togglePlay: () => void,
  toggleLoop: () => void,
  toggleShuffle: () => void,
  playNext: () => void,
  playPrevious: () => void,
  clearPlayerState: () => void,
  // getCurrentProgressFromEpisode: (episode: Episode) => number,
  // setCurrentProgress: (progress: number) =>  void,
  hasNext: boolean;
  hasPrevious: boolean;
  progress: number;
}

export const PlayerContext = createContext({} as PlayerContextData)

type PlayerContextProviderProps = {
  children: ReactNode
}

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState<Episode[]>([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [isShuffling, setIsShuffling] = useState(false)
  const [progress, setProgress] = useState(0);

  // function setCurrentProgress(progress: number) {
  //   setProgress(progress)
  //   if (episodeList) {
  //     localStorage.setItem(`@Podcastr:${episodeList[currentEpisodeIndex]?.id}`, String(progress))
  //   }
  // }

  // function getCurrentProgressFromEpisode(episode: Episode): number {
  //   const currentTime = Number(localStorage.getItem(`@Podcastr:${episode.id}`))
  //   return  currentTime;
  // }

  function play(episode: Episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
    // const currentProgress = getCurrentProgressFromEpisode(episode);
    // if (currentProgress) {
    //   setCurrentProgress(currentProgress)
    // }
  }

  function playList(list: Episode[], index: number) {
    setEpisodeList(list)
    setCurrentEpisodeIndex(index)
    setIsPlaying(true)
    // const episode = list[index];
    // const currentProgress = getCurrentProgressFromEpisode(episode)
    // setCurrentProgress(currentProgress);
  }

  function togglePlay() {
    setIsPlaying(!isPlaying);
  }

  function toggleLoop() {
    setIsLooping(!isLooping);
  }
  
  function toggleShuffle() {
    setIsShuffling(!isShuffling);
  }

  function clearPlayerState() {
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state)
  }

  const hasPrevious = currentEpisodeIndex > 0;
  const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length;

  function playNext() {
    if(isShuffling) {
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
      setCurrentEpisodeIndex(nextRandomEpisodeIndex)
    } else if (hasNext) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1)
    }
  }

  function playPrevious() {
    if(hasPrevious) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1)
    }
  }

  return (
    <PlayerContext.Provider
      value={{
        episodeList,
        currentEpisodeIndex,
        play,
        playList,
        playNext,
        playPrevious,
        isPlaying,
        isLooping,
        isShuffling,
        togglePlay,
        setPlayingState,
        hasNext,
        hasPrevious,
        toggleLoop,
        toggleShuffle,
        clearPlayerState,
        progress
        // setCurrentProgress,
        // getCurrentProgressFromEpisode
      }}
    >
      { children }
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => {
  return useContext(PlayerContext)
}