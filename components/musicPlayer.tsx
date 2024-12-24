import { RefObject, useCallback, useEffect, useMemo, useState } from "react"
export type PlayerState = "playing" | "paused" | "empty" | "loading"

export type MusicPlayer = {
    play: () => void
    pause: () => void
    toggle: () => void
    playSong: (url: string) => void
}

export type SongDetails = {
    title: string
    artist: string
    album: string
    cover: string
    path: string
    date: string
    trackNo: number
}

export const useMusicPlayer = (player: RefObject<null | HTMLAudioElement>) => {
    const [state, setState] = useState<PlayerState>("empty")
    const [songDetails, setSongDetails] = useState<null | SongDetails>(null)

    const [nextUp, setNextUp] = useState<SongDetails[]>([])
    const [prev, setPrev] = useState<SongDetails[]>([])

    const [queue, setQueue] = useState<SongDetails[]>([])

    const isPlaying = useMemo(() => {
        return state === "playing" || state === "loading"
    }, [state])

    const playSongFromDetails = useCallback((details: SongDetails) => {
        if (player.current) {
            setSongDetails(details)
            player.current.src = process.env.API + "/" + details.path
            player.current.play()
        }
    }, [player])

    const playSong = useCallback((url: string) => {
        // fetch json data from url 
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                if (player.current) {
                    console.log(data)
                    setSongDetails(data)
                    player.current.src = process.env.API + "/" + data.path
                    player.current.play()
                }
            })
    }, [player])

    const play = useCallback(() => {
        if (player.current) {
            player.current.play()
        }
    }, [player])

    const pause = useCallback(() => {
        if (player.current) {
            player.current.pause()
        }
    }, [player])

    const toggle = useCallback(() => {
        if (player.current) {
            if (isPlaying) {
                player.current.pause()
            } else {
                player.current.play()
            }
        }
    }, [player, isPlaying])

    const addToQueue = useCallback((url: string) => {
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                setQueue((prev) => [...prev, data])
            })
    }, [])

    useEffect(() => {
        const playerElem = player.current
        const onPlay = () => {
            setState("playing")
        }
        const onPause = () => {
            setState("paused")
        }
        const onEnded = () => {
            //check if there is a next song in the queue
            if (queue.length > 0) {
                const nextFromQueue = queue[0]
                setQueue((prev) => prev.slice(1))
                playSongFromDetails(nextFromQueue)
            } else if (nextUp.length > 0) {
                // add to prev
                if (songDetails) {
                    setPrev((prev) => [...prev, songDetails])
                }
                const nextFromNextUp = nextUp[0]
                setNextUp((prev) => prev.slice(1))
                playSongFromDetails(nextFromNextUp)
            } else {
                setState("empty")
                setSongDetails(null)
            }
        }
        const onWaiting = () => {
            setState("loading")
        }
        if (playerElem) {
            playerElem.addEventListener('play', onPlay)
            playerElem.addEventListener('pause', onPause)
            playerElem.addEventListener('ended', onEnded)
            playerElem.addEventListener('waiting', onWaiting)
        }
        return () => {
            if (playerElem) {
                playerElem.removeEventListener('play', onPlay)
                playerElem.removeEventListener('pause', onPause)
                playerElem.removeEventListener('ended', onEnded)
                playerElem.removeEventListener('waiting', onWaiting)
            }
        }
    }, [nextUp, playSongFromDetails, player, queue, songDetails])

    useEffect(() => {
        if (typeof window === 'undefined') return
        if (songDetails) {
            // set media session metadata
            navigator.mediaSession.metadata = new MediaMetadata({
                title: songDetails.title,
                artist: songDetails.artist,
                album: songDetails.album,
                artwork: [
                    {
                        src: `${process.env.API}/${songDetails.cover}`,
                        sizes: '1000x1000',
                        type: 'image/jpg'
                    },
                ]
            })
        } else {
            navigator.mediaSession.metadata = null
        }
    }, [songDetails])

    return {
        state,
        isPlaying,
        play,
        pause,
        toggle,
        playSong,
        playSongFromDetails,
        songDetails,
        setSongDetails,
        queue,
        addToQueue,
        setQueue,
        nextUp,
        setNextUp,
        prev,
        setPrev,
    } as MusicPlayer
}