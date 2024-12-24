export type Track = {
    title: string
    artist: string
    date: string
    album: string
    trackNo: number
    cover: string
    path: string
}

export type Release = ReleasePartial & {
    tracks: Track[]
}

export type ReleasePartial = {
    title: string
    type: "album" | "single" | "ep"
    cover: string
    date: string
    directory: string
}

export type ReleasePartialWithArtist = ReleasePartial & {
    artist: ArtistPartial
}

export type ArtistPartial = {
    name: string
    avatar: string
    directory: string
}

export type Artist<ReleaseType> = ArtistPartial & {
    releases: ReleaseType[]
}

export type Library = {
    title: string
    description: string
    legalDisclaimer: string
    maintainer: {
        name: string
        email: string
        website: string
    }
    artists: Artist<ReleasePartial>[]
}