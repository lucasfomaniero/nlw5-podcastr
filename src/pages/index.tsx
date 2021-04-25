import { format, parseISO } from "date-fns";
import Link from 'next/link';
import  Image  from 'next/image';
import ptBR from "date-fns/locale/pt-BR";
import { GetStaticProps } from "next";
import api from "../services/api";
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString";
import style from './home.module.scss'
import { usePlayer } from "../context/PlayerContext";
import { useEffect } from "react";

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  duration: number;
  durationAsString: string;
  url: string;
  publishedAt: string;
}

type HomeProps = {
  lastEpisodes: Episode[] // ou Array<Episode>
  allEpisodes: Episode[]
}

export default function Home({ lastEpisodes, allEpisodes  }: HomeProps) {
  const { playList, currentEpisodeIndex, togglePlay, isPlaying, play, getCurrentProgressFromEpisode, setCurrentProgress} = usePlayer();
  const episodeList = [...lastEpisodes, ...allEpisodes];

 return(
   <div className={style.homepage}>
       <h2>Últimos lançamentos</h2>
     <section className={style.latestEpisodes}>
       <ul>
         {lastEpisodes.map((episode, index) => {
           return(
            <li key={episode.id}>
              <div className={style.imageContainer}>
                <Image 
                  width={192} 
                  height={192} 
                  src={episode.thumbnail}  
                  alt={episode.title}
                  objectFit={"cover"}
                />
              </div>
              <div className={style.episodeDetails}>
              <Link href={`/episodes/${episode.id}`}>
                  <a>{episode.title}</a>
               </Link>   
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
              </div>
              {
                       isPlaying && currentEpisodeIndex === episodeList.indexOf(episode) ?
                      (
                        <button type="button" onClick={() => togglePlay()} >
                        <img src="./pause-green.svg" alt="Pausar episódio"/>  
                      </button>
                      ) :
                      (
                        <button type="button" onClick={() => playList(episodeList, index)} >
                        <img src="./play-green.svg" alt="Tocar episódio"/>  
                      </button>
                      )
                     }   
            </li>
           )
         })}
       </ul>
     </section>
     <section className={style.allEpisodes}>
         <h2>Todos episódios</h2>
         <table cellSpacing={0}>
           <thead>
             <tr>
                <th></th>
                <th>Podcast</th>
                <th>Integrantes</th>
                <th>Data</th>
                <th>Duração</th>
                <th></th>
             </tr>
           </thead>
           <tbody>
             {allEpisodes.map((episode, index) => {
               
               return(
                 <tr key={episode.id}>
                   <td style={{width: 72}}>
                     <Image 
                        width={120}
                        height={120}
                        src={episode.thumbnail}
                        alt={episode.title}
                        objectFit="cover"
                     />
                   </td>
                   <td>
                     <Link href={`/episodes/${episode.id}`}>
                        <a >{episode.title}</a>
                     </Link>
                   </td>
                   <td>{episode.members}</td>
                   <td style={{width: 100}}>{episode.publishedAt}</td>
                   <td>{episode.durationAsString}</td>
                   <td>
                     {
                       isPlaying && currentEpisodeIndex === episodeList.indexOf(episode) ?
                      (
                        <button type="button" onClick={() => togglePlay()} >
                        <img src="./pause-green.svg" alt="Pausar episódio"/>  
                      </button>
                      ) :
                      (
                        <button type="button" onClick={() => playList(episodeList, index + lastEpisodes.length)} >
                        <img src="./play-green.svg" alt="Tocar episódio"/>  
                      </button>
                      )
                     }   
                   </td>
                 </tr>
               )
             })}
           </tbody>
         </table>
     </section>
   </div>
 );
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes',{
    params: {
      _limit: 12,
      _sort: "published_at",
      _order: "desc",
    }
  })

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR}),
      duration: episode.file.duration,
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      url: episode.file.url,
    }
  })

  const lastEpisodes = episodes.splice(0, 2);
  const allEpisodes = episodes.splice(2, episodes.length);
  
  return {
      props: {
      lastEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8
  };
}