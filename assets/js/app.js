const board = document.getElementById('js-board')

const createBoard = () => {
  for (let i = 0; i < 9; i++) {
    let square = document.createElement('div')
    let sign = document.createElement('p')

    square.classList.add('square-field')
    square.setAttribute('data-index', i)
    sign.classList.add('sign-text')

    square.appendChild(sign)
    board.appendChild(square)
  }
}

createBoard()
