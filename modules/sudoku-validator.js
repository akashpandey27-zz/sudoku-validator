const Promise = require('bluebird');
const _ = require('lodash');

function validateSolution(data) {
  const grid = data.grid;
  if (!_.isArray(grid)) {
    return Promise.reject('Invalid Input');
  }
  return validate(grid) && validate(grid, 'column') && validate(grid, 'region');
}
function validate(grid, entity) {
  if (!entity) {
    return _.every(grid,(row) => {
      return validateSum(row) && validateMembers(row); 
    })
  } 
  for (let i = 0; i < grid.length; i++) {
    const set = entity === 'column' ? transposeCol(grid, i) : transposeRegion(grid, i);
    if (!(validateSum(set) && validateMembers(set))) return false;
  }
  return true;
}
function validateSum(set) {
  const reduction = _.reduce(set, (sum, member) => sum + member);
  return reduction === 45;
}

function validateMembers(set) {
  return allIncluded(set) ? validateFrequency(_.countBy(set, _.identity)) : false;
}
function allIncluded(set) {
  return _.every([1, 2, 3, 4, 5, 6, 7, 8, 9], member => set.indexOf(member) >= 0);
}

function validateFrequency(set) {
  for (const key in set) {
    if (set.hasOwnProperty(key)) if (set[key] > 1) return false;
  }
  return true;
}
function transposeRegion(board, regionIdx) {
  const fromToTuple = setFromTo(regionIdx);
  return createRegion(board, setStartIdx(regionIdx), fromToTuple[0], fromToTuple[1]);
}

function transposeCol(board, colIdx) {
  const transposed = [];
  for (let i = 0; i < board.length; i++) transposed.push(board[colIdx][i]);
  return transposed;
}

function createRegion(board, startIdx, from, to) {
  let region = [];
  for (let i = 0; i < 3; i++) {
    region = region.concat(sliceRegion(board, startIdx + i, from, to));
  }
  return region;
}

function sliceRegion(board, colIdx, from, to) {
  return board[colIdx].slice(from, to);
}

function setFromTo(regionIdx) {
  let from = 0;
  let to = 3;
  if (regionIdx === 1 || regionIdx === 4 || regionIdx === 7) {
    from = 3; to = 6;
  } else if (regionIdx === 2 || regionIdx === 5 || regionIdx === 8) {
    from = 6; to = 9;
  }
  return [from, to];
}

function setStartIdx(regionIdx) {
  let startIdx = 0;
  if (regionIdx > 2 && regionIdx < 6) startIdx = 3;
  else if (regionIdx > 5 && regionIdx < 9) startIdx = 6;
  return startIdx;
}

module.exports.validateSolution = validateSolution;
