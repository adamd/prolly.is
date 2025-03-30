export interface Game {
  label: string
  question: string
  items: string[]
}

export type Category = string

export type GameState = {
  selectedCategory: Category | null
  selectedGames: Game[]
  selectedGame: Game | null
  currentItems: string[]
  selectedItems: string[]
  shownItems: string[]
  isGameComplete: boolean
  windowSize: {
    width: number
    height: number
  }
}

export type GameAction =
  | { type: 'SELECT_CATEGORY'; category: string; selectedGames: Game[] }
  | { type: 'SELECT_GAME'; game: Game; initialItems: string[] }
  | { type: 'SELECT_ITEM'; item: string; newItem?: string }
  | { type: 'PLAY_AGAIN' }
  | { type: 'NEW_CATEGORY_GAME' }
  | { type: 'START_OVER' }
  | { type: 'UPDATE_WINDOW_SIZE'; size: { width: number; height: number } } 