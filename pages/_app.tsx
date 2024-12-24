import '@mantine/core/styles.css';
import "@/styles/globals.css";
import classes from "./App.module.css"

import { MusicPlayer, useMusicPlayer } from "@/components/musicPlayer";
import type { AppProps } from "next/app";
import { createContext, useEffect, useMemo, useRef, useState } from "react";
import { createTheme, MantineProvider } from '@mantine/core';
import SidePanel from '@/components/SidePanel';
import { Library, ReleasePartialWithArtist } from '@/types';

export const MusicPlayerContext = createContext<null | MusicPlayer>(null);
export const LibraryIndexContext = createContext<{
  library: undefined | Library,
  releases: ReleasePartialWithArtist[]
}>({
  library: undefined,
  releases: []
});

const theme = createTheme({
  primaryColor: "grape",
  primaryShade: 6,
})

export default function App({ Component, pageProps }: AppProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const musicPlayer = useMusicPlayer(audioRef);
  const [libraryIndex, setLibraryIndex] = useState<undefined | Library>(undefined);
  const releases = useMemo(() => {
    if (!libraryIndex) return []
    const allReleases = []
    for (const artist of libraryIndex.artists) {
      for (const release of artist.releases) {
        allReleases.push({
          ...release,
          artist: {
            name: artist.name,
            avatar: artist.avatar,
            directory: artist.directory
          }
        })
      }
    }
    allReleases.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
    return allReleases
  }, [libraryIndex])

  useEffect(() => {
    fetch(process.env.API!)
      .then((response) => response.json())
      .then((data) => {
        setLibraryIndex(data)
        console.log(data)
      })
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (CSS.supports("height", "100dvh")) {
        if (!document.documentElement.classList.contains("dvh")) {
          document.documentElement.classList.add("dvh")
        }
      } else {
        if (document.documentElement.classList.contains("dvh")) {
          document.documentElement.classList.remove("dvh")
        }
      }
    }
  }, []);

  return <>
    <MantineProvider theme={theme} defaultColorScheme='dark'>
      <audio ref={audioRef} />
      <MusicPlayerContext.Provider value={musicPlayer}>
        <LibraryIndexContext.Provider value={{
          library: libraryIndex,
          releases
        }}>
          <div className={classes.app}>
            <SidePanel />
            <Component {...pageProps} />
          </div>
        </LibraryIndexContext.Provider>
      </MusicPlayerContext.Provider>
    </MantineProvider>
  </>;
}
