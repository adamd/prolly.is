import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Game } from './components/Game'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Game />} />
        <Route path="/:category" element={<Game />} />
        <Route path="/:category/:game" element={<Game />} />
      </Routes>
    </Router>
  )
}

export default App
