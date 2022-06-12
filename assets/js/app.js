const board = document.getElementById('js-board')

let historyState = []
let currentState
let turn = 'X'

const boardState = () => {
  let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ].flat()

  return board
}

currentState = boardState()

const checkWinner = () => {
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

  let isWinner = winPatterns.filter(winPattern => {
    return (
      currentState[winPattern[0]] &&
      currentState[winPattern[0]] === currentState[winPattern[1]] &&
      currentState[winPattern[1]] === currentState[winPattern[2]]
    )
  })

  return isWinner.length > 0 ? currentState[isWinner[0][0]] : false
}

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

var renderTurn = function (square) {
  let text = square.querySelector('.sign-text')

  // Get selected value
  var selected = square.getAttribute('data-index')
  if (!selected) return

  square.setAttribute('disabled', '')
  square.setAttribute('aria-pressed', 'true')

  // Update state
  currentState[selected] = turn
  text.textContent = turn

  // Update turn
  turn = turn === 'X' ? 'O' : 'X'
}

document.addEventListener(
  'click',
  function (e) {
    // If a .game-square was clicked
    if (
      e.target.matches('.square-field') &&
      !e.target.hasAttribute('disabled')
    ) {
      renderTurn(e.target)
    }
  },
  false
)
