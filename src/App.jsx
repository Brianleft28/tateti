import "./App.css";
import confetti from "canvas-confetti"
import { useState } from 'react';
import { Square } from "./components/Square";
import { TURNS, WINNER_COMBOS } from "./constants";
import { checkWinnerFrom, checkEndGame } from "./logic/board";
import { WinnerModal } from "./components/WinnerModal";
import { saveGameStorage, resetGameStorage } from "./logic/storage";



function App() {
  const [board, setBoard] = useState(()=> {
    console.log('inicializar estado del board')
    const boardFromStorage = window.localStorage.getItem('board')
    return boardFromStorage ? JSON.parse(boardFromStorage) : Array(9).fill(null) 
  }
)
    
  const [turn, setTurn] = useState(() => {
      const turnFromStorage = window.localStorage.getItem('turn') 
      return turnFromStorage ?? TURNS.X
    } 
  )
    

  // null es que no hay ganador, false es empate
  const [winner, setWinner] = useState(null)
  
  // reseteando el juego el juego
  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)

    resetGameStorage()
  }


  const updateBoard = (index) => {
    // no actualizamos esta posicion
    // si ya tiene algo
      if(board[index] || winner) return 
    // actualizar el tablero
      const newBoard = [...board] 
      newBoard[index] = turn // x u o
      setBoard(newBoard)
    //cambiar el turno 
      const newTurn = turn === TURNS.X ?  TURNS.O : TURNS.X
      setTurn(newTurn)
    // guardar partida, el estado del tablero

      saveGameStorage({
        board: newBoard,
        turn: newTurn
      })


    // chequear si hay un ganador 
    const newWinner = checkWinnerFrom(newBoard);
    if(newWinner){
      setWinner(newWinner) // actualiza el estado
      confetti()
      // check if game is over 
    } else if(checkEndGame(newBoard)) {
      setWinner(false)
    }
 
    } 

   
return (
    <main className='board'>
      <h1>Ta-te-ti</h1>
      <button onClick={resetGame}>Reset</button>
      <section className='game'>
        {
          board.map((square, index)=>{
            return (
             <Square
             key={index}
             index={index}
             updateBoard={updateBoard}
             >
              {square}
            </Square>
            )
          })
        }
      </section>
      
      <section className='turn'>
        <Square isSelected={turn === TURNS.X}>
          {TURNS.X} 
        </Square>
        <Square isSelected={turn === TURNS.O}>
          {TURNS.O}
        </Square>
      </section>
     
  
        <WinnerModal
        winner={winner}
        resetGame={resetGame}
        />

    
    </main>
    

    
    )
}

export default App;
