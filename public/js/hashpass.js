const bcrypt = require('bcrypt');

// Задай здесь свой пароль
const password = '123456';

async function generateHash() {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  console.log(`Хэш для пароля "${password}":\n`);
  console.log(hash);
}

generateHash();
