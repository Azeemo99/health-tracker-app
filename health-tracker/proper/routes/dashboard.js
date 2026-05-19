//basic setup
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

//paths 
const goalsPath = path.join(__dirname, '../data/goals.json');
const exercisePath = path.join(__dirname, '../data/exerciseEntries.json');
const foodPath = path.join(__dirname, '../data/foodEntries.json');


function isToday(dateString) {
  const inputDate = new Date(dateString);
  const today = new Date();
  return (
    inputDate.getDate() === today.getDate() &&
    inputDate.getMonth() === today.getMonth() &&
    inputDate.getFullYear() === today.getFullYear()
  );
}

router.get('/', (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  const userId = req.session.user.id;

  const goals = JSON.parse(fs.readFileSync(goalsPath, 'utf8'));
  const exercises = JSON.parse(fs.readFileSync(exercisePath, 'utf8'));
  const foods = JSON.parse(fs.readFileSync(foodPath, 'utf8'));

  const userGoal = goals.find(g => g.userId === userId);
  const goalCalories = userGoal?.calGoal || 2000; 

  const todayExercises = exercises.filter(e => e.userId === userId && isToday(e.date));
  const todayFoods = foods.filter(f => f.userId === userId && isToday(f.date));

  const caloriesOut = todayExercises.reduce((sum, e) => sum + e.caloriesBurned, 0);
  const caloriesIn = todayFoods.reduce((sum, f) => sum + f.calories, 0);

  const protein = todayFoods.reduce((sum, f) => sum + (f.protein || 0), 0);
  const carbs = todayFoods.reduce((sum, f) => sum + (f.carbs || 0), 0);
  const fats = todayFoods.reduce((sum, f) => sum + (f.fats || 0), 0);

  res.render('dashboard', {
    user: req.session.user,
    goalCalories,
    caloriesIn,
    caloriesOut,
    protein,
    carbs,
    fats
  });
});

module.exports = router;
