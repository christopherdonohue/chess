const pieces = {
  rook: {
    name: 'Rook',
    letter: 'R',
    directions: ['horizontal', 'vertical'],
    spacesCanMove: 'unlimited',
    blackAvailable: 2,
    whiteAvailable: 2,
    symb: '♜',
    whiteSymb: '♖',
  },

  knight: {
    name: 'Knight',
    letter: 'K',
    directions: ['knight'],
    spacesCanMove: 3,
    blackAvailable: 2,
    whiteAvailable: 2,
    symb: '♞',
    whiteSymb: '♘',
  },

  bishop: {
    name: 'Bishop',
    letter: 'B',
    directions: ['diagonal'],
    spacesCanMove: 'unlimited',
    blackAvailable: 2,
    whiteAvailable: 2,
    symb: '♝',
    whiteSymb: '♗',
  },

  queen: {
    name: 'Queen',
    letter: 'Q',
    directions: ['diagonal', 'horizontal', 'vertical'],
    spacesCanMove: 'unlimited',
    blackAvailable: 1,
    whiteAvailable: 1,
    symb: '♛',
    whiteSymb: '♕',
  },

  king: {
    name: 'King',
    letter: 'X',
    directions: ['diagonal', 'horizontal', 'vertical'],
    spacesCanMove: 1,
    blackAvailable: 1,
    whiteAvailable: 1,
    symb: '♚',
    whiteSymb: '♔',
  },

  pawn: {
    name: 'Pawn',
    letter: 'P',
    directions: ['diagonal', 'vertical'],
    spacesCanMove: 1,
    blackAvailable: 8,
    whiteAvailable: 8,
    moveSet: 8,
    canMoveTwoSpaces: true,
    symb: '♟',
    whiteSymb: '♙',
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
let tempKing;

const findPiece = (pieceToFind) => {
  let pieceFound;
  for (const piece in pieces) {
    if (
      pieces[piece].symb === pieceToFind ||
      pieces[piece].whiteSymb === pieceToFind
    ) {
      pieceFound = pieces[piece];
    }
  }
  return pieceFound;
};

const findAllAvailableSquares = (
  counter,
  direction,
  pieceColor = '',
  seeIfPlayerIsInCheck = false
) => {
  // squaresItCanMoveTo = currentPiece.html.parentNode.parentNode;
  let tempCounter = counter;
  let tempDirection = direction;
  let tempPieceColor = pieceColor;
  let topOrBottomWall = false;
  let leftOrRightWall = false;
  let endOfBoard = false;
  let tempSeeIfPlayerIsInCheck = seeIfPlayerIsInCheck;
  currentPiece.ref.counter = counter;
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
      !seeIfPlayerIsInCheck &&
        squaresItCanMoveToObj[direction].classList.add('movable');
      squaresItCanMoveToObj.sequence.push(squaresItCanMoveToObj[direction]);
      if (currentPiece.html.dataset.canMoveTwoSpaces === 'true') {
        currentPiece.html.dataset.canMoveTwoSpaces = 'false';
        findAllAvailableSquares(
          tempCounter,
          tempDirection,
          tempPieceColor,
          tempSeeIfPlayerIsInCheck
        );
      }
    } else if (!pieceColor.includes('Pawn') && !pieceColor.includes('Knight')) {
      !seeIfPlayerIsInCheck &&
        squaresItCanMoveToObj[direction].classList.add('movable');
      squaresItCanMoveToObj.sequence.push(squaresItCanMoveToObj[direction]);
      if (
        !squaresItCanMoveToObj[direction].classList.contains('wall') &&
        !pieceColor.includes('King')
      ) {
        // console.log(currentPiece.html.parentNode.parentNode.classList);
        findAllAvailableSquares(
          tempCounter,
          tempDirection,
          tempPieceColor,
          tempSeeIfPlayerIsInCheck
        );
      } else if (
        currentPiece.html.parentNode.parentNode.classList.contains('wall') &&
        squaresItCanMoveToObj[direction].classList.contains('wall') &&
        !pieceColor.includes('King') &&
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
            findAllAvailableSquares(
              tempCounter,
              tempDirection,
              tempPieceColor,
              tempSeeIfPlayerIsInCheck
            );
          }
        }
        !topOrBottomWall &&
          direction !== 'left' &&
          direction !== 'right' &&
          findAllAvailableSquares(
            tempCounter,
            tempDirection,
            tempPieceColor,
            tempSeeIfPlayerIsInCheck
          );
      }
    } else if (pieceColor.includes('Knight') || pieceColor.includes('King')) {
      // console.log('knight...');
      if (!seeIfPlayerIsInCheck) {
        squaresItCanMoveToObj[direction].classList.add('movable');
      }
      squaresItCanMoveToObj.sequence.push(squaresItCanMoveToObj[direction]);
    }
  } else if (
    squaresItCanMoveToObj[direction].childNodes[0].innerText &&
    squaresItCanMoveToObj[direction].childNodes[0].childNodes[0] &&
    !squaresItCanMoveToObj[
      direction
    ].childNodes[0].childNodes[0].classList.contains(pieceColor.substring(0, 5))
  ) {
    if (
      pieceColor.includes('Pawn') &&
      (direction === 'topLeft' || direction === 'topRight') &&
      !endOfBoard
    ) {
      if (!seeIfPlayerIsInCheck) {
        squaresItCanMoveToObj[direction].classList.add('enemy');
        squaresItCanMoveToObj[direction].classList.add('can-be-killed');
      }
      squaresItCanMoveToObj.enemies.push(squaresItCanMoveToObj[direction]);
    } else if (!pieceColor.includes('Pawn') && !endOfBoard) {
      if (!seeIfPlayerIsInCheck) {
        squaresItCanMoveToObj[direction].classList.add('enemy');
        squaresItCanMoveToObj[direction].classList.add('can-be-killed');
      }
      squaresItCanMoveToObj.enemies.push(squaresItCanMoveToObj[direction]);
    }
  }

  squaresItCanMoveTo = currentPiece.html.parentNode.parentNode;
};

