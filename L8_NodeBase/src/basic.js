require('dotenv').config();
const os = require('os');

console.log("=== ИНФОРМАЦИЯ ИЗ .ENV И СИСТЕМЫ ===");
console.log(`Студент: ${process.env.MY_NAME} ${process.env.MY_SURNAME}`);
console.log(`Группа: ${process.env.GROUP_NUM}, № в списке: ${process.env.LIST_NUM}`);
console.log(`Текущая дата: ${new Date().toLocaleDateString()}`);
console.log(`Платформа: ${os.platform()}`);
console.log(`Архитектура: ${os.arch()}`);
console.log(`Пользователь: ${os.userInfo().username}`);
console.log(`Запуск из: ${__dirname}`);