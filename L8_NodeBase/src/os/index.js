const os = require('os');
require('dotenv').config();

const showOsInfo = () => {
    const info = {
        платформа: os.platform(),
        архитектура: os.arch(),
        версия_os: os.version(),
        ядра_процессора: os.cpus().length,
        модель_процессора: os.cpus()[0]?.model || 'неизвестно',
        тактовая_частота: `${os.cpus()[0]?.speed || 0} МГц`,
        общая_память: `${(os.totalmem() / (1024**3)).toFixed(2)} GB`,
        свободная_память: `${(os.freemem() / (1024**3)).toFixed(2)} GB`,
        использование_памяти: `${((1 - os.freemem() / os.totalmem()) * 100).toFixed(1)}%`,
        директория: os.homedir(),
        имя_хоста: os.hostname(),
        время_работы: `${(os.uptime() / 3600).toFixed(1)} часов`,
        сетевые_интерфейсы: Object.keys(os.networkInterfaces()).length
    };
    
    console.table(info);
};

const checkMemory = () => {
    const freeGB = os.freemem() / (1024**3);
    const isMoreThan4GB = freeGB > 4;
    const status = isMoreThan4GB ? "✓ Достаточно" : "⚠ Мало памяти";
    
    console.log(`\nПРОВЕРКА ПАМЯТИ:`);
    console.log(`Свободно: ${freeGB.toFixed(2)} GB`);
    console.log(`Статус: ${status} ${isMoreThan4GB ? '' : '(рекомендуется > 4GB)'}`);
    
    return isMoreThan4GB;
};

const showSystemLoad = () => {
    const load = os.loadavg();
    console.log(`\nНАГРУЗКА СИСТЕМЫ (за 1, 5, 15 мин): ${load.map(l => l.toFixed(2)).join(' | ')}`);
};

if (process.env.MODE === 'admin') {
    console.log("=== РАСШИРЕННАЯ ИНФОРМАЦИЯ О СИСТЕМЕ ===");
    showOsInfo();
    showSystemLoad();
} else {
    console.log("=== ОСНОВНАЯ ИНФОРМАЦИЯ ===");
    console.log(`Платформа: ${os.platform()}`);
    console.log(`Память: ${(os.freemem() / (1024**3)).toFixed(2)} GB свободно`);
}

const memoryOk = checkMemory();

// Логирование результата
if (process.env.MODE === 'admin') {
    const logEntry = {
        timestamp: new Date().toISOString(),
        mode: process.env.MODE,
        memoryStatus: memoryOk ? 'OK' : 'LOW',
        freeMemory: os.freemem(),
        loadAverage: os.loadavg()
    };
    
    require('fs').writeFileSync(
        'system_check.log', 
        JSON.stringify(logEntry, null, 2) + '\n',
        { flag: 'a' }
    );
}