import {getSong} from '../services/song.api'
import {useContext} from 'react'
import {SongContext} from '../song.context'

const useSong = ({children}) => {

    const context = useContext(SongContext)
    const {loading, setLoading, song, setSong} = context

    const handleGetSong = async ({mood}) => {
        setLoading(true)
        const reposnse = await getSong({mood})
        setSong(response.song)
        setLoading(false)
    }

    return({
        loading, song, handleGetSong
    })
}