const movePiece = (currentPiece, seeIfPlayerIsInCheck = false) => {
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
              `black${currentPiece.ref.name}`,
              seeIfPlayerIsInCheck
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
              `black${currentPiece.ref.name}`,
              seeIfPlayerIsInCheck
            );
          }
          if (!currentPiece.ref.cannotMoveBackwards) {
            if (
              !currentPiece.html.parentNode.parentNode.classList.contains(
                'left-wall'
              )
            ) {
              findAllAvailableSquares(
                9,
                'bottomLeft',
                `black${currentPiece.ref.name}`,
                seeIfPlayerIsInCheck
              );
            }
            if (
              !currentPiece.html.parentNode.parentNode.classList.contains(
                'right-wall'
              )
            ) {
              findAllAvailableSquares(
                7,
                'bottomRight',
                `black${currentPiece.ref.name}`,
                seeIfPlayerIsInCheck
              );
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
              `white${currentPiece.ref.name}`,
              seeIfPlayerIsInCheck
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
              `white${currentPiece.ref.name}`,
              seeIfPlayerIsInCheck
            );
          }
          if (!currentPiece.ref.cannotMoveBackwards) {
            if (
              !currentPiece.html.parentNode.parentNode.classList.contains(
                'right-wall'
              )
            ) {
              findAllAvailableSquares(
                9,
                'bottomLeft',
                `white${currentPiece.ref.name}`,
                seeIfPlayerIsInCheck
              );
            }
            if (
              !currentPiece.html.parentNode.parentNode.classList.contains(
                'left-wall'
              )
            ) {
              findAllAvailableSquares(
                7,
                'bottomRight',
                `white${currentPiece.ref.name}`,
                seeIfPlayerIsInCheck
              );
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
            findAllAvailableSquares(
              1,
              'left',
              `black${currentPiece.ref.name}`,
              seeIfPlayerIsInCheck
            );
          }
          if (
            !currentPiece.html.parentNode.parentNode.classList.contains(
              'left-wall'
            )
          ) {
            findAllAvailableSquares(
              1,
              'right',
              `black${currentPiece.ref.name}`,
              seeIfPlayerIsInCheck
            );
          }
        }
        if (currentPiece.html.classList.contains('white')) {
          if (
            !currentPiece.html.parentNode.parentNode.classList.contains(
              'left-wall'
            )
          ) {
            findAllAvailableSquares(
              1,
              'left',
              `white${currentPiece.ref.name}`,
              seeIfPlayerIsInCheck
            );
          }
          if (
            !currentPiece.html.parentNode.parentNode.classList.contains(
              'right-wall'
            )
          ) {
            findAllAvailableSquares(
              1,
              'right',
              `white${currentPiece.ref.name}`,
              seeIfPlayerIsInCheck
            );
          }
        }

        allAvailableSquaresFound = false;
      } else if (direction === 'vertical') {
        // if (currentPiece.ref.cannotMoveBackwards) {
        //   if (currentPiece.html.classList.contains('black')) {
        //     findAllAvailableSquares(8, 'forward', 'blackPawn');
        //   }
        //   if (currentPiece.html.classList.contains('white')) {
        //     findAllAvailableSquares(8, 'forward', 'whitePawn');
        //   }
        // }
        // else {
        currentPiece.html.classList.contains('black') &&
          findAllAvailableSquares(
            8,
            'forward',
            `black${currentPiece.ref.name}`,
            seeIfPlayerIsInCheck
          );
        currentPiece.html.classList.contains('white') &&
          findAllAvailableSquares(
            8,
            'forward',
            `white${currentPiece.ref.name}`,
            seeIfPlayerIsInCheck
          );
        currentPiece.html.classList.contains('black') &&
          findAllAvailableSquares(
            8,
            'backward',
            `black${currentPiece.ref.name}`,
            seeIfPlayerIsInCheck
          );
        currentPiece.html.classList.contains('white') &&
          findAllAvailableSquares(
            8,
            'backward',
            `white${currentPiece.ref.name}`,
            seeIfPlayerIsInCheck
          );
        // }
        allAvailableSquaresFound = false;
      } else if (direction === 'knight') {
        if (currentPiece.html.classList.contains('black')) {
          if (
            !currentPiece.html.parentNode.parentNode.classList.contains(
              'left-wall'
            )
          ) {
            findAllAvailableSquares(
              15,
              'topLeft',
              'blackKnight',
              seeIfPlayerIsInCheck
            );
            findAllAvailableSquares(
              17,
              'bottomRight',
              'blackKnight',
              seeIfPlayerIsInCheck
            );
            if (
              !currentPiece.html.parentNode.parentNode.previousSibling.classList.contains(
                'left-wall'
              )
            ) {
              findAllAvailableSquares(
                6,
                'topLeft',
                'blackKnight',
                seeIfPlayerIsInCheck
              );
              findAllAvailableSquares(
                10,
                'bottomRight',
                'blackKnight',
                seeIfPlayerIsInCheck
              );
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
            findAllAvailableSquares(
              10,
              'topLeft',
              'blackKnight',
              seeIfPlayerIsInCheck
            );
            findAllAvailableSquares(
              6,
              'bottomRight',
              'blackKnight',
              seeIfPlayerIsInCheck
            );
          }
          if (
            !currentPiece.html.parentNode.parentNode.classList.contains(
              'right-wall'
            )
          ) {
            findAllAvailableSquares(
              17,
              'topLeft',
              'blackKnight',
              seeIfPlayerIsInCheck
            );
            findAllAvailableSquares(
              15,
              'bottomRight',
              'blackKnight',
              seeIfPlayerIsInCheck
            );
          }
        } else if (currentPiece.html.classList.contains('white')) {
          if (
            !currentPiece.html.parentNode.parentNode.classList.contains(
              'left-wall'
            )
          ) {
            findAllAvailableSquares(
              17,
              'topLeft',
              'whiteKnight',
              seeIfPlayerIsInCheck
            );
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
            findAllAvailableSquares(
              10,
              'topLeft',
              'whiteKnight',
              seeIfPlayerIsInCheck
            );
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
            findAllAvailableSquares(
              6,
              'topRight',
              'whiteKnight',
              seeIfPlayerIsInCheck
            );
            findAllAvailableSquares(
              10,
              'bottomRight',
              'whiteKnight',
              seeIfPlayerIsInCheck
            );
          }
          if (
            !currentPiece.html.parentNode.parentNode.classList.contains(
              'right-wall'
            )
          ) {
            findAllAvailableSquares(
              15,
              'topRight',
              'whiteKnight',
              seeIfPlayerIsInCheck
            );
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
            findAllAvailableSquares(
              6,
              'bottomLeft',
              'whiteKnight',
              seeIfPlayerIsInCheck
            );
          }
          if (
            !currentPiece.html.parentNode.parentNode.classList.contains(
              'left-wall'
            )
          ) {
            findAllAvailableSquares(
              15,
              'bottomLeft',
              'whiteKnight',
              seeIfPlayerIsInCheck
            );
          }
          if (
            !currentPiece.html.parentNode.parentNode.classList.contains(
              'right-wall'
            )
          ) {
            // findAllAvailableSquares(10, 'bottomRight', 'whiteKnight');
            findAllAvailableSquares(
              17,
              'bottomRight',
              'whiteKnight',
              seeIfPlayerIsInCheck
            );
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
  const mainContainer = document.createElement('section');
  const board = document.createElement('div');
  const enemiesKilledContainerTop = document.createElement('div');
  const enemiesKilledContainerBottom = document.createElement('div');
  // chrome for android needs the separate character colors... setting color = white doesn't work like it does for firefox or safari
  // prettier-ignore
  // prettier-ignore
  const blackPieces = [{letter: 'R', symb: '♜', whiteSymb: '♖'},{letter: 'K', symb: '♞', whiteSymb: '♘'},{letter: 'B', symb: '♝', whiteSymb: '♗'},{letter: 'Q', symb: '♛', whiteSymb: '♕'},{letter: 'X', symb: '♚', whiteSymb: '♔'},{letter: 'B', symb: '♝', whiteSymb: '♗'},{letter: 'K', symb: '♞', whiteSymb: '♘'},{letter: 'R', symb: '♜', whiteSymb: '♖'},{letter: 'P', symb: '♟', whiteSymb: '♙', canMoveTwoSpaces: true},{letter: 'P', symb: '♟', whiteSymb: '♙', canMoveTwoSpaces: true},{letter: 'P', symb: '♟', whiteSymb: '♙', canMoveTwoSpaces: true},{letter: 'P', symb: '♟', whiteSymb: '♙', canMoveTwoSpaces: true},{letter: 'P', symb: '♟', whiteSymb: '♙', canMoveTwoSpaces: true},{letter: 'P', symb: '♟', whiteSymb: '♙', canMoveTwoSpaces: true},{letter: 'P', symb: '♟', whiteSymb: '♙', canMoveTwoSpaces: true},{letter: 'P', symb: '♟', whiteSymb: '♙', canMoveTwoSpaces: true}];
  let whitePieces = [...blackPieces].reverse();
  let j = 0;

  let k = 0;

  const createBox = (i) => {
    const box = document.createElement('div');
    const pieceContainer = document.createElement('div');
    const dropZone = document.createElement('div');
    let pieceMoved = false;

    dropZone.classList.add('dropZone');
    pieceContainer.draggable = true;
    pieceContainer.classList.add('draggable');

    pieceContainer.addEventListener(
      'touchstart',
      (e) => {
        //e.preventDefault();
        currentPiece.ref = findPiece(e.target.innerText);
        currentPiece.ref.pieceColor = e.target.style.color;
        currentPiece.html = e.target;
        pieceHtml = e.target;
        //// console.log(currentPiece);
      },
      false
    );

    pieceContainer.addEventListener('dragstart', (e) => {
      currentPiece.ref = findPiece(e.target.innerText);
      currentPiece.ref.pieceColor = e.target.style.color;
      currentPiece.html = e.target;
      pieceHtml = e.target;
      //// console.log(currentPiece);
    });

    dropZone.addEventListener(
      'touchmove',
      (e) => {
        e.preventDefault();
        // console.log(e.changedTouches);
        movePiece(currentPiece);
      },
      false
    );

    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      movePiece(currentPiece);
    });

    dropZone.addEventListener(
      'touchend',
      (e) => {
        e.preventDefault();
        pieceMoved = false;
        let tempEl = document.elementFromPoint(
          e.changedTouches[0].pageX,
          e.changedTouches[0].pageY
        );
        if (tempEl.parentNode.classList.contains('movable')) {
          tempEl.appendChild(currentPiece.html);
          if (currentPiece.ref.name === 'Pawn') {
            currentPiece.html.dataset.firstMove = 'false';
          }
          pieceMoved = true;
        }
        if (tempEl.parentNode.parentNode.classList.contains('can-be-killed')) {
          tempEl.parentNode.appendChild(currentPiece.html);
          tempEl.parentNode.parentNode.classList.remove('can-be-killed');
          tempEl.classList.remove('draggable');
          tempEl.classList.add('dead-piece');
          if (getComputedStyle(tempEl).color === 'rgb(0, 0, 0)') {
            enemiesKilledContainerBottom.appendChild(
              tempEl.parentNode.removeChild(tempEl.parentNode.childNodes[0])
            );
          } else {
            enemiesKilledContainerTop.appendChild(
              tempEl.parentNode.removeChild(tempEl.parentNode.childNodes[0])
            );
          }
        }
        squaresItCanMoveToObj.sequence.forEach((domEl) =>
          domEl.classList.remove('movable')
        );

        if (squaresItCanMoveToObj.enemies.length > 0) {
          squaresItCanMoveToObj.enemies.forEach((enemy) => {
            enemy.classList.remove('enemy');
            enemy.classList.remove('can-be-killed');
          });
        }

        if (
          !pieceMoved &&
          currentPiece.html.dataset.canMoveTwoSpaces === 'false' &&
          currentPiece.html.dataset.firstMove !== 'false'
        ) {
          console.log('piece didn not move');
          currentPiece.html.dataset.canMoveTwoSpaces = 'true';
        }
        // console.log(squaresItCanMoveToObj);

        // See if player is in check...

        squaresItCanMoveToObj = { sequence: [], enemies: [] };
        allAvailableSquaresFound = false;
        // ********** CHECK IF PLAYER IS IN CHECK **********
        (currentPiece.ref.firstMove === 'false' ||
          currentPiece.ref.name !== 'Pawn') &&
          movePiece(currentPiece, true);
        allAvailableSquaresFound = false;
        const king = squaresItCanMoveToObj.enemies.find(
          (enemy) => enemy.innerText === '♚' || enemy.innerText === '♔'
        );

        if (king) {
          console.log(king.childNodes);
          king.childNodes[0].childNodes[0].classList.add('player-in-check');
          tempKing = king;
        } else if (tempKing) {
          console.log('nope');
          tempKing.childNodes[0].childNodes[0].classList.remove(
            'player-in-check'
          );
        }
      },
      false
    );

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

      if (
        !pieceMoved &&
        currentPiece.html.dataset.canMoveTwoSpaces === 'false' &&
        currentPiece.html.dataset.firstMove !== 'false'
      ) {
        console.log('piece didn not move');
        currentPiece.html.dataset.canMoveTwoSpaces = 'true';
      }
      // console.log(squaresItCanMoveToObj);

      squaresItCanMoveToObj = { sequence: [], enemies: [] };
      allAvailableSquaresFound = false;
      // ********** CHECK IF PLAYER IS IN CHECK **********
      (currentPiece.ref.firstMove === 'false' ||
        currentPiece.ref.name !== 'Pawn') &&
        movePiece(currentPiece, true);
      allAvailableSquaresFound = false;
      const king = squaresItCanMoveToObj.enemies.find(
        (enemy) => enemy.innerText === '♚' || enemy.innerText === '♔'
      );

      if (king) {
        console.log(king.childNodes);
        king.childNodes[0].childNodes[0].classList.add('player-in-check');
        tempKing = king;
      } else if (tempKing) {
        console.log('nope');
        tempKing.childNodes[0].childNodes[0].classList.remove(
          'player-in-check'
        );
      }
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      pieceMoved = false;
      currentPiece.ref.canMoveTwoSpaces = true;
      if (e.target.parentNode.classList.contains('movable')) {
        e.target.appendChild(currentPiece.html);
        if (currentPiece.ref.name === 'Pawn') {
          currentPiece.html.dataset.firstMove = 'false';
        }
        pieceMoved = true;
      }
      if (e.target.parentNode.parentNode.classList.contains('can-be-killed')) {
        e.target.parentNode.appendChild(currentPiece.html);
        if (currentPiece.ref.name === 'Pawn') {
          currentPiece.html.dataset.firstMove = 'false';
        }
        e.target.parentNode.parentNode.classList.remove('can-be-killed');
        e.target.classList.remove('draggable');
        e.target.classList.add('dead-piece');
        if (getComputedStyle(e.target).color === 'rgb(0, 0, 0)') {
          enemiesKilledContainerBottom.appendChild(
            e.target.parentNode.removeChild(e.target.parentNode.childNodes[0])
          );
        } else {
          enemiesKilledContainerTop.appendChild(
            e.target.parentNode.removeChild(e.target.parentNode.childNodes[0])
          );
        }
      }
    });

    if (i < 16) {
      pieceContainer.innerText = blackPieces[i].symb;
      pieceContainer.classList.add('black');
      if (blackPieces[i].letter === 'P') {
        pieceContainer.dataset.canMoveTwoSpaces =
          blackPieces[i].canMoveTwoSpaces;
      }
      dropZone.appendChild(pieceContainer);
    }

    if (i > 47) {
      pieceContainer.innerText = whitePieces[k].whiteSymb;
      pieceContainer.classList.add('white');
      if (whitePieces[k].letter === 'P') {
        pieceContainer.dataset.canMoveTwoSpaces =
          whitePieces[k].canMoveTwoSpaces;
      }
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
    board.appendChild(box);
  });
  mainContainer.classList.add('main-container');
  board.classList.add('board');
  enemiesKilledContainerTop.classList.add(
    'enemies-killed-container',
    'enemies-killed-container-top'
  );
  enemiesKilledContainerBottom.classList.add('enemies-killed-container');
  document.body.appendChild(mainContainer);
  mainContainer.append(
    enemiesKilledContainerTop,
    board,
    enemiesKilledContainerBottom
  );
};

newGame();
