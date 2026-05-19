const express = require('express');
const fs = require('fs');
const path = require('path');
const { MAX } = require('uuid');
const router = express.Router();

const goal_data = path.join(__dirname, '../data/goals.json');
const userDataPath = path.join(__dirname, '../data/users.json');
const users = JSON.parse(fs.readFileSync(userDataPath, 'utf8'));



function readGoals() {
  try {
    return JSON.parse(fs.readFileSync(goal_data, 'utf-8'));
  } catch (err) {
    return [];
  }
}


function writeGoals(data) {
  fs.writeFileSync(goal_data, JSON.stringify(data, null, 2));
}

function calculateCalories(data){
    let BMR = 10 * data.currentWeight + 6.25 * data.currentHeight -5*30 -5;
    let AM;
    if(data.exerciseTime =0){
        AM = 1.2;
    }
    else if(data.exerciseTime<150){
        AM = 1.3;
    }
    else if(data.exerciseTime<150){
        AM = 1.5;
    }
    else{
        AM = 1.7;
    }
    let cMain = BMR*AM;
    cdef = (data.currentWeight - data.targetWeight)*7700;
    cdefdaily = cdef/(7*data.timeFrame);
    calGoal = Math.max(cMain - cdefdaily,1200).toFixed(0);
    return calGoal;


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
  if (req.session.user) {
    res.render('goals', { user: req.session.user });
  } else {
    res.redirect('/login');  
  }
});




router.post('/set', (req, res) => {
  const { goal, targetWeight, timeFrame, exerciseTime } = req.body;

  if (!req.session.user || !goal || !targetWeight || !timeFrame || !exerciseTime ) {
    return res.redirect('/exercise');
  }

  const userId = req.session.user.id;


  const usersPath = path.join(__dirname, '../data/users.json');
  const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));

 
  const loggedInUser = users.find(u => u.id === userId);

  if (!loggedInUser) {
    return res.status(404).send('User not found.');
  }

  
  const allGoals = readGoals();
  goalData = {
    userId: userId,
    goal: goal,
    targetWeight: parseInt(targetWeight),
    timeFrame: parseInt(timeFrame),
    exerciseTime: parseInt(exerciseTime),
    currentWeight: loggedInUser.weight,
    currentHeight: loggedInUser.height
  }
  allGoals.push({
    userId: userId,
    goal: goal,
    targetWeight: parseInt(targetWeight),
    timeFrame: parseInt(timeFrame),
    exerciseTime: parseInt(exerciseTime),
    calGoal: calculateCalories(goalData)
  });

  writeGoals(allGoals);

  res.redirect('/goals');
});


module.exports = router;
