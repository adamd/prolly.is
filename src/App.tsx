import { useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: #f5f5f5;
`

const QuestionCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
  text-align: center;
`

const Question = styled.h2`
  margin-bottom: 2rem;
  color: #333;
`

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`

const Button = styled.button`
  padding: 1rem 2rem;
  font-size: 1.1rem;
  border: none;
  border-radius: 8px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;
  min-width: 150px;

  &:hover {
    transform: translateY(-2px);
    background-color: #0056b3;
  }

  &:active {
    transform: translateY(0);
  }
`

const CompletionMessage = styled.div`
  margin-top: 1rem;
  font-size: 1.5rem;
  color: #28a745;
  font-weight: bold;
`

const CompletionButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;
`

const CompletionButton = styled(Button)`
  background-color: #6c757d;
  min-width: 120px;
  
  &:hover {
    background-color: #5a6268;
  }
`

interface Game {
  label: string;
  question: string;
  items: string[];
}

const gamesByCategory: Record<string, Game[]> = {
  Sports: [
    { 
      label: "MLB Teams", 
      question: "What is your favorite MLB team?",
      items: [
        "Arizona Diamondbacks",
        "Athletics",
        "Atlanta Braves",
        "Baltimore Orioles",
        "Boston Red Sox",
        "Chicago Cubs",
        "Chicago White Sox",
        "Cincinnati Reds",
        "Cleveland Guardians",
        "Colorado Rockies",
        "Detroit Tigers",
        "Houston Astros",
        "Kansas City Royals",
        "Los Angeles Angels",
        "Los Angeles Dodgers",
        "Miami Marlins",
        "Milwaukee Brewers",
        "Minnesota Twins",
        "New York Mets",
        "New York Yankees",
        "Philadelphia Phillies",
        "Pittsburgh Pirates",
        "San Diego Padres",
        "San Francisco Giants",
        "Seattle Mariners",
        "St. Louis Cardinals",
        "Tampa Bay Rays",
        "Texas Rangers",
        "Toronto Blue Jays",
        "Washington Nationals"
      ]
    },
    { 
      label: "NHL Teams", 
      question: "What is your favorite NHL team?",
      items: [
        "Anaheim Ducks",
        "Arizona Coyotes",
        "Boston Bruins",
        "Buffalo Sabres",
        "Calgary Flames",
        "Carolina Hurricanes",
        "Chicago Blackhawks",
        "Colorado Avalanche",
        "Columbus Blue Jackets",
        "Dallas Stars",
        "Detroit Red Wings",
        "Edmonton Oilers",
        "Florida Panthers",
        "Los Angeles Kings",
        "Minnesota Wild",
        "Montreal Canadiens",
        "Nashville Predators",
        "New Jersey Devils",
        "New York Islanders",
        "New York Rangers",
        "Ottawa Senators",
        "Philadelphia Flyers",
        "Pittsburgh Penguins",
        "San Jose Sharks",
        "Seattle Kraken",
        "St. Louis Blues",
        "Tampa Bay Lightning",
        "Toronto Maple Leafs",
        "Vancouver Canucks",
        "Vegas Golden Knights",
        "Washington Capitals",
        "Winnipeg Jets"
      ]
    },
    { 
      label: "NBA Teams", 
      question: "What is your favorite NBA team?",
      items: [
        "Atlanta Hawks",
        "Boston Celtics",
        "Brooklyn Nets",
        "Charlotte Hornets",
        "Chicago Bulls",
        "Cleveland Cavaliers",
        "Dallas Mavericks",
        "Denver Nuggets",
        "Detroit Pistons",
        "Golden State Warriors",
        "Houston Rockets",
        "Indiana Pacers",
        "Los Angeles Clippers",
        "Los Angeles Lakers",
        "Memphis Grizzlies",
        "Miami Heat",
        "Milwaukee Bucks",
        "Minnesota Timberwolves",
        "New Orleans Pelicans",
        "New York Knicks",
        "Oklahoma City Thunder",
        "Orlando Magic",
        "Philadelphia 76ers",
        "Phoenix Suns",
        "Portland Trail Blazers",
        "Sacramento Kings",
        "San Antonio Spurs",
        "Toronto Raptors",
        "Utah Jazz",
        "Washington Wizards"
      ]
    },
    { 
      label: "NFL Teams", 
      question: "What is your favorite NFL team?",
      items: [
        "Arizona Cardinals",
        "Atlanta Falcons",
        "Baltimore Ravens",
        "Buffalo Bills",
        "Carolina Panthers",
        "Chicago Bears",
        "Cincinnati Bengals",
        "Cleveland Browns",
        "Dallas Cowboys",
        "Denver Broncos",
        "Detroit Lions",
        "Green Bay Packers",
        "Houston Texans",
        "Indianapolis Colts",
        "Jacksonville Jaguars",
        "Kansas City Chiefs",
        "Las Vegas Raiders",
        "Los Angeles Chargers",
        "Los Angeles Rams",
        "Miami Dolphins",
        "Minnesota Vikings",
        "New England Patriots",
        "New Orleans Saints",
        "New York Giants",
        "New York Jets",
        "Philadelphia Eagles",
        "Pittsburgh Steelers",
        "San Francisco 49ers",
        "Seattle Seahawks",
        "Tampa Bay Buccaneers",
        "Tennessee Titans",
        "Washington Commanders"
      ]
    }
  ],
  Food: [
    {
      label: "Sandwiches",
      question: "Which sandwich is your favorite?",
      items: [
        "Turkey",
        "Egg salad",
        "Tuna",
        "Ham",
        "PB&J",
        "Fluffernutter",
        "Grilled cheese",
        "BLT",
        "Pastrami",
        "Lobster roll",
        "Club",
        "Banh mi",
        "Meatball sub",
        "Italian sub",
        "Pulled pork",
        "Roast pork",
        "French dip",
        "Torta",
        "Sloppy joe",
        "Roast beef",
        "Gyro",
        "Fried chicken"
      ]
    },
    {
      label: "Fast Food",
      question: "Where is your favorite drive through?",
      items: [
        "McDonald's",
        "Burger King",
        "Wendy's",
        "Taco Bell",
        "Subway",
        "Chick-fil-A",
        "Starbucks",
        "Dunkin'",
        "Pizza Hut",
        "Domino's",
        "KFC",
        "Popeyes",
        "Chipotle",
        "Panera Bread",
        "Five Guys",
        "In-N-Out Burger",
        "Shake Shack",
        "Arby's",
        "Panda Express",
        "Culver's"
      ]
    }
  ],
  Movies: [
    {
      label: "Classic Films",
      question: "Which classic film is your favorite?",
      items: [
        "Casablanca",
        "The Godfather",
        "Gone with the Wind",
        "Citizen Kane",
        "The Wizard of Oz",
        "Lawrence of Arabia",
        "Psycho",
        "Vertigo",
        "The Sound of Music",
        "Breakfast at Tiffany's",
        "Singin' in the Rain",
        "On the Waterfront",
        "12 Angry Men",
        "Rear Window",
        "To Kill a Mockingbird",
        "The Bridge on the River Kwai",
        "Some Like It Hot",
        "Ben-Hur",
        "All About Eve",
        "Sunset Boulevard"
      ]
    },
    {
      label: "80s Horror",
      question: "Which 80s horror movie scares you the most?",
      items: [
        "The Shining",
        "A Nightmare on Elm Street",
        "Friday the 13th",
        "The Thing",
        "Poltergeist",
        "The Evil Dead",
        "Hellraiser",
        "Child's Play",
        "Fright Night",
        "The Lost Boys",
        "Beetlejuice",
        "Gremlins",
        "The Fly",
        "Pet Sematary",
        "Creepshow",
        "An American Werewolf in London",
        "The Return of the Living Dead",
        "Re-Animator",
        "The Fog",
        "Christine"
      ]
    },
    {
      label: "2000s Oscar Winners",
      question: "Which 2000s Best Picture winner is your favorite?",
      items: [
        "Gladiator",
        "A Beautiful Mind",
        "Chicago",
        "The Lord of the Rings: The Return of the King",
        "Million Dollar Baby",
        "Crash",
        "The Departed",
        "No Country for Old Men",
        "Slumdog Millionaire",
        "The Hurt Locker"
      ]
    }
  ],
  Music: [
    {
      label: "Classic Rock",
      question: "Which classic rock band is your favorite?",
      items: [
        "Led Zeppelin",
        "The Rolling Stones",
        "Pink Floyd",
        "The Beatles",
        "Queen",
        "Eagles",
        "Fleetwood Mac",
        "The Who",
        "Aerosmith",
        "Boston",
        "Lynyrd Skynyrd",
        "Creedence Clearwater Revival",
        "The Doors",
        "Guns N' Roses",
        "Van Halen",
        "Def Leppard",
        "Journey",
        "Foreigner",
        "REO Speedwagon",
        "Styx"
      ]
    },
    {
      label: "90s Alternative",
      question: "Which 90s alternative band rocks your world?",
      items: [
        "Nirvana",
        "Pearl Jam",
        "Soundgarden",
        "Alice in Chains",
        "Red Hot Chili Peppers",
        "Green Day",
        "The Smashing Pumpkins",
        "Radiohead",
        "Oasis",
        "Blur",
        "The Offspring",
        "Weezer",
        "Stone Temple Pilots",
        "Bush",
        "Collective Soul",
        "Live",
        "Third Eye Blind",
        "Matchbox Twenty",
        "Goo Goo Dolls",
        "The Cranberries"
      ]
    },
    {
      label: "Boy Bands",
      question: "Which boy band makes your heart sing?",
      items: [
        "Backstreet Boys",
        "NSYNC",
        "New Kids on the Block",
        "Boyz II Men",
        "98 Degrees",
        "O-Town",
        "LFO",
        "B2K",
        "Dream Street",
        "5ive",
        "Take That",
        "Westlife",
        "Blue",
        "A1",
        "911"
      ]
    }
  ]
}

function getRandomGames(category: string, count: number = 2): Game[] {
  const games = gamesByCategory[category]
  const shuffled = [...games].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

function getRandomItems(items: string[], count: number = 2, exclude: string[] = []): string[] {
  const availableItems = items.filter(item => !exclude.includes(item))
  if (availableItems.length === 0) return []
  const shuffled = [...availableItems].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

function App() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedGames, setSelectedGames] = useState<Game[]>([])
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [currentItems, setCurrentItems] = useState<string[]>([])
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [shownItems, setShownItems] = useState<string[]>([])
  const [isGameComplete, setIsGameComplete] = useState(false)
  
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
    setSelectedGames(getRandomGames(category))
    setSelectedGame(null)
    setCurrentItems([])
    setSelectedItems([])
    setShownItems([])
    setIsGameComplete(false)
  }

  const handleGameSelect = (game: Game) => {
    setSelectedGame(game)
    const initialItems = getRandomItems(game.items)
    setCurrentItems(initialItems)
    setShownItems(initialItems)
    setIsGameComplete(false)
  }

  const handleItemSelect = (item: string) => {
    setSelectedItems(prev => [...prev, item])
    const remainingItems = selectedGame!.items.filter(i => !shownItems.includes(i))
    
    if (remainingItems.length === 0) {
      setIsGameComplete(true)
      return
    }

    const newItem = getRandomItems(selectedGame!.items, 1, [...shownItems])[0]
    setCurrentItems([item, newItem])
    setShownItems(prev => [...prev, newItem])
  }
  
  const [currentQuestion, setCurrentQuestion] = useState({
    text: "Prolly.is time to choose a category",
    options: [
      { text: "Food", action: () => handleCategorySelect("Food") },
      { text: "Sports", action: () => handleCategorySelect("Sports") },
      { text: "Movies", action: () => handleCategorySelect("Movies") },
      { text: "Music", action: () => handleCategorySelect("Music") }
    ]
  })

  const getQuestionText = () => {
    if (isGameComplete) {
      return selectedGame?.question
    }
    if (selectedGame) {
      return selectedGame.question
    }
    if (selectedCategory) {
      return `Let's play ${selectedGames.map(g => g.label).join(' or ')}!`
    }
    return currentQuestion.text
  }

  const handlePlayAgain = () => {
    setSelectedItems([])
    setShownItems([])
    setIsGameComplete(false)
    const initialItems = getRandomItems(selectedGame!.items)
    setCurrentItems(initialItems)
    setShownItems(initialItems)
  }

  const handleNewCategoryGame = () => {
    setSelectedGame(null)
    setCurrentItems([])
    setSelectedItems([])
    setShownItems([])
    setIsGameComplete(false)
  }

  const handleStartOver = () => {
    setSelectedCategory(null)
    setSelectedGames([])
    setSelectedGame(null)
    setCurrentItems([])
    setSelectedItems([])
    setShownItems([])
    setIsGameComplete(false)
  }

  return (
    <Container>
      <QuestionCard>
        <Question>{getQuestionText()}</Question>
        {isGameComplete ? (
          <>
            <Button 
              style={{
                backgroundColor: '#28a745',
                fontSize: '1.5rem',
                padding: '1.5rem 3rem'
              }}
            >
              Is it {selectedItems[selectedItems.length - 1]}?
            </Button>
            <CompletionMessage>Prolly.is!</CompletionMessage>
            <CompletionButtonContainer>
              <CompletionButton onClick={handlePlayAgain}>
                Play Again
              </CompletionButton>
              <CompletionButton onClick={handleNewCategoryGame}>
                New {selectedCategory}
              </CompletionButton>
              <CompletionButton onClick={handleStartOver}>
                Start Over
              </CompletionButton>
            </CompletionButtonContainer>
          </>
        ) : (
          <ButtonContainer>
            {selectedGame ? (
              currentItems.map((item, index) => (
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
            ) : selectedCategory ? (
              selectedGames.map((game, index) => (
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
              currentQuestion.options.map((option, index) => (
                <Button 
                  key={index} 
                  onClick={option.action}
                  style={{
                    backgroundColor: selectedCategory === option.text ? '#0056b3' : '#007bff'
                  }}
                >
                  {option.text}
                </Button>
              ))
            )}
          </ButtonContainer>
        )}
      </QuestionCard>
    </Container>
  )
}

export default App
