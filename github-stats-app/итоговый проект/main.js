class WorldExplorer {
    constructor() {
        this.data = [];
        this.currentSelection = null;
        this.visualMode = 'cards';
        this.activeFilters = {
            query: '',
            zone: '',
            popMin: '',
            popMax: '',
            sizeMin: '',
            sizeMax: ''
        };
        this.mapInstance = null;

        this.identifyElements();
        this.configureListeners();
        this.startup();
    }

    identifyElements() {
        this.ui = {
            themeSwitcher: document.getElementById('themeToggle'),
            themeIndicator: document.getElementById('themeIcon'),
            mainPanel: document.getElementById('mainView'),
            detailPanel: document.getElementById('detailView'),
            dataContainer: document.getElementById('countryList'),
            detailContent: document.getElementById('detailContent'),
            searchBox: document.getElementById('searchInput'),
            zonePicker: document.getElementById('regionSelect'),
            popLowerBound: document.getElementById('populationMin'),
            popUpperBound: document.getElementById('populationMax'),
            sizeLowerBound: document.getElementById('areaMin'),
            sizeUpperBound: document.getElementById('areaMax'),
            loadingIndicator: document.getElementById('loading'),
            errorDisplay: document.getElementById('error'),
            detailLoader: document.getElementById('detailLoading'),
            detailError: document.getElementById('detailError'),
            returnButton: document.getElementById('backButton')
        };

        const modeSelectors = document.querySelectorAll('input[name="viewType"]');
        const selected = document.querySelector('input[name="viewType"]:checked');
        this.visualMode = selected ? selected.value : 'cards';
    }

    configureListeners() {
        this.ui.themeSwitcher.addEventListener('click', () => this.toggleVisualTheme());
        this.ui.returnButton.addEventListener('click', () => this.returnToMainView());

        this.ui.searchBox.addEventListener('input', (evt) => {
            this.activeFilters.query = evt.target.value;
            this.delayedDataUpdate();
        });

        this.ui.zonePicker.addEventListener('change', (evt) => {
            this.activeFilters.zone = evt.target.value;
            this.updateDataDisplay();
        });

        const numericControls = [
            { element: this.ui.popLowerBound, property: 'popMin' },
            { element: this.ui.popUpperBound, property: 'popMax' },
            { element: this.ui.sizeLowerBound, property: 'sizeMin' },
            { element: this.ui.sizeUpperBound, property: 'sizeMax' }
        ];

        numericControls.forEach(control => {
            control.element.addEventListener('input', (evt) => {
                this.activeFilters[control.property] = evt.target.value;
                this.delayedDataUpdate();
            });
        });

        document.querySelectorAll('input[name="viewType"]').forEach(ctrl => {
            ctrl.addEventListener('change', (evt) => {
                this.visualMode = evt.target.value;
                this.refreshDataPresentation();
            });
        });
    }

    applyTheme(isDarkTheme) {
        if (isDarkTheme) {
            document.body.setAttribute('data-theme', 'dark');
        } else {
            document.body.removeAttribute('data-theme');
        }
        this.updateThemeIcon();
    }

    async startup() {
        this.setupSystemThemeListener();
        await this.loadGeographicalZones();
        await this.retrieveCountryData();
        await this.loadSearchSuggestions();
    }

    setupSystemThemeListener() {
        const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const applySystemTheme = (e) => {
            if (!localStorage.getItem('appTheme')) {
                this.applyTheme(e.matches);
            }
        };
        
        colorSchemeQuery.addEventListener('change', applySystemTheme);
        
        
        const savedTheme = localStorage.getItem('appTheme');
        if (savedTheme) {
            this.applyTheme(savedTheme === 'dark');
        } else {
            this.applyTheme(colorSchemeQuery.matches);
        }
    }

    updateThemeIcon() {
        const currentTheme = localStorage.getItem('appTheme');
        if (!currentTheme) {
            this.ui.themeIndicator.textContent = '💻';
        } else if (currentTheme === 'light') {
            this.ui.themeIndicator.textContent = '🌙';
        } else {
            this.ui.themeIndicator.textContent = '☀️';
        }
    }

    toggleVisualTheme() {
        const currentTheme = localStorage.getItem('appTheme');
        let newTheme;
        
        if (!currentTheme) {
            
            newTheme = 'light';
        } else if (currentTheme === 'light') {
            newTheme = 'dark';
        } else {
            
            newTheme = 'system';
            localStorage.removeItem('appTheme');
        }
        
        if (newTheme !== 'system') {
            localStorage.setItem('appTheme', newTheme);
        }
        
        if (newTheme === 'system') {
            const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.applyTheme(systemDark);
        } else {
            this.applyTheme(newTheme === 'dark');
        }
        
        this.updateThemeIcon();
    }

    async loadGeographicalZones() {
        try {
            const countries = await CountryAPI.getCountryList();
            const zones = [...new Set(countries.map(c => c.region).filter(r => r))].sort();

            zones.forEach(zone => {
                const option = document.createElement('option');
                option.value = zone;
                option.textContent = zone;
                this.ui.zonePicker.appendChild(option);
            });
        } catch (err) {
            console.warn('Не удалось загрузить регионы:', err);
        }
    }

    async loadSearchSuggestions() {
        try {
            const countries = await CountryAPI.getCountryList();
            const allNames = CountryAPI.getAllCountryNames(countries);
            
            const datalist = document.createElement('datalist');
            datalist.id = 'countrySuggestions';
            
            allNames.forEach(name => {
                const option = document.createElement('option');
                option.value = name;
                datalist.appendChild(option);
            });
            
            document.body.appendChild(datalist);
            this.ui.searchBox.setAttribute('list', 'countrySuggestions');
            
        } catch (err) {
            console.warn('Не удалось загрузить подсказки:', err);
        }
    }

    async retrieveCountryData() {
        try {
            this.displayLoading();
            this.hideErrorMessage();

            this.data = await CountryAPI.getCountryList(this.activeFilters);
            this.refreshDataPresentation();
            this.hideLoading();

        } catch (err) {
            this.hideLoading();
            this.showErrorMessage('Ошибка при получении данных');
            console.error(err);
        }
    }

    async updateDataDisplay() {
        try {
            this.data = await CountryAPI.getCountryList(this.activeFilters);
            this.refreshDataPresentation();
        } catch (err) {
            console.warn('Проблема с фильтрацией:', err);
        }
    }

    delayedDataUpdate = this.createDelayFunction(() => this.updateDataDisplay(), 350);

    createDelayFunction(func, delay) {
        let timerId;
        return function delayedExecution(...args) {
            const later = () => {
                clearTimeout(timerId);
                func(...args);
            };
            clearTimeout(timerId);
            timerId = setTimeout(later, delay);
        };
    }

    refreshDataPresentation() {
        const container = this.ui.dataContainer;
        container.innerHTML = '';

        if (!this.data.length) {
            container.innerHTML = '<p class="no-data">Совпадений не найдено</p>';
            return;
        }

        this.visualMode === 'table'
            ? this.createTableLayout(container)
            : this.createCardLayout(container);
    }

    createCardLayout(container) {
        container.className = 'cards-layout';

        this.data.forEach(item => {
            const card = document.createElement('article');
            card.className = 'country-card';
            card.innerHTML = `
                <div class="flag-container">
                    <img src="https://flagcdn.com/w60/${item.code.toLowerCase()}.png" 
                         alt="Флаг ${item.name}" 
                         class="flag-img"
                         onerror="this.onerror=null; this.src='https://flagcdn.com/w60/un.png'">
                </div>
                <h3 class="country-name">${item.name}</h3>
                <div class="country-info">
                    <p><strong>Регион:</strong> ${item.region || '—'}</p>
                    <p><strong>Столица:</strong> ${item.capital || '—'}</p>
                    <p><strong>Площадь:</strong> ${CountryAPI.formatArea(item.area)}</p>
                    <p><strong>Население:</strong> ${CountryAPI.formatPopulation(item.population)}</p>
                </div>
                <button class="detail-btn" data-id="${item.code}">Подробнее</button>
            `;

            card.querySelector('.detail-btn').addEventListener('click', () => 
                this.displayDetailedView(item.code));
            container.appendChild(card);
        });
    }

    createTableLayout(container) {
        container.className = 'table-layout';
        
        const table = document.createElement('table');
        table.className = 'country-table';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Флаг</th>
                    <th>Название</th>
                    <th>Регион</th>
                    <th>Столица</th>
                    <th>Площадь (км²)</th>
                    <th>Население</th>
                    <th>Опции</th>
                </tr>
            </thead>
            <tbody>
                ${this.data.map(item => `
                    <tr>
                        <td class="flag-cell">
                            <img src="https://flagcdn.com/w30/${item.code.toLowerCase()}.png" 
                                 alt="${item.name}"
                                 class="flag-img-small"
                                 onerror="this.onerror=null; this.src='https://flagcdn.com/w30/un.png'">
                        </td>
                        <td>${item.name}</td>
                        <td>${item.region || '—'}</td>
                        <td>${item.capital || '—'}</td>
                        <td>${CountryAPI.formatArea(item.area)}</td>
                        <td>${CountryAPI.formatPopulation(item.population)}</td>
                        <td>
                            <button class="table-btn" data-id="${item.code}">
                                Подробности
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        `;
        
        table.querySelectorAll('.table-btn').forEach(btn => {
            btn.addEventListener('click', (evt) => {
                this.displayDetailedView(evt.target.dataset.id);
            });
        });
        
        container.appendChild(table);
    }

    async displayDetailedView(countryCode) {
        try {
            this.ui.mainPanel.classList.add('hidden');
            this.ui.detailPanel.classList.remove('hidden');
            this.ui.detailLoader.classList.remove('hidden');
            this.ui.detailError.classList.add('hidden');
            this.ui.detailContent.innerHTML = '';
            
            this.currentSelection = await CountryAPI.getCountryFullInfo(countryCode);
            this.renderCountryDetails();
            
            this.ui.detailLoader.classList.add('hidden');
            
        } catch (err) {
            this.ui.detailLoader.classList.add('hidden');
            this.ui.detailError.classList.remove('hidden');
            this.ui.detailError.textContent = 'Не удалось загрузить информацию';
            console.error(err);
        }
    }

    renderCountryDetails() {
        const country = this.currentSelection;
        const container = this.ui.detailContent;
        const countryCode = (country.cca2 || country.code || '').toLowerCase();
        
        container.innerHTML = `
            <div class="detail-header">
                <div class="detail-flag-container">
                    <img src="https://flagcdn.com/w160/${countryCode}.png" 
                         alt="Флаг ${country.name.common}" 
                         class="detail-flag-img"
                         onerror="this.onerror=null; this.src='https://flagcdn.com/w160/un.png'">
                </div>
                <div class="detail-titles">
                    <h2 class="detail-name">${country.name?.common || country.name || 'Без названия'}</h2>
                    <p class="detail-official">${country.name?.official || ''}</p>
                </div>
            </div>
            
            <div class="detail-body">
                <div class="detail-column">
                    <section class="detail-section">
                        <h3>📋 Основные данные</h3>
                        <div class="info-grid">
                            <div class="info-item">
                                <span class="info-label">Регион</span>
                                <span>${country.region || ''} ${country.subregion ? `(${country.subregion})` : ''}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Столица</span>
                                <span>${country.capital?.[0] || country.capital || 'Не указана'}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Площадь</span>
                                <span>${CountryAPI.formatArea(country.area)}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Население</span>
                                <span>${CountryAPI.formatPopulation(country.population)}</span>
                            </div>
                        </div>
                    </section>
                    
                    <section class="detail-section">
                        <h3>🌐 Культура и экономика</h3>
                        <div class="info-grid">
                            <div class="info-item">
                                <span class="info-label">Языки</span>
                                <span>${country.languages ? Object.values(country.languages).join(', ') : 'Нет данных'}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Валюты</span>
                                <span>${country.currencies ? Object.values(country.currencies).map(c => 
                                    `${c.name} (${c.symbol || '—'})`).join(', ') : 'Нет данных'}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Независимость</span>
                                <span>${country.independent ? 'Да' : 'Нет'}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Член ООН</span>
                                <span>${country.unMember ? 'Да' : 'Нет'}</span>
                            </div>
                        </div>
                    </section>
                </div>
                
                <div class="detail-column">
                    <section class="detail-section">
                        <h3>🏳️ Флаг страны</h3>
                        <div class="flag-image-container">
                            <img src="https://flagcdn.com/w320/${countryCode}.png" 
                                 alt="Флаг ${country.name.common}" 
                                 class="flag-large-image"
                                 onerror="this.onerror=null; this.src='https://flagcdn.com/w320/un.png'">
                        </div>
                    </section>
                    
                    <section class="detail-section">
                        <h3>📍 Географическое положение</h3>
                        <div class="map-container" id="mapArea">
                            <p>Загрузка карты...</p>
                        </div>
                    </section>
                </div>
            </div>
        `;
        
        const coords = country.latlng || country.coordinates;
        if (coords && coords.length === 2) {
            
            setTimeout(() => this.displayMap(coords, country.name?.common || country.name), 100);
        }
    }

    displayMap(coords, title) {
        if (this.mapInstance) {
            this.mapInstance.remove();
        }
        
        const mapArea = document.getElementById('mapArea');
        if (!mapArea) return;
        
        mapArea.innerHTML = '';
        
        try {
            this.mapInstance = L.map('mapArea').setView(coords, 6);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© Картографические данные OpenStreetMap'
            }).addTo(this.mapInstance);
            
            L.marker(coords)
                .addTo(this.mapInstance)
                .bindPopup(`<strong>${title}</strong>`)
                .openPopup();
        } catch (err) {
            console.error('Ошибка создания карты:', err);
            mapArea.innerHTML = '<p>Не удалось загрузить карту</p>';
        }
    }

    returnToMainView() {
        this.ui.detailPanel.classList.add('hidden');
        this.ui.mainPanel.classList.remove('hidden');
        if (this.mapInstance) {
            this.mapInstance.remove();
            this.mapInstance = null;
        }
    }

    displayLoading() {
        this.ui.loadingIndicator.classList.remove('hidden');
        this.ui.errorDisplay.classList.add('hidden');
    }
    
    hideLoading() {
        this.ui.loadingIndicator.classList.add('hidden');
    }
    
    showErrorMessage(msg) {
        this.ui.errorDisplay.textContent = msg;
        this.ui.errorDisplay.classList.remove('hidden');
    }
    
    hideErrorMessage() {
        this.ui.errorDisplay.classList.add('hidden');
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const explorer = new WorldExplorer();
    window.app = explorer;
});