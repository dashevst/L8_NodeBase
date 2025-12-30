const loader = require('./src/modules/dataLoader');
const sorter = require('./src/modules/sorter');
const fsys = require('./src/modules/fsModule');
const path = require('path');

async function run() {
    console.log(`ТЕКУЩИЙ РЕЖИМ: ${process.env.MODE}`);
    console.log(`Запуск в: ${new Date().toLocaleString()}`);
    
    const { data, error } = await loader('https://jsonplaceholder.typicode.com/users');
    
    if (error) return console.log("Ошибка загрузки:", error);

    // Сортировка с разными критериями
    const names = sorter(data.map(u => u.name));
    const emails = data.map(u => u.email);
    
    // Фильтрация пользователей
    const filteredUsers = data.filter(user => 
        user.name.toLowerCase().includes('a') && user.id % 2 === 0
    );
    
    const stats = {
        totalUsers: data.length,
        filteredCount: filteredUsers.length,
        domains: [...new Set(emails.map(e => e.split('@')[1]))],
        longestName: data.reduce((longest, user) => 
            user.name.length > longest.length ? user.name : longest, ''
        )
    };

    fsys.makeDir('users');
    fsys.makeDir('users/stats');
    
    fsys.write(path.join('users', 'names.txt'), names.join('\n'));
    fsys.write(path.join('users', 'emails.txt'), emails.join('\n'));
    fsys.write(path.join('users', 'filtered_users.json'), JSON.stringify(filteredUsers, null, 2));
    fsys.write(path.join('users/stats', 'statistics.json'), JSON.stringify(stats, null, 2));
    
    console.log("\n=== СТАТИСТИКА ===");
    console.log(`Всего пользователей: ${stats.totalUsers}`);
    console.log(`Отфильтровано: ${stats.filteredCount}`);
    console.log(`Уникальных доменов: ${stats.domains.length}`);
    console.log(`Самое длинное имя: ${stats.longestName}`);
    console.log("\nУСПЕХ! Данные сохранены в /users и /users/stats");
}
run();