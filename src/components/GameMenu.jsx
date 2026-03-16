import './GameMenu.css'
import {useNavigate } from "react-router-dom"
function GameMenu() {
  const navigate=useNavigate();

  const games = [
    {
      id: 1,
      title: "Memory Game",
      image: "/gamePreviewPic/memoryGame.png",
      link: "/memoryGame",
      available: true
    },
    {
      id: 2,
      title: "Pacman",
      image: "./gamePreviewPic/pacman.png",
      link: "/games/pacman-js/index-pacman.html",
      available: true
    },
    {
      id: 3,
      title: "Poor bunny",
      image: null,
      link: "/games/bunny-js/index-bunny.html",
      available: true
    },
    {
      id: 4,
      title: "Coming Soon",
      image: null,
      available: false
    },
    {
      id: 5,
      title: "Coming Soon",
      image: null,
      available: false
    },
    {
      id: 6,
      title: "Coming Soon",
      image: null,
      available: false
    },
    {
      id: 7,
      title: "Coming Soon",
      image: null,
      available: false
    },
    {
      id: 8,
      title: "Coming Soon",
      image: null,
      available: false
    }
    
  ];

  const openGame = (game) => {
    if (!game.available) return

    if (game.link.startsWith("/games")) {
      window.location.href = game.link
    } else {
      navigate(game.link)
    }
  }

  return (
    <div className="games-page">

      <h1>Mini Games</h1>

      <div className="games-grid">
        {games.map((game) => (
          <div
            key={game.id}
            className={`game-card ${!game.available ? "disabled" : ""}`}
            onClick={() => game.available && openGame(game)}
          >
            {game.available ? (
              <img src={game.image} alt={game.title} />
            ) : (
              <div className="coming-soon">?</div>
            )}

            <div className="game-title">{game.title}</div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default GameMenu;