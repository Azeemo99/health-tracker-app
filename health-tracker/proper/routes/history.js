const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const foodPath = path.join(__dirname, '../data/foodEntries.json');
const exercisePath = path.join(__dirname, '../data/exerciseEntries.json');
const goalsPath = path.join(__dirname, '../data/goals.json');


function formatDate(dateStr) {
  return new Date(dateStr).toISOString().split('T')[0];
}

router.get('/', (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  const userId = req.session.user.id;
  const selectedDate = req.query.date ? formatDate(req.query.date) : formatDate(new Date());

  const foodData = JSON.parse(fs.readFileSync(foodPath, 'utf8'));
  const exerciseData = JSON.parse(fs.readFileSync(exercisePath, 'utf8'));
  const goalData = JSON.parse(fs.readFileSync(goalsPath, 'utf8'));

  const userGoal = goalData.find(g => g.userId === userId);
  const calGoal = userGoal ? userGoal.calGoal : 2000;

  const foodForDate = foodData.filter(f => f.userId === userId && formatDate(f.date) === selectedDate);
  const exerciseForDate = exerciseData.filter(e => e.userId === userId && formatDate(e.date) === selectedDate);

  const summary = {
    caloriesIn: 0,
    caloriesOut: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    calGoal,
    date: selectedDate
  };

  foodForDate.forEach(f => {
    summary.caloriesIn += f.calories || 0;
    summary.protein += f.protein || 0;
    summary.carbs += f.carbs || 0;
    summary.fats += f.fats || 0;
  });

  exerciseForDate.forEach(e => {
    summary.caloriesOut += e.caloriesBurned || 0;
  });

  res.render('history', { user: req.session.user, summary });
});

module.exports = router;
