const bcrypt = require('bcrypt');

async function start() {
    console.log("Шифрование 13 паролей с разной сложностью...");
    const passwords = Array(13).fill(null).map((_, i) => `pass${i + 100}`);
    
    const tasks = passwords.map(async (pass, i) => {
        const saltRounds = 10 + Math.floor(i / 4); // Увеличиваем сложность группами
        const s = Date.now();
        const hash = await bcrypt.hash(pass, saltRounds);
        const time = Date.now() - s;
        
        // Проверяем пароль
        const isValid = await bcrypt.compare(pass, hash);
        
        console.log(`Пароль ${i + 1} (сложность ${saltRounds}): ${time}ms ${isValid ? '✓' : '✗'}`);
        return { hash, time, isValid };
    });
    
    const results = await Promise.all(tasks);
    const totalTime = results.reduce((sum, r) => sum + r.time, 0);
    
    console.log(`\nОбщее время: ${totalTime}ms`);
    console.log("Вывод: Время увеличивается порциями из-за ограничения пула потоков libuv (по 4 задачи) и возрастающей сложности.");
}
start();