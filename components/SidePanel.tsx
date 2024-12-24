import { useContext } from "react"
import classes from "./SidePanel.module.css"
import { LibraryIndexContext } from "@/pages/_app"
import Image from "next/image"
import { Text } from "@mantine/core"

export default function SidePanel() {
    const {
        releases,
        library
    } = useContext(LibraryIndexContext)

    return <nav className={classes.sidePanel}>
        <ul>
            <li>
                <button>
                    <div className={classes.smallImage} style={{
                        width: 64,
                        height: 64,
                        background: "var(--mantine-color-dark-6)"
                    }} />
                    <div className={classes.releaseInfo}>
                        <Text className={classes.releaseTitle}>Összes lemez</Text>
                        <div>
                            <Text className={classes.releaseArtist}>{releases.length} lemez</Text>
                            <Text className={classes.separator}>•</Text>
                            <Text className={classes.releaseDate}>{library?.artists.length || "0"} előadó</Text>
                        </div>
                    </div>
                </button>
            </li>
            {releases.map((release) => {
                return <li key={release.directory}>
                    <button>
                        <Image className={classes.smallImage} src={`${process.env.API}/${release.cover}`} alt={release.title} width={64} height={64} />
                        <div className={classes.releaseInfo}>
                            <Text className={classes.releaseTitle}>{release.title}</Text>
                            <div>
                                <Text className={classes.releaseArtist}>{release.artist.name}</Text>
                                <Text className={classes.separator}>•</Text>
                                <Text className={classes.releaseDate}>{release.date}</Text>
                            </div>
                        </div>
                    </button>
                </li>
            })}
        </ul>
    </nav>
}