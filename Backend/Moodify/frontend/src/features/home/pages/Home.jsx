import React from 'react'
import FaceExpression from '../../Expression/components/FaceExpression'
import Player from '../components/Player'
import '../styles/home.scss'

const Home = () => {
  return (
    <div className='home-page'>
      <div className='home-page__hero'>
        <div>
          <p className='home-page__eyebrow'>Moodify • premium listening</p>
          <h1>Feel it, scan it, play it.</h1>
          <p>Let your expression shape a calm, elevated soundtrack in seconds.</p>
        </div>
      </div>

      <div className='home-page__content'>
        <FaceExpression />
        <Player />
      </div>
    </div>
  )
}

export default Home