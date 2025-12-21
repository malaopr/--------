class CountryAPI {
    static #API_BASE = 'http://localhost:3000/api';
    static #KEY_MAP = {
        query: 'search',
        zone: 'region',
        popMin: 'minPopulation',
        popMax: 'maxPopulation',
        sizeMin: 'minArea',
        sizeMax: 'maxArea'
    };

    static async getCountryList(filters = {}) {
        try {
            const params = new URLSearchParams();
            
            for (const [key, value] of Object.entries(filters)) {
                if (value || value === 0) {
                    const paramKey = this.#KEY_MAP[key] || key;
                    params.append(paramKey, value);
                }
            }

            const response = await fetch(`${this.#API_BASE}/countries?${params}`);
            
            if (!response.ok) {
                throw new Error(`Ошибка ${response.status}`);
            }
            
            const data = await response.json();
            return Array.isArray(data) ? data : [];
            
        } catch (error) {
            console.warn('Ошибка получения стран:', error);
            throw error;
        }
    }

    static async getCountryFullInfo(countryId) {
        if (!countryId) throw new Error('Нет идентификатора страны');

        try {
            const response = await fetch(`${this.#API_BASE}/countries/${countryId}`);
            
            if (response.status === 404) {
                throw new Error('Страна не найдена');
            }
            
            if (!response.ok) {
                throw new Error(`Ошибка ${response.status}`);
            }
            
            return await response.json();
            
        } catch (error) {
            console.warn('Ошибка деталей страны:', error);
            throw error;
        }
    }

    static async getAllRegions() {
        try {
            const countries = await this.getCountryList();
            const regions = [...new Set(countries
                .map(c => c.region)
                .filter(r => r && r.trim())
            )].sort();
            
            return regions;
        } catch (error) {
            console.warn('Ошибка регионов:', error);
            return [];
        }
    }

    static formatNumber(value) {
        if (value === null || value === undefined || isNaN(value)) return '—';
        return new Intl.NumberFormat('ru-RU').format(value);
    }

    static formatArea(value) {
        if (!value && value !== 0) return '—';
        const num = Number(value);
        if (isNaN(num)) return '—';
        
        if (num >= 1000000) return `${(num / 1000000).toFixed(2)} млн км²`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)} тыс км²`;
        return `${this.formatNumber(num)} км²`;
    }

    static formatPopulation(value) {
        if (!value && value !== 0) return '—';
        const num = Number(value);
        if (isNaN(num)) return '—';
        
        if (num >= 1000000000) return `${(num / 1000000000).toFixed(2)} млрд`;
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)} млн`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)} тыс`;
        return this.formatNumber(num);
    }

    static getFlagImage(countryCode, size = 'w320') {
        if (!countryCode) return '';
        const code = countryCode.toLowerCase().trim();
        if (!/^[a-z]{2,3}$/.test(code)) return '';
        return `https://flagcdn.com/${size}/${code}.png`;
    }

    static getAllCountryNames(countries) {
        const names = [];
        countries.forEach(country => {
            names.push(country.name.common);
            names.push(country.name.official);
            
            if (country.translations) {
                Object.values(country.translations).forEach(trans => {
                    if (trans.common) names.push(trans.common);
                    if (trans.official) names.push(trans.official);
                });
            }
        });
        return [...new Set(names)].sort();
    }
}

window.CountryAPI = CountryAPI; 