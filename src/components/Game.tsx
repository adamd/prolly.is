import { useEffect, useReducer, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ReactConfetti from 'react-confetti'
import type { Game as GameType, GameState, GameAction, Category } from '../types/game'
import { gamesByCategory } from '../data/games'
import { getRandomGames, getRandomItems } from '../utils/random'
import { useStreak } from '../context/StreakContext'
import {
  Container,
  QuestionCard,
  Question,
  ButtonContainer,
  Button,
  CompletionMessage,
  CompletionButtonContainer,
  CompletionButton,
  ConfettiContainer,
  ReloadButton
} from '../styles/components'
import styled from 'styled-components'

const DEBUG = false // Set to true to enable logging

const initialState: GameState = {
  selectedCategory: null,
  selectedGames: [],
  selectedGame: null,
  currentItems: [],
  selectedItems: [],
  shownItems: [],
  isGameComplete: false,
  windowSize: {
    width: window.innerWidth,
    height: window.innerHeight,
  },
  currentStreak: {
    item: '',
    count: 0
  },
  longestStreak: {
    item: '',
    count: 0
  }
}

const STORAGE_KEY = 'prolly-game-state'

// Load initial state from localStorage if available
const loadInitialState = (): GameState => {
  // Get current URL from window.location
  const path = window.location.pathname
  const savedState = localStorage.getItem(STORAGE_KEY)
  
  if (savedState) {
    try {
      const parsed = JSON.parse(savedState)
      const [_, currentCategory, currentGame] = path.split('/')
      const savedCategory = parsed.selectedCategory?.toLowerCase()
      const savedGame = parsed.selectedGame?.label.toLowerCase().replace(/\s+/g, '-')
      
      // Clear localStorage if we're on a different category or game
      if (currentCategory && savedCategory && currentCategory !== savedCategory) {
        localStorage.removeItem(STORAGE_KEY)
        return initialState
      }
      
      // Only load saved state if we're on the same category and game
      if (currentCategory === savedCategory && (!currentGame || currentGame === savedGame)) {
        return {
          ...initialState,
          windowSize: {
            width: window.innerWidth,
            height: window.innerHeight,
          },
          selectedCategory: parsed.selectedCategory || null,
          selectedGames: parsed.selectedGames || [],
          selectedGame: parsed.selectedGame || null,
          currentItems: parsed.currentItems || [],
          selectedItems: parsed.selectedItems || [],
          shownItems: parsed.shownItems || [],
          isGameComplete: parsed.isGameComplete || false,
          currentStreak: parsed.currentStreak || { item: '', count: 0 },
          longestStreak: parsed.longestStreak || { item: '', count: 0 }
        }
      }
    } catch (e) {
      console.error('Failed to load saved state:', e)
    }
  }
  return initialState
}

// Save only essential game state
const saveGameState = (state: GameState) => {
  const essentialState = {
    selectedCategory: state.selectedCategory,
    selectedGames: state.selectedGames,
    selectedGame: state.selectedGame,
    currentItems: state.currentItems,
    selectedItems: state.selectedItems,
    shownItems: state.shownItems,
    isGameComplete: state.isGameComplete,
    currentStreak: state.currentStreak,
    longestStreak: state.longestStreak
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(essentialState))
}

function gameReducer(state: GameState, action: GameAction): GameState {
  DEBUG && console.log('Reducer action:', action.type)
  switch (action.type) {
    case 'SELECT_CATEGORY': {
      DEBUG && console.log('SELECT_CATEGORY case')
      return {
        ...state,
        selectedCategory: action.category,
        selectedGames: action.selectedGames,
        selectedGame: null,
        currentItems: [],
        selectedItems: [],
        shownItems: [],
        isGameComplete: false,
        currentStreak: {
          item: '',
          count: 0
        },
        longestStreak: {
          item: '',
          count: 0
        }
      }
    }
    case 'SELECT_GAME': {
      DEBUG && console.log('SELECT_GAME case')
      return {
        ...state,
        selectedGame: action.game,
        currentItems: action.initialItems,
        shownItems: action.initialItems,
        selectedItems: [],
        isGameComplete: false,
        currentStreak: {
          item: '',
          count: 0
        },
        longestStreak: {
          item: '',
          count: 0
        }
      }
    }
    case 'SELECT_ITEM': {
      DEBUG && console.log('SELECT_ITEM case')
      const newCurrentStreak = state.currentStreak.item === action.item
        ? { item: action.item, count: state.currentStreak.count + 1 }
        : { item: action.item, count: 1 }

      const newLongestStreak = newCurrentStreak.count > state.longestStreak.count
        ? newCurrentStreak
        : state.longestStreak

      DEBUG && console.log('Streak Update:', {
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak
      })

      if (!action.newItem) {
        return {
          ...state,
          selectedItems: [...state.selectedItems, action.item],
          isGameComplete: true,
          currentStreak: newCurrentStreak,
          longestStreak: newLongestStreak
        }
      }
      return {
        ...state,
        selectedItems: [...state.selectedItems, action.item],
        currentItems: [action.item, action.newItem],
        shownItems: [...state.shownItems, action.newItem],
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak
      }
    }
    case 'PLAY_AGAIN':
      console.log('PLAY_AGAIN case')
      const newItems = getRandomItems(state.selectedGame!.items)
      return {
        ...state,
        selectedItems: [],
        shownItems: newItems,
        isGameComplete: false,
        currentItems: newItems,
        currentStreak: {
          item: '',
          count: 0
        },
        longestStreak: {
          item: '',
          count: 0
        }
      }
    case 'NEW_CATEGORY_GAME':
      console.log('NEW_CATEGORY_GAME case')
      return {
        ...state,
        selectedGame: null,
        currentItems: [],
        selectedItems: [],
        shownItems: [],
        isGameComplete: false,
        currentStreak: {
          item: '',
          count: 0
        },
        longestStreak: {
          item: '',
          count: 0
        }
      }
    case 'START_OVER':
      console.log('START_OVER case')
      return initialState
    case 'UPDATE_WINDOW_SIZE':
      console.log('UPDATE_WINDOW_SIZE case')
      return {
        ...state,
        windowSize: action.size
      }
    default:
      return state
  }
}

export function Game() {
  const navigate = useNavigate()
  const { category, game } = useParams()
  const [state, dispatch] = useReducer(gameReducer, loadInitialState())
  const lastUrlRef = useRef<string>('')
  const { setCurrentStreak } = useStreak()

  // Save state to localStorage whenever it changes
  useEffect(() => {
    saveGameState(state)
    setCurrentStreak(state.currentStreak)
  }, [state, setCurrentStreak])

  useEffect(() => {
    const handleResize = () => {
      dispatch({
        type: 'UPDATE_WINDOW_SIZE',
        size: {
          width: window.innerWidth,
          height: window.innerHeight,
        }
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!category) {
      // Clear localStorage when navigating to home page
      localStorage.removeItem(STORAGE_KEY)
      dispatch({ type: 'START_OVER' })
      return
    }

    const currentUrl = `${category}-${game || ''}`
    if (currentUrl === lastUrlRef.current) {
      DEBUG && console.log('Skipping effect for same URL')
      return
    }
    lastUrlRef.current = currentUrl

    // Clear localStorage when navigating to a new category
    const savedState = localStorage.getItem(STORAGE_KEY)
    if (savedState) {
      const parsed = JSON.parse(savedState)
      if (parsed.selectedCategory?.toLowerCase() !== category.toLowerCase()) {
        localStorage.removeItem(STORAGE_KEY)
      }
    }

    const correctCategory = Object.keys(gamesByCategory).find(
      cat => cat.toLowerCase() === category.toLowerCase()
    ) as Category
    
    if (!correctCategory) return

    // If we have both category and game, select the game
    if (game) {
      const categoryGames = gamesByCategory[correctCategory]
      const targetGame = categoryGames.find(g => 
        g.label.toLowerCase().replace(/\s+/g, '-') === game.toLowerCase()
      )
      if (targetGame) {
        // Only get new random items if we don't have saved state
        const savedState = localStorage.getItem(STORAGE_KEY)
        let initialItems: string[]
        
        if (savedState) {
          const parsed = JSON.parse(savedState)
          if (parsed.selectedGame?.label === targetGame.label) {
            // If we have saved state for this game, use its current items
            initialItems = parsed.currentItems
          } else {
            // If saved state is for a different game, get new items
            initialItems = getRandomItems(targetGame.items, 2, [], DEBUG)
          }
        } else {
          // No saved state, get new items
          initialItems = getRandomItems(targetGame.items, 2, [], DEBUG)
        }
        
        DEBUG && console.log('Dispatching SELECT_GAME for:', targetGame.label)
        dispatch({ 
          type: 'SELECT_GAME', 
          game: targetGame,
          initialItems 
        })
      }
    } else {
      // Only get new random games if we don't have saved state
      const savedState = localStorage.getItem(STORAGE_KEY)
      const selectedGames = savedState 
        ? JSON.parse(savedState).selectedGames
        : getRandomGames(correctCategory)
      
      DEBUG && console.log('Dispatching SELECT_CATEGORY for:', correctCategory)
      dispatch({ 
        type: 'SELECT_CATEGORY', 
        category: correctCategory,
        selectedGames
      })
    }
  }, [category, game])

  const handleCategorySelect = (category: Category) => {
    navigate(`/${category.toLowerCase()}`)
  }

  const handleGameSelect = (game: GameType) => {
    navigate(`/${state.selectedCategory?.toLowerCase()}/${game.label.toLowerCase().replace(/\s+/g, '-')}`)
  }

  const handleItemSelect = (item: string) => {
    if (state.shownItems.length === state.selectedGame!.items.length - 2) {
      dispatch({ type: 'SELECT_ITEM', item })
      return
    }
    const newItem = getRandomItems(state.selectedGame!.items, 1, state.shownItems, DEBUG)[0]
    dispatch({ 
      type: 'SELECT_ITEM', 
      item,
      newItem 
    })
  }

  const handlePlayAgain = () => {
    localStorage.removeItem(STORAGE_KEY)
    dispatch({ type: 'PLAY_AGAIN' })
  }

  const handleNewCategoryGame = () => {
    localStorage.removeItem(STORAGE_KEY)
    dispatch({ type: 'NEW_CATEGORY_GAME' })
    navigate(`/${state.selectedCategory?.toLowerCase()}`)
  }

  const handleStartOver = () => {
    localStorage.removeItem(STORAGE_KEY)
    dispatch({ type: 'START_OVER' })
    navigate('/')
  }

  const getQuestionText = () => {
    if (state.isGameComplete) {
      return state.selectedGame?.question
    }
    if (state.selectedGame) {
      return state.selectedGame.question
    }
    if (state.selectedCategory) {
      return `Choose a ${state.selectedCategory} option`
    }
    return "Prolly.is time to choose a category"
  }

  const handleReloadGames = () => {
    if (!state.selectedCategory) return
    const currentGames = state.selectedGames.map(g => g.label)
    const allGames = gamesByCategory[state.selectedCategory]
    const availableGames = allGames.filter(g => !currentGames.includes(g.label))
    
    if (availableGames.length < 2) {
      // If we don't have enough games to exclude, just get random ones
      const newGames = getRandomGames(state.selectedCategory, 2)
      dispatch({
        type: 'SELECT_CATEGORY',
        category: state.selectedCategory,
        selectedGames: newGames
      })
      return
    }

    // Get two random games from the available ones
    const shuffled = [...availableGames].sort(() => Math.random() - 0.5)
    const newGames = shuffled.slice(0, 2)
    
    dispatch({
      type: 'SELECT_CATEGORY',
      category: state.selectedCategory,
      selectedGames: newGames
    })
  }

  return (
    <Container>
      {state.isGameComplete && (
        <ConfettiContainer>
          <ReactConfetti
            width={state.windowSize.width}
            height={state.windowSize.height}
            recycle={false}
            numberOfPieces={200}
            gravity={0.3}
            colors={['#28a745', '#007bff', '#ffc107', '#dc3545', '#6c757d']}
            onConfettiComplete={() => {
              // Optional: Add any cleanup or additional actions here
            }}
          />
        </ConfettiContainer>
      )}
      <QuestionCard>
        {state.selectedGame ? (
          state.isGameComplete ? (
            <>
              <Question>{state.selectedGame.question}</Question>
              <Button 
                style={{
                  backgroundColor: '#28a745',
                  fontSize: '1.5rem',
                  padding: '1.5rem 3rem'
                }}
              >
                Is it {state.selectedItems[state.selectedItems.length - 1]}?
              </Button>
              <CompletionMessage>Prolly.is!</CompletionMessage>
              <CompletionButtonContainer>
                <CompletionButton onClick={handlePlayAgain}>
                  Play Again
                </CompletionButton>
                <CompletionButton onClick={handleNewCategoryGame}>
                  New {state.selectedCategory}
                </CompletionButton>
                <CompletionButton onClick={handleStartOver}>
                  Start Over
                </CompletionButton>
              </CompletionButtonContainer>
            </>
          ) : (
            <>
              <Question>{state.selectedGame.question}</Question>
              <ButtonContainer>
                {state.currentItems.map((item) => (
                  <Button
                    key={item}
                    onClick={() => {
                      const remainingItems = state.selectedGame!.items.filter(
                        (i) => !state.shownItems.includes(i)
                      )
                      const newItem = getRandomItems(remainingItems, 1, [], DEBUG)[0]
                      dispatch({
                        type: 'SELECT_ITEM',
                        item,
                        newItem,
                      })
                    }}
                  >
                    {item}
                  </Button>
                ))}
              </ButtonContainer>
            </>
          )
        ) : (
          <>
            <Question>{getQuestionText()}</Question>
            <ButtonContainer>
              {state.selectedCategory ? (
                <>
                  {state.selectedGames.map((game, index) => (
                    <Button 
                      key={index}
                      onClick={() => handleGameSelect(game)}
                      style={{
                        backgroundColor: '#28a745'
                      }}
                    >
                      {game.label}
                    </Button>
                  ))}
                  <ReloadButton onClick={handleReloadGames}>
                    🔄 New Options
                  </ReloadButton>
                </>
              ) : (
                Object.keys(gamesByCategory)
                  .filter(cat => cat !== 'Test')
                  .map((category, index) => (
                    <Button 
                      key={index} 
                      onClick={() => handleCategorySelect(category as Category)}
                      style={{
                        backgroundColor: state.selectedCategory === category ? '#0056b3' : '#007bff'
                      }}
                    >
                      {category}
                    </Button>
                  ))
              )}
            </ButtonContainer>
          </>
        )}
      </QuestionCard>
    </Container>
  )
} 