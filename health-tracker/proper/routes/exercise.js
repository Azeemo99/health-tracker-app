const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const exerciseEntries = path.join(__dirname, '../data/exerciseEntries.json');
const exercises = path.join(__dirname, '../data/exercises.json');


function readExerciseEntries() {
  try {
    return JSON.parse(fs.readFileSync(exerciseEntries, 'utf-8'));
  } catch (err) {
    return [];
  }
}


function writeExerciseEntries(data) {
  fs.writeFileSync(exerciseEntries, JSON.stringify(data, null, 2));
}


function readExercises() {
  try {
    const data = fs.readFileSync(exercises, 'utf-8');
    return JSON.parse(data); 
  } catch (err) {
    console.error('Error reading exerciseTypes.json:', err);
    return [];
  }
}


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

  const allEntries = readExerciseEntries();
  const userId = req.session.user.id;

  const todaysExercises = allEntries.filter(
    entry => entry.userId === userId && isToday(entry.date)
  );

  const totalDuration = todaysExercises.reduce((sum, entry) => sum + entry.duration, 0);
  const totalCaloriesBurned = todaysExercises.reduce((sum, entry) => sum + (entry.caloriesBurned || 0), 0); 

  const exerciseTypes = readExercises(); 

  res.render('exercise', {
    user: req.session.user,
    exercises: todaysExercises,
    totalDuration,
    totalCaloriesBurned,
    exerciseTypes
  });
});



router.post('/add', (req, res) => {
  const { exerciseType, duration } = req.body;

  if (!req.session.user || !exerciseType || !duration) {
    return res.redirect('/exercise');
  }

  const allExercises = readExerciseEntries();

  // Read exercise types to get the calories per minute
  const exerciseTypes = readExercises();  // Read from exercises.json
  const exercise = exerciseTypes.find(ex => ex.type === exerciseType);
  const caloriesPerMinute = exercise ? exercise.caloriesPerMinute : 0;

  // Calculate total calories burned
  const caloriesBurned = caloriesPerMinute * parseInt(duration);

  // Add exercise entry with date, user ID, and calories burned
  allExercises.push({
    userId: req.session.user.id,
    type: exerciseType,
    duration: parseInt(duration),
    caloriesBurned: caloriesBurned,
    date: new Date().toISOString() // Save the date for filtering purposes
  });

  writeExerciseEntries(allExercises); // Use writeExerciseEntries instead of writeExercises

  res.redirect('/exercise');
});

module.exports = router;
