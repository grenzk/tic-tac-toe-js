const board = document.getElementById('js-board')
const winMessage = document.getElementById('js-win-message')

let historyState = []
let currentState
let turn = 'X'

const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

const boardState = () => {
  let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ].flat()

  return board
}

currentState = boardState()

const createBoard = (() => {
  for (let i = 0; i < 9; i++) {
    let square = document.createElement('div')
    let sign = document.createElement('p')

    square.classList.add('square-field')
    square.setAttribute('data-index', i)
    sign.classList.add('sign-text')

    square.appendChild(sign)
    board.appendChild(square)
  }
})()

const squares = document.querySelectorAll('.square-field')

const checkIfWin = () => {
  return winPatterns.some(winPattern => {
    return winPattern.every(pos => {
      return squares[pos].textContent === turn
    })
  })
}

const checkIfDraw = () => {
  return [...squares].every(square => {
    return square.textContent.includes('X') || square.textContent.includes('O')
  })
}

const disableSquares = () => {
  squares.forEach(square => {
    square.setAttribute('disabled', '')
  })
}

const renderTurn = square => {
  let text = square.querySelector('.sign-text')

  // Get selected value
  var selected = square.getAttribute('data-index')
  if (!selected) return

  square.setAttribute('disabled', '')
  square.setAttribute('aria-pressed', 'true')

  // Update state
  currentState[selected] = turn
  text.textContent = turn

  if (checkIfWin()) {
    winMessage.textContent = `Player ${turn} Wins!`
    disableSquares()
    return
  }

  if (checkIfDraw()) {
    winMessage.textContent = `It's a Draw!`
    return
  }

  // Update turn
  turn = turn === 'X' ? 'O' : 'X'
}

document.addEventListener(
  'click',
  function (e) {
    if (
      e.target.matches('.square-field') &&
      !e.target.hasAttribute('disabled')
    ) {
      renderTurn(e.target)
    }
  },
  false
)
