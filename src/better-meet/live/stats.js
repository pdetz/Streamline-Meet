export function stDev(unfilteredData) {
    const data = filterData(unfilteredData);
    const n = data.length;
    if (n < 2) return 0;
    const mean = data.reduce((a, b) => a + b) / n;
    return Math.sqrt(data.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
}
export function median(unfilteredData) {
    const data = filterData(unfilteredData);
    if (data.length === 0) return 0;
    const sorted = [...data].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}
export function mean(unfilteredData) {
    const data = filterData(unfilteredData);
    const n = data.length;
    if (n === 0) return 0;
    return data.reduce((a, b) => a + b) / n;
}
export function generateNumbers(minMax, step=0.01, decimals=2) {
    if (minMax.length !== 2) return [];
    let numbers = [minMax[0]];
    for (let i = minMax[0] + step; i <= minMax[1]; i += step) {
        numbers.push(Math.floor(i * Math.pow(10, decimals)) / Math.pow(10, decimals));
    }
    return numbers;
}
export function filterData(data) {
    return data.filter(x => typeof x === 'number' && !isNaN(x));
}