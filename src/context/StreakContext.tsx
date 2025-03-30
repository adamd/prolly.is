import { createContext, useContext, useState, ReactNode } from 'react'

type StreakContextType = {
  currentStreak: {
    item: string
    count: number
  }
  setCurrentStreak: (streak: { item: string; count: number }) => void
}

const StreakContext = createContext<StreakContextType | undefined>(undefined)

export function StreakProvider({ children }: { children: ReactNode }) {
  const [currentStreak, setCurrentStreak] = useState({ item: '', count: 0 })

  return (
    <StreakContext.Provider value={{ currentStreak, setCurrentStreak }}>
      {children}
    </StreakContext.Provider>
  )
}

export function useStreak() {
  const context = useContext(StreakContext)
  if (context === undefined) {
    throw new Error('useStreak must be used within a StreakProvider')
  }
  return context
} 