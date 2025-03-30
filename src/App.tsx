import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'
import { Game } from './components/Game'
import { useEffect } from 'react'
import styled from 'styled-components'

const NavContainer = styled.nav`
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
`

const NavContent = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: center;
`

const NavLink = styled(Link)`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  text-decoration: none;
  
  &:hover {
    color: #007bff;
  }
`

function AppContent() {
  const navigate = useNavigate()

  useEffect(() => {
    document.title = "Prolly.is a site to choose this or that"
  }, [])

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault()
    localStorage.removeItem('prolly-game-state')
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavContainer>
        <NavContent>
          <NavLink to="/" onClick={handleHomeClick}>Prolly.is</NavLink>
        </NavContent>
      </NavContainer>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Game />} />
          <Route path="/:category" element={<Game />} />
          <Route path="/:category/:game" element={<Game />} />
        </Routes>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
