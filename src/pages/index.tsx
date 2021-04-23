import { GetStaticProps } from "next";
import { useEffect } from "react";
import { Header } from "../components/Header";

type Episode = {
    id: string;
    title: string;
    members: string;
}

type HomeProps = {
  episodes: Episode[] // ou Array<Episode>
}

export default function Home(props: HomeProps) {
  return(
    <p>{JSON.stringify(props.episodes)}</p>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await fetch('http://localhost:3333/episodes')
  const data = await response.json();
  
  return {
    props: {
    episodes: data,
  }
};
}