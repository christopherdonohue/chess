const pieces = {
  rook: {
    name: 'Rook',
    letter: 'R',
    directions: ['horizontal', 'vertical'],
    spacesCanMove: 'unlimited',
    blackAvailable: 2,
    whiteAvailable: 2,
  },

  knight: {
    name: 'Knight',
    letter: 'K',
    directions: ['knight'],
    spacesCanMove: 3,
    blackAvailable: 2,
    whiteAvailable: 2,
  },

  bishop: {
    name: 'Bishop',
    letter: 'B',
    directions: ['diagonal'],
    spacesCanMove: 'unlimited',
    blackAvailable: 2,
    whiteAvailable: 2,
    moveSet: [7, 9],
  },

  queen: {
    name: 'Queen',
    letter: 'Q',
    directions: ['diagonal', 'horizontal', 'vertical'],
    spacesCanMove: 'unlimited',
    blackAvailable: 1,
    whiteAvailable: 1,
  },

  king: {
    name: 'King',
    letter: 'X',
    directions: ['diagonal', 'horizontal', 'vertical'],
    spacesCanMove: 1,
    blackAvailable: 1,
    whiteAvailable: 1,
  },

  pawn: {
    name: 'Pawn',
    letter: 'P',
    directions: ['diagonal', 'vertical'],
    spacesCanMove: 1,
    blackAvailable: 8,
    whiteAvailable: 8,
    moveSet: 8,
    cannotMoveBackwards: true,
  },
};

let currentPiece = {
  html: '',
  ref: null,
};

let pieceHtml;
let currentlyHoldingPiece;
let squaresItCanMoveTo;
let squaresItCanMoveToObj = { sequence: [], enemies: [] };
let allAvailableSquaresFound = false;

const findPiece = (pieceToFind) => {
  let pieceFound;
  for (const piece in pieces) {
    if (pieces[piece].letter === pieceToFind) {
      pieceFound = pieces[piece];
    }
  }
  return pieceFound;
};

const findAllAvailableSquares = (counter, direction, pieceColor = '') => {
  // squaresItCanMoveTo = currentPiece.html.parentNode.parentNode;
  let tempCounter = counter;
  let tempDirection = direction;
  let tempPieceColor = pieceColor;
  let topOrBottomWall = false;
  let leftOrRightWall = false;
  let endOfBoard = false;
  while (counter > 0) {
    if (pieceColor.includes('white')) {
      if (
        (direction === 'topLeft' ||
          direction === 'topRight' ||
          direction === 'forward' ||
          direction === 'left') &&
        squaresItCanMoveTo.previousSibling
      ) {
        squaresItCanMoveTo = squaresItCanMoveTo.previousSibling;
      } else if (!squaresItCanMoveTo.previousSibling) {
        endOfBoard = true;
      }
      if (
        (direction === 'bottomLeft' ||
          direction === 'bottomRight' ||
          direction === 'right' ||
          direction === 'backward') &&
        squaresItCanMoveTo.nextSibling
      ) {
        endOfBoard = false;
        squaresItCanMoveTo = squaresItCanMoveTo.nextSibling;
      } else if (!squaresItCanMoveTo.nextSibling) {
        endOfBoard = true;
      }
    } else if (pieceColor.includes('black')) {
      if (
        (direction === 'topLeft' ||
          direction === 'topRight' ||
          direction === 'forward' ||
          direction === 'left') &&
        squaresItCanMoveTo.nextSibling
      ) {
        squaresItCanMoveTo = squaresItCanMoveTo.nextSibling;
      } else if (!squaresItCanMoveTo.nextSibling) {
        endOfBoard = true;
      }
      if (
        (direction === 'bottomRight' ||
          direction === 'bottomLeft' ||
          direction === 'right' ||
          direction === 'backward') &&
        squaresItCanMoveTo.previousSibling
      ) {
        endOfBoard = false;
        squaresItCanMoveTo = squaresItCanMoveTo.previousSibling;
      } else if (!squaresItCanMoveTo.previousSibling) {
        endOfBoard = true;
      }
    }
    counter--;
  }

  squaresItCanMoveToObj[direction] = squaresItCanMoveTo;

  if (
    !squaresItCanMoveToObj[direction].childNodes[0].innerText &&
    !endOfBoard
  ) {
    if (pieceColor.includes('Pawn') && direction === 'forward') {
      squaresItCanMoveToObj[direction].classList.add('movable');
      squaresItCanMoveToObj.sequence.push(squaresItCanMoveToObj[direction]);
    } else if (!pieceColor.includes('Pawn') && !pieceColor.includes('Knight')) {
      squaresItCanMoveToObj[direction].classList.add('movable');
      squaresItCanMoveToObj.sequence.push(squaresItCanMoveToObj[direction]);
      if (!squaresItCanMoveToObj[direction].classList.contains('wall')) {
        // console.log(currentPiece.html.parentNode.parentNode.classList);
        findAllAvailableSquares(tempCounter, tempDirection, tempPieceColor);
      } else if (
        currentPiece.html.parentNode.parentNode.classList.contains('wall') &&
        squaresItCanMoveToObj[direction].classList.contains('wall') &&
        (direction === 'forward' ||
          direction === 'backward' ||
          direction === 'left' ||
          direction === 'right')
      ) {
        if (
          squaresItCanMoveToObj[direction].classList.contains('top-wall') ||
          squaresItCanMoveToObj[direction].classList.contains('bottom-wall')
        ) {
          topOrBottomWall = true;
          if (
            (direction === 'left' || direction === 'right') &&
            !squaresItCanMoveToObj[direction].classList.contains('left-wall') &&
            !squaresItCanMoveToObj[direction].classList.contains('right-wall')
          ) {
            findAllAvailableSquares(tempCounter, tempDirection, tempPieceColor);
          }
        }
        !topOrBottomWall &&
          direction !== 'left' &&
          direction !== 'right' &&
          findAllAvailableSquares(tempCounter, tempDirection, tempPieceColor);
      }
    } else if (pieceColor.includes('Knight')) {
      // console.log('knight...');
      squaresItCanMoveToObj[direction].classList.add('movable');
      squaresItCanMoveToObj.sequence.push(squaresItCanMoveToObj[direction]);
    }
  } else if (
    squaresItCanMoveToObj[direction].childNodes[0].innerText &&
    squaresItCanMoveToObj[direction].childNodes[0].childNodes[0] &&
    !squaresItCanMoveToObj[
      direction
    ].childNodes[0].childNodes[0].classList.contains(pieceColor.substring(0, 5))
  ) {
    if (pieceColor.includes('Pawn') && direction !== 'forward') {
      squaresItCanMoveToObj[direction].classList.add('enemy');
      squaresItCanMoveToObj[direction].classList.add('can-be-killed');
      squaresItCanMoveToObj.enemies.push(squaresItCanMoveToObj[direction]);
    } else if (!pieceColor.includes('Pawn') && !endOfBoard) {
      squaresItCanMoveToObj[direction].classList.add('enemy');
      squaresItCanMoveToObj[direction].classList.add('can-be-killed');
      squaresItCanMoveToObj.enemies.push(squaresItCanMoveToObj[direction]);
    }
  }

  squaresItCanMoveTo = currentPiece.html.parentNode.parentNode;
};

