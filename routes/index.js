const express = require('express');
const sudokuV = require('../modules/sudoku-validator');

const router = express.Router();

/* GET home page. */
router.post('/sudoku-validator', (req, res, next) => {
  try {
    const result = sudokuV.validateSolution(req.body);
    res.send(result);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
