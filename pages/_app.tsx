import { MusicPlayer, useMusicPlayer } from "@/components/musicPlayer";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { createContext, useRef } from "react";

export const MusicPlayerContext = createContext<null | MusicPlayer>(null);

export default function App({ Component, pageProps }: AppProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const musicPlayer = useMusicPlayer(audioRef);

  return <>
    <audio ref={audioRef} />
    <MusicPlayerContext.Provider value={musicPlayer}>
      <Component {...pageProps} />
      <button onClick={()=>{
        musicPlayer.playSong(`${process.env.API}/mosopor/tovabb/01_tovabb`)
      }}>play</button>
    </MusicPlayerContext.Provider>
  </>;
}
