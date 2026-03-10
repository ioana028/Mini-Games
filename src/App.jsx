import "./App.css";
import {Routes,Route} from "react-router-dom"
import MemoryGame from "./components/MemoryGame"
import GameMenu from "./components/GameMenu";

function App() {

  return(
    <Routes>
      <Route path="/" element={<GameMenu></GameMenu>} ></Route>
      <Route path="/memoryGame" element={<MemoryGame></MemoryGame>}></Route>
    </Routes>
  )
}

export default App;