module.exports = async (url, maxRetries = 3) => {
    let result = { data: [], isLoading: true, error: null, retries: 0 };
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`Попытка ${attempt}/${maxRetries} загрузки данных...`);
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            result.data = await response.json();
            result.retries = attempt - 1;
            break;
            
        } catch (e) {
            result.error = e.message;
            
            if (attempt === maxRetries) {
                console.error(`Все попытки исчерпаны. Ошибка: ${e.message}`);
            } else {
                console.log(`Повтор через ${attempt * 1000}мс...`);
                await new Promise(resolve => setTimeout(resolve, attempt * 1000));
            }
        }
    }
    
    result.isLoading = false;
    return result;
};