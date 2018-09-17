module.exports = function solveSudoku(matrix) {
  let emptyPositions = saveEmptyPositions(matrix);

  let row, column, value, found;
  for(let i = 0; i < emptyPositions.length;) {
      row = emptyPositions[i][0];
      column = emptyPositions[i][1];
      value = matrix[row][column] + 1;
      found = false;

      while(!found && value <= 9) {
          if(checkValue(matrix, column, row, value)) {
              found = true;
              matrix[row][column] = value;
              i++;
          } else {
              value++;
          }
      }
      
      if(!found) {
          matrix[row][column] = 0;
          i--;
      }
  }

  return matrix;

  function saveEmptyPositions(matrix) {
      let emptyPositions = [];
  
      for(let i = 0; i < matrix.length; i++) {
          for(let j = 0; j < matrix.length; j++) {
              if(matrix[i][j] === 0) {
                  emptyPositions.push([i, j]);
              }
          }
      }
  
      return emptyPositions;
  }
  
  function checkValue(matrix, column, row, value) {
      if(checkRow(matrix, row, value) && checkColumn(matrix, column, value) && checkSubsquare(matrix, column, row, value)) {
          return true;
      } else {
          return false;
      }
  
      function checkRow(matrix, row, value) {
          for(let i = 0; i < matrix[row].length; i++) {
              if(matrix[row][i] === value) {
                  return false;
              }
          }
          return true;
      }
  
      function checkColumn(matrix, column, value) {
          for(let i = 0; i < matrix.length; i++) {
              if(matrix[i][column] === value) {
                  return false;
              }
          }
          return true;
      }
  
      function checkSubsquare(matrix, column, row, value) {
          let columnCorner = 0, rowCorner = 0, squareSize = 3;
  
          while(column >= columnCorner + squareSize) {
              columnCorner += squareSize;
          }
  
          while(row >= rowCorner + squareSize) {
              rowCorner += squareSize;
          }
      
          for(let i = rowCorner; i < rowCorner + squareSize; i++) {
              for(let j = columnCorner; j < columnCorner + squareSize; j++) {
                  if(matrix[i][j] === value) {
                      return false;
                  }
              }
          }
          
          return true;
      }
  }
}

function solveSudoku(matrix) {
  let solution = copyArray(matrix);
  let result = solveHelper(solution);
  if(result) {
    return matrix;
  }

  function solveHelper(solution) {
    let minPossibleValueCountCell = null;
    while(true) {
      minPossibleValueCountCell = null;
      for(let rowIndex = 0; rowIndex < 9; rowIndex++) {
        for(let columnIndex  = 0; columnIndex < 9; columnIndex++) {
          if(solution[rowIndex][columnIndex] !== 0) {
            continue;
          }
          let row = getRowOrColumn(solution, rowIndex, true);
          let column = getRowOrColumn(solution, columnIndex, false);
          let square = getSubsquare(solution, getPointForSubsquare([rowIndex, columnIndex]));
          
          let possibleValues = findPossibleValues(row, column, square);
          let possibleValuesCount = possibleValues.length;
  
          if(possibleValuesCount === 0) {
            return false;
          }
          if(possibleValuesCount === 1) {
            solution[rowIndex][columnIndex] = possibleValues.pop();
          }
          if(!minPossibleValueCountCell || minPossibleValueCountCell[1].length) {
            minPossibleValueCountCell = [[rowIndex, columnIndex], possibleValues];
          }
        }
      }
      if(!minPossibleValueCountCell) {
        return true;
      } else if(1 < minPossibleValueCountCell[1].length) {
        break;
      }
    }
    let row = minPossibleValueCountCell[0][0];
    let column = minPossibleValueCountCell[0][1];
  
    minPossibleValueCountCell[1].forEach(possible => {
      let solutionCopy = copyArray(solution);
      solutionCopy[row][column] = possible;
      if(solveHelper(solutionCopy)) {
        for(let row = 0; row < 9; row++) {
          for(let column = 0; column < 9; column++) {
            solution[row][column] = solutionCopy[row][column];
          }
        }
        return true;
      }
    });
    return false;
  }

  return null;
}

function checkZeros(matrix) {
  for(let i = 0; i < matrix.length; i++) {
    for(let j = 0; j < matrix.length; j++) {
      if(matrix[i][j] === 0) {
        return false;
      } 
    }
  }
  return true;
}

function findPossibleValues(row, column, square) {
  const array = generateIntArray(9);
  const reservedNumbers = row.concat(column).concat(...square);
  let possible = array.filter(x => reservedNumbers.indexOf(x) == -1);
  return possible;
}

function getRowOrColumn(matrix, index, isRow) {
  const numbers = [];
  for(let i = 0; i < matrix.length; i++) {
    if(isRow) {
      numbers.push(matrix[index][i]);
    } else {
      numbers.push(matrix[i][index]);
    }
  }
  return numbers;
}

function getPointForSubsquare(position) {
  const rowPosition = position[0];
  const columnPosition = position[1];
  const point = [];
  for(let i = 0; i < 9; i++) {
    for(let j = 0; j < 9; j++) {
      if(rowPosition < 3 && columnPosition < 3) {
        point.push(0);
        point.push(0);
        break;
      } else if(rowPosition < 3 && (columnPosition >= 3 && columnPosition < 6)) {
        point.push(0);
        point.push(3);
        break;
      } else if(rowPosition < 3 && (columnPosition >= 6 && columnPosition < 9)) {
        point.push(0);
        point.push(6);
        break;
      } else if((rowPosition >= 3 && rowPosition < 6) && columnPosition < 3) {
        point.push(3);
        point.push(0);
        break;
      } else if((rowPosition >= 3 && rowPosition < 6) && (columnPosition >= 3 && columnPosition < 6)) {
        point.push(3);
        point.push(3);
        break;
      } else if((rowPosition >= 3 && rowPosition < 6) && (columnPosition >= 6 && columnPosition < 9)) {
        point.push(3);
        point.push(6);
        break;
      } else if((rowPosition >= 6 && rowPosition < 9) && columnPosition < 3) {
        point.push(6);
        point.push(0);
        break;
      } else if((rowPosition >= 6 && rowPosition < 9) && (columnPosition >= 3 && columnPosition < 6)) {
        point.push(6);
        point.push(3);
        break;
      } else if((rowPosition >= 6 && rowPosition < 9) && (columnPosition >= 3 && columnPosition < 9)) {
        point.push(6);
        point.push(6);
        break;
      }
    }
    if(point.length > 0) {
      break;
    }
  }
  return point;
}

function getSubsquare(matrix, point) {
  const temp = getEmptyMatrix(3, 3);

  let i = point[0], j = point[1];
  while(i < 3 + point[0]) {
    while(j < 3 + point[1]) {
      temp[i - point[0]][j - point[1]] = matrix[i][j];
      j++;
    }
    j = point[1];
    i++;
  }
  return temp;
}

function getEmptyMatrix(row, column) {
  const matrix = [];
  for(let i = 0; i < row; i++) {
    matrix[i] = new Array(column);
  }
  return matrix;
}

function generateIntArray(length) {
  const array = [];
  for(let i = 1; i < length + 1; i++) {
    array.push(i);
  }
  return array;
}

function copyArray(array) {
  return array.map(function func(el) {
    if(Object.prototype.toString.call(el) == "[object Array]"){
      return el.map(func);
    }
    return el;
  });
}