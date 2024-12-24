import '@mantine/core/styles.css';
import "@/styles/globals.css";

import { MusicPlayer, useMusicPlayer } from "@/components/musicPlayer";
import type { AppProps } from "next/app";
import { createContext, useRef } from "react";
import { Button, createTheme, MantineProvider } from '@mantine/core';

export const MusicPlayerContext = createContext<null | MusicPlayer>(null);

const theme = createTheme({})

export default function App({ Component, pageProps }: AppProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const musicPlayer = useMusicPlayer(audioRef);

  return <>
    <MantineProvider theme={theme} defaultColorScheme='dark'>
      <audio ref={audioRef} />
      <MusicPlayerContext.Provider value={musicPlayer}>
        <Component {...pageProps} />
        <Button onClick={() => {
          musicPlayer.playSong(`${process.env.API}/mosopor/tovabb/01_tovabb`)
        }}>play</Button>
      </MusicPlayerContext.Provider>
    </MantineProvider>
  </>;
}
