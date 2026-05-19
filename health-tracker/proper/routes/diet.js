const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');


const foodsFilePath = path.join(__dirname, '../data/foods.json');
const foodEntriesFilePath = path.join(__dirname, '../data/foodEntries.json');


function readFoods() {
  try {
    const data = fs.readFileSync(foodsFilePath, 'utf-8');
    const foods = JSON.parse(data);
    return Array.isArray(foods) ? foods : [];
  } catch (err) {
    console.error('Error reading foods.json:', err);
    return [];
  }
}


function readFoodEntries() {
  try {
    const data = fs.readFileSync(foodEntriesFilePath, 'utf-8');
    const entries = JSON.parse(data);
    return Array.isArray(entries) ? entries : [];
  } catch (err) {
    console.error('Error foodEntries.json:', err);
    return [];
  }
}

function saveFoodEntries(entries) {
  try {
    fs.writeFileSync(foodEntriesFilePath, JSON.stringify(entries, null, 2));
  } catch (err) {
    console.error('Error saving  foodEntries.json:', err);
  }
}

router.get('/', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const userId = req.session.user.id;
  const today = new Date().toISOString().split('T')[0];

  const allEntries = readFoodEntries();
  const foods = readFoods();

  
  const foodEntries = allEntries.filter(entry => 
    entry.userId === userId && entry.date === today
  );


  const totals = foodEntries.reduce((acc, entry) => {
    acc.calories += entry.calories*entry.amount/100;
    acc.protein += entry.protein*entry.amount/100;
    acc.carbs += entry.carbs*entry.amount/100;
    acc.fats += entry.fats*entry.amount/100;
    return acc;
  }, { calories: 0, protein: 0, carbs: 0, fats: 0 });


  totals.calories = totals.calories.toFixed(2);
  totals.protein = totals.protein.toFixed(2);
  totals.carbs = totals.carbs.toFixed(2);
  totals.fats = totals.fats.toFixed(2);

  res.render('diet', {
    user: req.session.user,
    foodEntries,
    foods,
    totals
  });
});


router.post('/add', (req, res) => {
  if (!req.session.user) {
    return res.status(401).send('Unauthorized');
  }

  const { foodId, amount } = req.body;
  const foods = readFoods();
  const food = foods.find(f => f.id == foodId);

  if (!food || !amount || isNaN(amount)) {
    return res.status(400).send('Invalid food or amount');
  }

  const grams = parseFloat(amount);
  const newEntry = {
    userId: req.session.user.id,
    foodName: food.name,
    amount: grams,
    calories: (food.calories * grams/100).toFixed(2),
    protein: (food.protein * grams/100).toFixed(2),
    carbs: (food.carbs * grams/100).toFixed(2),
    fats: (food.fats * grams/100).toFixed(2),
    date: new Date().toISOString().split('T')[0]
  };

  const entries = readFoodEntries();
  entries.push({
    ...newEntry,
    calories: parseFloat(newEntry.calories),
    protein: parseFloat(newEntry.protein),
    carbs: parseFloat(newEntry.carbs),
    fats: parseFloat(newEntry.fats)
  });

  saveFoodEntries(entries);
  res.redirect('/diet');
});
router.get('/add-food', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.render('newFood', { user: req.session.user });
});


router.post('/add-food', (req, res) => {
  const { name, calories, protein, carbs, fats } = req.body;

  if (!name || isNaN(calories) || isNaN(protein) || isNaN(carbs) || isNaN(fats)) {
    return res.status(400).send('Invalid input for food item.');
  }

  const foods = readFoods();

  const newFood = {
    id: Date.now(),  
    name,
    calories: parseFloat(calories),
    protein: parseFloat(protein),
    carbs: parseFloat(carbs),
    fats: parseFloat(fats)
  };

  foods.push(newFood);

  try {
    fs.writeFileSync(foodsFilePath, JSON.stringify(foods, null, 2));
    res.redirect('/diet');
  } catch (err) {
    console.error('Error saving new food:', err);
    res.status(500).send('Could not save food.');
  }
});

module.exports = router;
