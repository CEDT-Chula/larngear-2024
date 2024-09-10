const express = require('express');

const {getScores,getScoreByName, addScore} = require('../controllers/score.js');

const router = express.Router({mergeParams: true});

router.route('/').get(getScores).post(addScore);
router.route('/:name').get(getScoreByName);

module.exports = router;