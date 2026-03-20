require('dotenv').config();
const { Ingredient } = require('./models/index');

async function list() {
  try {
    const list = await Ingredient.findAll({ where: { is_active: true } });
    console.log(JSON.stringify(list, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

list();
