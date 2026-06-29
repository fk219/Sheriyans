import React from 'react'
import '../nav.scss'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {

  const navigate = useNavigate()
  
  return (
    <nav className='navbar'>
      <span className='navbar-brand'>Insta</span>

      <div className='navbar-icons'>
        <button onClick={()=>{navigate('/create-post')}}>
          <svg viewBox="0 0 24 24"><path d="M3 12l9-9 9 9" /><path d="M5 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10" /></svg>
        </button>

        <button>
          <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
        </button>

        <button>
          <div className='navbar-avatar' />
        </button>
      </div>
    </nav>
  )
}

export default Navbar
