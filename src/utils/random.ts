import { Game } from '../types/game'
import { gamesByCategory } from '../data/games'

export function getRandomGames(category: string, count: number = 2): Game[] {
  const games = gamesByCategory[category]
  if (!games) return []
  
  const shuffled = [...games].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export function getRandomItems(items: string[], count: number = 2, exclude: string[] = [], debug: boolean = false): string[] {
  const availableItems = items.filter(item => !exclude.includes(item))
  const result: string[] = []
  const usedIndices = new Set<number>()

  while (result.length < count && result.length < availableItems.length) {
    const randomIndex = Math.floor(Math.random() * availableItems.length)
    if (!usedIndices.has(randomIndex)) {
      usedIndices.add(randomIndex)
      result.push(availableItems[randomIndex])
    }
  }

  debug && console.log('getRandomItems:', {
    input: items,
    count,
    exclude,
    result,
    hasDuplicates: result.length !== new Set(result).size
  })

  return result
} 