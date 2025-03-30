import { useEffect, useReducer, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ReactConfetti from 'react-confetti'
import type { Game as GameType, GameState, GameAction, Category } from '../types/game'
import { gamesByCategory } from '../data/games'
import { getRandomGames, getRandomItems } from '../utils/random'
import {
  Container,
  QuestionCard,
  Question,
  ButtonContainer,
  Button,
  CompletionMessage,
  CompletionButtonContainer,
  CompletionButton,
  ConfettiContainer
} from '../styles/components'

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
  }
}

function gameReducer(state: GameState, action: GameAction): GameState {
  console.log('Reducer action:', action.type)
  switch (action.type) {
    case 'SELECT_CATEGORY': {
      console.log('SELECT_CATEGORY case')
      return {
        ...state,
        selectedCategory: action.category,
        selectedGames: action.selectedGames,
        selectedGame: null,
        currentItems: [],
        selectedItems: [],
        shownItems: [],
        isGameComplete: false
      }
    }
    case 'SELECT_GAME': {
      console.log('SELECT_GAME case')
      return {
        ...state,
        selectedGame: action.game,
        currentItems: action.initialItems,
        shownItems: action.initialItems,
        selectedItems: [],
        isGameComplete: false
      }
    }
    case 'SELECT_ITEM':
      console.log('SELECT_ITEM case')
      const remainingItems = state.selectedGame!.items.filter(i => !state.shownItems.includes(i))
      if (remainingItems.length === 0) {
        return {
          ...state,
          selectedItems: [...state.selectedItems, action.item],
          isGameComplete: true
        }
      }
      const newItem = getRandomItems(state.selectedGame!.items, 1, [...state.shownItems])[0]
      return {
        ...state,
        selectedItems: [...state.selectedItems, action.item],
        currentItems: [action.item, newItem],
        shownItems: [...state.shownItems, newItem]
      }
    case 'PLAY_AGAIN':
      console.log('PLAY_AGAIN case')
      const newItems = getRandomItems(state.selectedGame!.items)
      return {
        ...state,
        selectedItems: [],
        shownItems: newItems,
        isGameComplete: false,
        currentItems: newItems
      }
    case 'NEW_CATEGORY_GAME':
      console.log('NEW_CATEGORY_GAME case')
      return {
        ...state,
        selectedGame: null,
        currentItems: [],
        selectedItems: [],
        shownItems: [],
        isGameComplete: false
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
  const [state, dispatch] = useReducer(gameReducer, initialState)
  const lastUrlRef = useRef<string>('')

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
    if (!category) return

    const currentUrl = `${category}-${game || ''}`
    if (currentUrl === lastUrlRef.current) {
      console.log('Skipping effect for same URL')
      return
    }
    lastUrlRef.current = currentUrl

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
        const initialItems = getRandomItems(targetGame.items)
        dispatch({ 
          type: 'SELECT_GAME', 
          game: targetGame,
          initialItems 
        })
      }
    } else {
      const selectedGames = getRandomGames(correctCategory)
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
    dispatch({ type: 'SELECT_ITEM', item })
  }

  const handlePlayAgain = () => {
    dispatch({ type: 'PLAY_AGAIN' })
  }

  const handleNewCategoryGame = () => {
    dispatch({ type: 'NEW_CATEGORY_GAME' })
    navigate(`/${state.selectedCategory?.toLowerCase()}`)
  }

  const handleStartOver = () => {
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
      return `Let's play ${state.selectedGames.map(g => g.label).join(' or ')}!`
    }
    return "Prolly.is time to choose a category"
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
        <Question>{getQuestionText()}</Question>
        {state.isGameComplete ? (
          <>
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
          <ButtonContainer>
            {state.selectedGame ? (
              state.currentItems.map((item, index) => (
                <Button 
                  key={index}
                  onClick={() => handleItemSelect(item)}
                  style={{
                    backgroundColor: '#28a745'
                  }}
                >
                  {item}
                </Button>
              ))
            ) : state.selectedCategory ? (
              state.selectedGames.map((game, index) => (
                <Button 
                  key={index}
                  onClick={() => handleGameSelect(game)}
                  style={{
                    backgroundColor: '#28a745'
                  }}
                >
                  {game.label}
                </Button>
              ))
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
        )}
      </QuestionCard>
    </Container>
  )
} 