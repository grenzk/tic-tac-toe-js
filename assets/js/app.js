const board = document.getElementById('js-board')
const resetBtn = document.getElementById('js-reset-btn')
const undoBtn = document.getElementById('js-undo-btn')
const redoBtn = document.getElementById('js-redo-btn')
const currentIcon = document.getElementById('js-symbol')
const undoIcon = document.querySelector('bx-chevron-left')
const redoIcon = document.querySelector('bx-chevron-right')

const xScore = document.getElementById('js-xScore-text')
const oScore = document.getElementById('js-oScore-text')

const winMessage = document.getElementById('js-win-message')
const historyList = document.getElementById('js-history-list')

let historyState
let currentState
let turn

let historyIndex
let displayData

let scores = {
  X: 0,
  O: 0,
}

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

const enableSquares = () => {
  squares.forEach(square => {
    square.removeAttribute('disabled')
    square.removeAttribute('aria-pressed')
  })
}

const createHistory = (winPatterns, selected) => {
  let li = document.createElement('li')
  let div = document.createElement('div')
  let button = document.createElement('button')

  selected = parseInt(selected)

  let arr = winPatterns.find(winPattern => winPattern.includes(selected))
  let x = winPatterns.indexOf(arr)
  let y = arr.indexOf(selected)

  if (historyState.length > 0) {
    historyState.forEach((move, _index) => {
      button.setAttribute('data-history', `${move.toString()}`)
      button.textContent = `Player ${turn} moves at (${x}, ${y})`

      div.appendChild(li)
      li.appendChild(button)
    })
    historyList.appendChild(div)
  }
}

const renderTurn = square => {
  let text = square.querySelector('.sign-text')

  // Get selected value
  let selected = square.getAttribute('data-index')
  if (!selected) return

  square.setAttribute('disabled', '')
  square.setAttribute('aria-pressed', 'true')

  // Update state
  currentState[selected] = turn
  text.textContent = turn

  historyState.push(currentState.slice())
  createHistory(winPatterns, selected)

  if (checkIfWin()) {
    winMessage.textContent = `Player ${turn} Wins!`
    historyIndex = historyState.length - 1

    scores[turn]++
    updateScores()

    undoBtn.disabled = false

    disableSquares()
    return
  }

  if (checkIfDraw()) {
    winMessage.textContent = `It's a Draw!`
    historyIndex = historyState.length - 1

    undoBtn.disabled = false
    return
  }

  // Update turn
  turn = turn === 'X' ? 'O' : 'X'
  currentIcon.textContent = turn
}

const undo = () => {
  let historyData = document.querySelectorAll('#js-history-list div')

  historyIndex -= 1
  displayData = historyState[historyIndex].flat()

  squares.forEach((square, index) => {
    square.children[0].textContent = displayData[index]
  })

  if (historyIndex <= 0) {
    undoBtn.disabled = true
  }
  if (historyData[historyIndex] !== undefined) {
    redoBtn.disabled = false
  }

  historyData[historyIndex].style.display = 'none'
}

const redo = () => {
  let historyData = document.querySelectorAll('#js-history-list div')

  historyIndex++
  displayData = historyState[historyIndex].flat()

  squares.forEach((square, index) => {
    square.children[0].textContent = displayData[index]
  })

  if (historyData[historyIndex] === undefined) {
    redoBtn.disabled = true
  }

  if (historyIndex > 0) {
    undoBtn.disabled = false
  }

  let redoItem = historyIndex - 1

  historyData[redoItem].style.display = 'block'
}

const updateScores = () => {
  xScore.textContent = scores.X
  oScore.textContent = scores.O
}

const resetGame = () => {
  currentState = boardState()
  historyState = []
  displayData = ''
  historyIndex = ''
  turn = 'X'

  currentIcon.textContent = turn

  if (historyIndex === '') {
    undoBtn.disabled = true
    redoBtn.disabled = true
  }

  historyState.push(boardState())

  winMessage.textContent = ''

  squares.forEach(square => {
    square.children[0].textContent = ''
  })

  historyList.textContent = ''

  enableSquares()
}

resetGame()

document.addEventListener(
  'click',
  e => {
    if (
      e.target.matches('.square-field') &&
      !e.target.hasAttribute('disabled')
    ) {
      renderTurn(e.target)
    }
  },
  false
)

resetBtn.addEventListener('click', resetGame)
undoBtn.addEventListener('click', undo)
redoBtn.addEventListener('click', redo)
