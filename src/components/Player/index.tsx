import styles from './styles.module.scss'
import Image from 'next/image'
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css'
import { usePlayer } from '../../context/PlayerContext';
import { useEffect, useRef } from 'react';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

export function Player() {
    const { 
        episodeList, 
        currentEpisodeIndex, 
        isPlaying,
        setPlayingState,
        togglePlay,
        playNext,
        playPrevious,
        hasPrevious,
        hasNext,
        toggleLoop,
        isLooping,
        toggleShuffle,
        isShuffling,
        progress,
        setCurrentProgress,
        getCurrentProgressFromEpisode
    } = usePlayer();
    const episode = episodeList[currentEpisodeIndex];
    // Anotar
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if(!audioRef.current) {
            return;
        }
        if(isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying])

    function setupProgressListener() {
        audioRef.current.currentTime = getCurrentProgressFromEpisode(episode);
        audioRef.current.addEventListener('timeupdate', () => {
            setCurrentProgress(Math.floor(audioRef.current.currentTime))
        })
    }

    function handleSeek(amount: number) {
        audioRef.current.currentTime = amount;
        setCurrentProgress(amount)
    }

    return(
        <div className={styles.playerContainer}>
            
            <header>
                <img src="/playing.svg" alt="Tocando agora"/>
                <strong>Tocando agora</strong>
            </header>

            {episode ? (
                <div className={styles.currentEpisode}>
                    <Image 
                        width={592}
                        height={592}
                        src={episode.thumbnail}
                        objectFit="cover"
                    />
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (
                <div className={styles.emptyPlayer}>
                    <strong>Selecione um podcast para ouvir</strong>
                </div>
            ) }

            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span>{convertDurationToTimeString(progress)}</span>
                    <div className={styles.slider}>
                        {episode ? (
                            <Slider
                                onChange={value => handleSeek(value)}
                                max={episode.duration}
                                value={progress}
                                trackStyle={{backgroundColor: '#04d361'}}
                                railStyle={{backgroundColor: '#9f75ff'}}
                                handleStyle={{borderColor: '#04d361', borderWidth: 4 }}
                            />
                        ): (
                            <div className={styles.emptySlider}/>
                        )}
                    </div>
                    <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
                </div>
                { episode && (
                    <audio
                        ref={audioRef} 
                        src={episode.url}
                        autoPlay
                        loop={isLooping}
                        onPlay={() => setPlayingState(true)}
                        onPause={() => setPlayingState(false)}
                        onLoadedMetadata={() => setupProgressListener()}
                    >
                    </audio>
                )}
                <div className={styles.buttons}>
                    <button type="button" disabled={!episode || episodeList.length === 1} onClick={toggleShuffle} className={isShuffling ? styles.isActive : ''}  >
                        <img src="/shuffle.svg" alt="Ordem aleatória"/>
                    </button>
                    <button type="button" disabled={!episode || !hasPrevious} onClick={() => playPrevious()} >
                        <img src="/play-previous.svg" alt="Voltar"/>
                    </button>
                    <button type="button" className={styles.playButton} disabled={!episode} onClick={() => togglePlay() }  >
                        {isPlaying ?
                        <img src="/pause.svg" alt="Tocar"/> :
                        <img src="/play.svg" alt="Tocar"/>
                        }
                    </button>
                    <button type="button" disabled={!episode || !hasNext} onClick={playNext}>
                        <img src="/play-next.svg" alt="Avançar"/>
                    </button>
                    <button 
                        type="button" 
                        disabled={!episode} 
                        onClick={toggleLoop}
                        className={isLooping ? styles.isActive : ''}
                    >
                        <img src="/repeat.svg" alt="Repetir"/>
                    </button>
                    
                </div>
            </footer>
        </div>
    )
}