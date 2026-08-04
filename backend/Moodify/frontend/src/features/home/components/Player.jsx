import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { SongContext } from '../song.context'
import '../styles/player.scss'

const Player = () => {
  const { song } = useContext(SongContext)
  const audioRef = useRef(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [speed, setSpeed] = useState(1)
  const [trackLabel, setTrackLabel] = useState('Ready')

  const playlist = useMemo(() => [
    { id: 1, title: song?.title || 'Studio mood' },
    { id: 2, title: 'Mood loop' }
  ], [song?.title])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !song?.url) return

    audio.src = song.url
    audio.load()
    setIsPlaying(false)
    setProgress(0)
    setDuration(0)
    setTrackLabel(song.title || 'Mood track')
  }, [song?.url, song?.title])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateProgress = () => setProgress(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const handleEnd = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', updateProgress)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', handleEnd)

    return () => {
      audio.removeEventListener('timeupdate', updateProgress)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', handleEnd)
    }
  }, [song?.url])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed
    }
  }, [speed])

  const formatTime = (value) => {
    if (!Number.isFinite(value)) return '0:00'
    const minutes = Math.floor(value / 60)
    const seconds = Math.floor(value % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const togglePlayback = async () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
      return
    }

    try {
      await audio.play()
      setIsPlaying(true)
    } catch (error) {
      console.error(error)
    }
  }

  const handleSeek = (event) => {
    const audio = audioRef.current
    if (!audio) return

    audio.currentTime = Number(event.target.value)
    setProgress(Number(event.target.value))
  }

  const shiftTime = (seconds) => {
    const audio = audioRef.current
    if (!audio) return

    const nextTime = Math.max(0, Math.min(audio.duration || 0, audio.currentTime + seconds))
    audio.currentTime = nextTime
    setProgress(nextTime)
  }

  const handlePrevious = () => {
    const audio = audioRef.current
    if (!audio) return

    audio.currentTime = 0
    setProgress(0)
    setTrackLabel(playlist[0].title)
  }

  const handleNext = () => {
    const audio = audioRef.current
    if (!audio) return

    audio.currentTime = 0
    setProgress(0)
    setTrackLabel(playlist[1].title)
  }

  const changeSpeed = () => {
    const speeds = [0.75, 1, 1.25, 1.5]
    const nextIndex = (speeds.indexOf(speed) + 1) % speeds.length
    setSpeed(speeds[nextIndex])
  }

  return (
    <div className='player-card'>
      <div className='player-card__cover'>
        <img src={song?.posterImage || 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=80'} alt={song?.title || 'Mood cover'} />
        <span className='player-card__badge'>{song?.mood || 'curated'}</span>
      </div>

      <div className='player-card__content'>
        <p className='player-card__eyebrow'>Now playing</p>
        <h3>{song?.title || 'Moodify playlist'}</h3>
        <p className='player-card__subtitle'>Premium mix for your detected mood.</p>

        <div className='player-card__timeline'>
          <span>{formatTime(progress)}</span>
          <input type='range' min='0' max={duration || 1} value={progress} onChange={handleSeek} />
          <span>{formatTime(duration)}</span>
        </div>

        <div className='player-card__controls'>
          <button type='button' onClick={handlePrevious}>⏮</button>
          <button type='button' onClick={() => shiftTime(-10)}>⏪</button>
          <button type='button' className='player-card__play' onClick={togglePlayback}>
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button type='button' onClick={() => shiftTime(10)}>⏩</button>
          <button type='button' onClick={handleNext}>⏭</button>
        </div>

        <div className='player-card__footer'>
          <button type='button' onClick={changeSpeed}>Speed {speed.toFixed(2)}×</button>
          <span>{trackLabel}</span>
        </div>
      </div>

      <audio ref={audioRef} />
    </div>
  )
}

export default Player