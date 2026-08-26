import { createContext, useState } from 'react'

export const SongContext = createContext()

export const SongContextProvider = ({ children }) => {
    const [song, setSong] = useState({
        url: 'https://ik.imagekit.io/fk219/moodify/songs/EMIWAY_BANTAI_-_PRIMO__PROD_BY._EMIWAY_BANTAI___OFFICIAL_MUSIC_VIDEO___CNSTNCY_IJpmO0dHr.mp3',
        title: 'EMIWAY BANTAI - PRIMO | PROD BY. EMIWAY BANTAI | OFFICIAL MUSIC VIDEO | CNSTNCY',
        posterImage: 'https://ik.imagekit.io/fk219/moodify/posters/EMIWAY_BANTAI_-_PRIMO__PROD_BY._EMIWAY_BANTAI___OFFICIAL_MUSIC_VIDEO___CNSTNCY_7FydEguul.jpeg',
        mood: 'surprised'
    })
    const [loading, setLoading] = useState(false)

    return(
        <SongContext.Provider value={{ song, setSong, loading, setLoading }}>
            {children}
        </SongContext.Provider>
    )
}