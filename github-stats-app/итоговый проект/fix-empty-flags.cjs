const fs = require('fs');
const path = require('path');

console.log('Исправление пустые флаги...');

const countriesPath = path.join(__dirname, 'countries.json');
let countries = JSON.parse(fs.readFileSync(countriesPath, 'utf8'));


const FLAG_EMOJIS = {
    // Европа
    'RUS': '🇷🇺', 'DEU': '🇩🇪', 'GBR': '🇬🇧', 'FRA': '🇫🇷',
    'ITA': '🇮🇹', 'ESP': '🇪🇸', 'UKR': '🇺🇦', 'POL': '🇵🇱',
    'NLD': '🇳🇱', 'BEL': '🇧🇪', 'CHE': '🇨🇭', 'SWE': '🇸🇪',
    'NOR': '🇳🇴', 'DNK': '🇩🇰', 'FIN': '🇫🇮', 'AUT': '🇦🇹',
    'CZE': '🇨🇿', 'HUN': '🇭🇺', 'ROU': '🇷🇴', 'GRC': '🇬🇷',
    'PRT': '🇵🇹', 'IRL': '🇮🇪', 'BLR': '🇧🇾', 'SRB': '🇷🇸',
    
    // Азия
    'CHN': '🇨🇳', 'JPN': '🇯🇵', 'KOR': '🇰🇷', 'IND': '🇮🇳',
    'IDN': '🇮🇩', 'PAK': '🇵🇰', 'BGD': '🇧🇩', 'VNM': '🇻🇳',
    'THA': '🇹🇭', 'PHL': '🇵🇭', 'MYS': '🇲🇾', 'SGP': '🇸🇬',
    'TUR': '🇹🇷', 'SAU': '🇸🇦', 'IRN': '🇮🇷', 'IRQ': '🇮🇶',
    'AFG': '🇦🇫', 'KAZ': '🇰🇿', 'UZB': '🇺🇿', 'ISR': '🇮🇱',
    
    // Америка
    'USA': '🇺🇸', 'CAN': '🇨🇦', 'MEX': '🇲🇽', 'BRA': '🇧🇷',
    'ARG': '🇦🇷', 'COL': '🇨🇴', 'PER': '🇵🇪', 'CHL': '🇨🇱',
    'VEN': '🇻🇪', 'ECU': '🇪🇨', 'BOL': '🇧🇴', 'CUB': '🇨🇺',
    'DOM': '🇩🇴', 'HTI': '🇭🇹', 'JAM': '🇯🇲', 'PAN': '🇵🇦',
    
    // Африка
    'NGA': '🇳🇬', 'ETH': '🇪🇹', 'EGY': '🇪🇬', 'ZAF': '🇿🇦',
    'COD': '🇨🇩', 'TZA': '🇹🇿', 'KEN': '🇰🇪', 'UGA': '🇺🇬',
    'SDN': '🇸🇩', 'MAR': '🇲🇦', 'DZA': '🇩🇿', 'AGO': '🇦🇴',
    'MOZ': '🇲🇿', 'GHA': '🇬🇭', 'CMR': '🇨🇲', 'CIV': '🇨🇮',
    
    // Океания
    'AUS': '🇦🇺', 'NZL': '🇳🇿', 'PNG': '🇵🇬', 'FJI': '🇫🇯',
    'SLB': '🇸🇧', 'VUT': '🇻🇺', 'WSM': '🇼🇸', 'TON': '🇹🇴',
    
    
    'ARE': '🇦🇪', 'QAT': '🇶🇦', 'KWT': '🇰🇼', 'OMN': '🇴🇲',
    'LBN': '🇱🇧', 'SYR': '🇸🇾', 'JOR': '🇯🇴', 'PSE': '🇵🇸'
};

let fixedCount = 0;
let totalCount = 0;


countries = countries.map(country => {
    totalCount++;
    
    
    if (!country.flag || country.flag.trim() === '' || country.flag === 'undefined') {
        const emoji = FLAG_EMOJIS[country.cca3] || '🏴';
        fixedCount++;
        return {
            ...country,
            flag: emoji
        };
    }
    
    return country;
});


fs.writeFileSync(countriesPath, JSON.stringify(countries, null, 2));

console.log(`Исправлено ${fixedCount} из ${totalCount} стран`);
console.log(`Файл сохранен: ${countriesPath}`);


console.log('\nПример первых 5 стран:');
countries.slice(0, 5).forEach((c, i) => {
    console.log(`${i+1}. ${c.name.common} (${c.cca3}): ${c.flag}`);
});