const board = document.getElementById('js-board')

const createBoard = () => {
  for (let i = 0; i < 9; i++) {
    let square = document.createElement('div')
    square.classList.add('square-field')
    square.setAttribute('data-index', i)

    board.appendChild(square)
  }
}

createBoard()
