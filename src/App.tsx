import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'
import { Game } from './components/Game'
import { useEffect } from 'react'
import styled from 'styled-components'
import { StreakProvider, useStreak } from './context/StreakContext'

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

const MainContent = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 0 1rem;
  margin-top: 0.5rem;
`

const AchievementsContainer = styled.div`
  background: white;
  padding: 0.75rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
  border-radius: 10px;
  min-height: 3.5rem;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  pointer-events: none;

  &.visible {
    opacity: 1;
    pointer-events: auto;
  }
`

function AppContent() {
  const navigate = useNavigate()
  const { currentStreak } = useStreak()

  useEffect(() => {
    document.title = "Prolly.is a site to choose this or that"
  }, [])

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault()
    localStorage.removeItem('prolly-game-state')
    navigate('/', { replace: true })
  }

  const getStreakMessage = (count: number) => {
    switch (count) {
      case 3:
        return '📈 STREAK 3️⃣❗'
      case 7:
        return '🔥 STREAK 7️⃣❗'
      case 10:
        return '🌟 STREAK 1️⃣0️⃣❗'
      case 15:
        return '💫 STREAK 1️⃣5️⃣❗'
      case 20:
        return '⭐ STREAK 2️⃣0️⃣❗'
      case 25:
        return '🎯 STREAK 2️⃣5️⃣❗'
      default:
        return ''
    }
  }

  const isStreakMilestone = (count: number) => {
    return [3, 7, 10, 15, 20, 25].includes(count)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavContainer>
        <NavContent>
          <NavLink to="/" onClick={handleHomeClick}>Prolly.is</NavLink>
        </NavContent>
      </NavContainer>
      <MainContent>
        <AchievementsContainer className={isStreakMilestone(currentStreak.count) ? 'visible' : ''}>
          {getStreakMessage(currentStreak.count)}
        </AchievementsContainer>
        <Routes>
          <Route path="/" element={<Game />} />
          <Route path="/:category" element={<Game />} />
          <Route path="/:category/:game" element={<Game />} />
        </Routes>
      </MainContent>
    </div>
  )
}

function App() {
  return (
    <Router>
      <StreakProvider>
        <AppContent />
      </StreakProvider>
    </Router>
  )
}

export default App