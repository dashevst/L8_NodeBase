module.exports = (arr, strategy = 'alphabetical') => {
    const strategies = {
        alphabetical: (a, b) => {
            const cleanA = a.replace(/\s/g, '');
            const cleanB = b.replace(/\s/g, '');
            return cleanA.localeCompare(cleanB);
        },
        reverse: (a, b) => {
            const cleanA = a.replace(/\s/g, '');
            const cleanB = b.replace(/\s/g, '');
            return cleanB.localeCompare(cleanA);
        },
        length: (a, b) => a.length - b.length,
        wordCount: (a, b) => a.split(/\s+/).length - b.split(/\s+/).length
    };
    
    const comparator = strategies[strategy] || strategies.alphabetical;
    return [...arr].sort(comparator);
};