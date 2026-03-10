import { useEffect, useState } from "react";
import "./MemoryGame.css"

function MemoryGame() {
    const [cards, setCards] = useState([])
    const [gridSize, setGridSize] = useState(4);

    const [flipped, setFlipped] = useState([]);
    const [solved, setSolved] = useState([]);

    const [won,setWon]=useState(false);

    const initializeGame = () => {
        //card=[1,2,3,...gridSize]
        const nrOfCards = gridSize * gridSize;
        const array = [...Array(nrOfCards / 2).keys()].map((n) => n + 1);
        const shuffledArray = [...array, ...array].sort(() => Math.random() - 0.5).map((number, index) => ({ id: index, number }))
        setCards(shuffledArray);

        setFlipped([]);
        setSolved([]);
        setWon(false);

    }

    const handleChange = (e) => {
        let size = Number(e.target.value);
        if (size < 2) setGridSize(2);
        if (size > 10) setGridSize(10);
        if (size % 2 !== 0) setGridSize(size + 1);
        setGridSize(size);
    }

    useEffect(() => {
        initializeGame();
    }, [gridSize])

    useEffect(()=>{
        if(solved.length===gridSize*gridSize)
            setWon(true);
    },[solved])


    const checkMatch =(id1,id2)=>{
        if(cards[id1].number===cards[id2].number)
            return 1;
        else return 0;
    }

    const handleClick = (id) => {
        if(flipped.includes(id)) {
            setFlipped(flipped.filter(f=>f!==id));
            return;
        }
        if(flipped.length===0){
            setFlipped([...flipped,id]);
            return;
        }
        if(flipped.length===1){
            setFlipped([...flipped,id]);
            //check if its match
            if(checkMatch(flipped[0],id)===1)
            {
                setSolved([...solved,id,flipped[0]]);
                setFlipped([]);
                
            }
            else{
                setTimeout(()=>{
                    setFlipped([]);
                },1000)
                
            }
            return;
        }
        

    }

    const isFlipped = (id) => flipped.includes(id) || solved.includes(id);
    const isSolved = (id)=> solved.includes(id);

    const handleReset=()=>{
        initializeGame();
    }


    return <div className="memory-game-page">
        <div className="title">  Memory Game  </div>
        <div className="memory-game-container">

            <div className="container-grid-info">
                <label htmlFor="inputGrid">Grid size:</label>
                <input id="inputGrid" type="number" min="2" max="10" step="2" value={gridSize} onChange={handleChange}></input>
            </div>

            <div className="grid-container-cards"
                style={{
                    gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                    width: `min(100%, ${gridSize * 5.5}rem)`
                }}>
                {cards.map((card) => {

                    return <div className={`card${isFlipped(card.id)? isSolved(card.id)?"-solved":"-flipped":""}`}
                        style={{ padding: `${150 / gridSize}px`,fontWeight:"bold" }}
                        key={card.id} onClick={()=>handleClick(card.id)}
                        
                    >{isFlipped(card.id)?isSolved(card.id)?card.number:card.number:"?"}
                    </div>
                })}
            </div>

            {won && <div className="bounce">You won!</div> }  
            <div className="container-buttons">
                <button className="reset-button" onClick={handleReset}> Reset </button>
            </div>
        </div>
    </div>


}

export default MemoryGame;


//https://santatracker.google.com/matching.html
//https://poki.com/en/g/poor-bunny to do