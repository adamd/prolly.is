import { Game } from '../types/game'
import { gamesByCategory } from '../data/games'

export function getRandomGames(category: string, count: number = 2): Game[] {
  const games = gamesByCategory[category]
  if (!games) return []
  
  const shuffled = [...games].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export function getRandomItems(items: string[], count: number = 2, exclude: string[] = []): string[] {
  const availableItems = items.filter(item => !exclude.includes(item))
  if (availableItems.length === 0) return []
  const shuffled = [...availableItems].sort(() => Math.random() - 0.5)
  const result = shuffled.slice(0, count)
  console.log('getRandomItems called from:', new Error().stack?.split('\n')[2])
  console.log('getRandomItems:', {
    input: items,
    count,
    exclude,
    result,
    hasDuplicates: new Set(result).size !== result.length
  })
  return result
} 