const movePiece = (squares, currentPiece) => {
  currentPiece.ref.directions.forEach((direction) => {
    //// console.log(direction);
    if (!allAvailableSquaresFound) {
      squaresItCanMoveTo = currentPiece.html.parentNode.parentNode;
      if (direction === 'diagonal') {
        if (currentPiece.html.classList.contains('black')) {
          if (
            !currentPiece.html.parentNode.parentNode.classList.contains(
              'right-wall'
            )
          ) {
            findAllAvailableSquares(
              9,
              'topLeft',
              currentPiece.ref.cannotMoveBackwards ? 'blackPawn' : 'black'
            );
          }
          if (
            !currentPiece.html.parentNode.parentNode.classList.contains(
              'left-wall'
            )
          ) {
            findAllAvailableSquares(
              7,
              'topRight',
              currentPiece.ref.cannotMoveBackwards ? 'blackPawn' : 'black'
            );
          }
          if (!currentPiece.ref.cannotMoveBackwards) {
            if (
              !currentPiece.html.parentNode.parentNode.classList.contains(
                'left-wall'
              )
            ) {
              findAllAvailableSquares(9, 'bottomLeft', 'black');
            }
            if (
              !currentPiece.html.parentNode.parentNode.classList.contains(
                'right-wall'
              )
            ) {
              findAllAvailableSquares(7, 'bottomRight', 'black');
            }
          }
        }

        if (currentPiece.html.classList.contains('white')) {
          if (
            !currentPiece.html.parentNode.parentNode.classList.contains(
              'left-wall'
            )
          ) {
            findAllAvailableSquares(
              9,
              'topLeft',
              currentPiece.ref.cannotMoveBackwards ? 'whitePawn' : 'white'
            );
          }
          if (
            !currentPiece.html.parentNode.parentNode.classList.contains(
              'right-wall'
            )
          ) {
            findAllAvailableSquares(
              7,
              'topRight',
              currentPiece.ref.cannotMoveBackwards ? 'whitePawn' : 'white'
            );
          }
          if (!currentPiece.ref.cannotMoveBackwards) {
            if (
              !currentPiece.html.parentNode.parentNode.classList.contains(
                'right-wall'
              )
            ) {
              findAllAvailableSquares(9, 'bottomLeft', 'white');
            }
            if (
              !currentPiece.html.parentNode.parentNode.classList.contains(
                'left-wall'
              )
            ) {
              findAllAvailableSquares(7, 'bottomRight', 'white');
            }
          }
        }
        allAvailableSquaresFound = false;
      } else if (direction === 'horizontal') {
        if (currentPiece.html.classList.contains('black')) {
          if (
            !currentPiece.html.parentNode.parentNode.classList.contains(
              'right-wall'
            )
          ) {
            findAllAvailableSquares(1, 'left', 'black');
          }
          if (
            !currentPiece.html.parentNode.parentNode.classList.contains(
              'left-wall'
            )
          ) {
            findAllAvailableSquares(1, 'right', 'black');
          }
        }
        if (currentPiece.html.classList.contains('white')) {
          if (
            !currentPiece.html.parentNode.parentNode.classList.contains(
              'left-wall'
            )
          ) {
            findAllAvailableSquares(1, 'left', 'white');
          }
          if (
            !currentPiece.html.parentNode.parentNode.classList.contains(
              'right-wall'
            )
          ) {
            findAllAvailableSquares(1, 'right', 'white');
          }
        }

        allAvailableSquaresFound = false;
      } else if (direction === 'vertical') {
        if (currentPiece.ref.cannotMoveBackwards) {
          if (currentPiece.html.classList.contains('black')) {
            findAllAvailableSquares(8, 'forward', 'blackPawn');
          }
          if (currentPiece.html.classList.contains('white')) {
            findAllAvailableSquares(8, 'forward', 'whitePawn');
          }
        } else {
          currentPiece.html.classList.contains('black') &&
            findAllAvailableSquares(8, 'forward', 'black');
          currentPiece.html.classList.contains('white') &&
            findAllAvailableSquares(8, 'forward', 'white');
          currentPiece.html.classList.contains('black') &&
            findAllAvailableSquares(8, 'backward', 'black');
          currentPiece.html.classList.contains('white') &&
            findAllAvailableSquares(8, 'backward', 'white');
        }
        allAvailableSquaresFound = false;
      } else if (direction === 'knight') {
        if (currentPiece.html.classList.contains('black')) {
          if (
            !currentPiece.html.parentNode.parentNode.classList.contains(
              'left-wall'
            )
          ) {
            findAllAvailableSquares(15, 'topLeft', 'blackKnight');
            findAllAvailableSquares(17, 'bottomRight', 'blackKnight');
            if (
              !currentPiece.html.parentNode.parentNode.previousSibling.classList.contains(
                'left-wall'
              )
            ) {
              findAllAvailableSquares(6, 'topLeft', 'blackKnight');
              findAllAvailableSquares(10, 'bottomRight', 'blackKnight');
            }
          }
          if (
            currentPiece.html.parentNode.parentNode.nextSibling &&
            !currentPiece.html.parentNode.parentNode.nextSibling.classList.contains(
              'right-wall'
            ) &&
            !currentPiece.html.parentNode.parentNode.classList.contains(
              'right-wall'
            )
          ) {
            findAllAvailableSquares(10, 'topLeft', 'blackKnight');
            findAllAvailableSquares(6, 'bottomRight', 'blackKnight');
          }
          if (
            !currentPiece.html.parentNode.parentNode.classList.contains(
              'right-wall'
            )
          ) {
            findAllAvailableSquares(17, 'topLeft', 'blackKnight');
            findAllAvailableSquares(15, 'bottomRight', 'blackKnight');
          }
        } else if (currentPiece.html.classList.contains('white')) {
          if (
            !currentPiece.html.parentNode.parentNode.classList.contains(
              'left-wall'
            )
          ) {
            findAllAvailableSquares(17, 'topLeft', 'whiteKnight');
          }
          if (
            currentPiece.html.parentNode.parentNode.previousSibling &&
            !currentPiece.html.parentNode.parentNode.previousSibling.classList.contains(
              'left-wall'
            ) &&
            !currentPiece.html.parentNode.parentNode.classList.contains(
              'left-wall'
            )
          ) {
            findAllAvailableSquares(10, 'topLeft', 'whiteKnight');
          }
          if (
            !currentPiece.html.parentNode.parentNode.nextSibling.classList.contains(
              'right-wall'
            ) &&
            !currentPiece.html.parentNode.parentNode.classList.contains(
              'right-wall'
            )
          ) {
            // console.log(currentPiece.html.parentNode.parentNode.nextSibling);
            findAllAvailableSquares(6, 'topRight', 'whiteKnight');
            findAllAvailableSquares(10, 'bottomRight', 'whiteKnight');
          }
          if (
            !currentPiece.html.parentNode.parentNode.classList.contains(
              'right-wall'
            )
          ) {
            findAllAvailableSquares(15, 'topRight', 'whiteKnight');
          }
          if (
            currentPiece.html.parentNode.parentNode.previousSibling &&
            !currentPiece.html.parentNode.parentNode.previousSibling.classList.contains(
              'left-wall'
            ) &&
            !currentPiece.html.parentNode.parentNode.classList.contains(
              'left-wall'
            )
          ) {
            findAllAvailableSquares(6, 'bottomLeft', 'whiteKnight');
          }
          if (
            !currentPiece.html.parentNode.parentNode.classList.contains(
              'left-wall'
            )
          ) {
            findAllAvailableSquares(15, 'bottomLeft', 'whiteKnight');
          }
          if (
            !currentPiece.html.parentNode.parentNode.classList.contains(
              'right-wall'
            )
          ) {
            // findAllAvailableSquares(10, 'bottomRight', 'whiteKnight');
            findAllAvailableSquares(17, 'bottomRight', 'whiteKnight');
          }
        }
      }
    }
  });
  allAvailableSquaresFound = true;
  // }
};

const newGame = function () {
  const boxArr = [];
  const board = document.createElement('div');

  // prettier-ignore
  const blackPieces = ['R','K','B','Q','X','B','K','R','P','P','P','P','P','P','P','P'];
  const whitePieces = [...blackPieces].reverse();
  let j = 0;
  let k = 0;

  const createBox = (i) => {
    const box = document.createElement('div');
    const pieceContainer = document.createElement('div');
    const dropZone = document.createElement('div');
    dropZone.classList.add('dropZone');
    pieceContainer.draggable = true;
    pieceContainer.classList.add('draggable');

    pieceContainer.addEventListener('dragstart', (e) => {
      currentPiece.ref = findPiece(e.target.innerText);
      currentPiece.html = e.target;
      pieceHtml = e.target;
      //// console.log(currentPiece);
    });

    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      movePiece(boxArr, currentPiece);
    });

    dropZone.addEventListener('dragend', () => {
      // squaresItCanMoveTo.classList.remove('movable');
      squaresItCanMoveToObj.sequence.forEach((domEl) =>
        domEl.classList.remove('movable')
      );

      if (squaresItCanMoveToObj.enemies.length > 0) {
        squaresItCanMoveToObj.enemies.forEach((enemy) => {
          enemy.classList.remove('enemy');
          enemy.classList.remove('can-be-killed');
        });
      }
      // console.log(squaresItCanMoveToObj);
      squaresItCanMoveToObj = { sequence: [], enemies: [] };
      allAvailableSquaresFound = false;
      //currentPiece = {};
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      if (e.target.parentNode.classList.contains('movable')) {
        e.target.appendChild(currentPiece.html);
      }
      if (e.target.parentNode.parentNode.classList.contains('can-be-killed')) {
        e.target.parentNode.appendChild(currentPiece.html);
        e.target.parentNode.parentNode.classList.remove('can-be-killed');
        e.target.parentNode.removeChild(e.target.parentNode.childNodes[0]);
      }
    });

    if (i < 16) {
      pieceContainer.innerText = blackPieces[i];
      pieceContainer.classList.add('black');
      dropZone.appendChild(pieceContainer);
    }

    if (i > 47) {
      pieceContainer.innerText = whitePieces[k];
      pieceContainer.classList.add('white');
      dropZone.appendChild(pieceContainer);
      k++;
    }

    if (i % 8 === 0 && i !== 0) {
      j += 8;
    }

    box.style.backgroundColor = 'lightblue';
    if ((i % 2 === 0 && j % 16 === 0) || (i % 2 === 1 && j % 16 !== 0)) {
      box.style.backgroundColor = 'pink';
    }

    box.classList.add('box');

    box.appendChild(dropZone);
    return box;
  };

  for (let i = 0; i < 64; i++) {
    boxArr.push(createBox(i));
    i === 0 && boxArr[i].classList.add('left-wall');
    i === 63 && boxArr[i].classList.add('right-wall');
    if (i < 8 || i % 8 === 0 || i >= 56) {
      if (i < 8) {
        boxArr[i].classList.add('top-wall');
      }
      if (i !== 0 && i % 8 === 0) {
        boxArr[i - 1].classList.add('wall');
        boxArr[i - 1].classList.add('right-wall');
        boxArr[i].classList.add('left-wall');
      }
      if (i >= 56) {
        boxArr[i].classList.add('bottom-wall');
      }
      boxArr[i].classList.add('wall');
    }
  }

  boxArr.forEach((box) => {
    box.addEventListener('click', () => {
      for (const piece in pieces) {
        if (pieces[piece].letter === box.innerText) {
          // // console.log(pieces[piece]);
        }
      }
    });
    board.appendChild(box);
  });
  board.classList.add('board');
  document.body.appendChild(board);
};

newGame();
