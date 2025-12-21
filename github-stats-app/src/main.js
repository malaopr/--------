// DOM элементы
const repoInput = document.getElementById('repoInput');
const fetchButton = document.getElementById('fetchButton');
const errorMessage = document.getElementById('errorMessage');
const loadingIndicator = document.getElementById('loadingIndicator');
const repoCards = document.getElementById('repoCards');
const sortStarsAsc = document.getElementById('sortStarsAsc');
const sortStarsDesc = document.getElementById('sortStarsDesc');

// Переменные для хранения данных и графиков
let repositories = [];
let starsChart = null;
let sizesChart = null;

// Регулярное выражение для валидации формата репозитория
const repoRegex = /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/;

// Функция для валидации ввода
function validateInput(input) {
    console.log('Валидация ввода:', input);
    const repos = input.split('\n').filter(repo => repo.trim() !== '');
    
    if (repos.length === 0) {
        return { isValid: false, message: 'Введите хотя бы один репозиторий' };
    }
    
    for (const repo of repos) {
        if (!repoRegex.test(repo.trim())) {
            return { 
                isValid: false, 
                message: `Неверный формат: "${repo}". Используйте формат "владелец/название"`
            };
        }
    }
    
    return { isValid: true, repos: repos };
}

// Функция для отображения ошибки
function showError(message) {
    console.error('Ошибка:', message);
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

// Функция для скрытия ошибки
function hideError() {
    errorMessage.style.display = 'none';
}

// Функция для отображения индикатора загрузки
function showLoading() {
    loadingIndicator.style.display = 'block';
}

// Функция для скрытия индикатора загрузки
function hideLoading() {
    loadingIndicator.style.display = 'none';
}

// Функция для получения данных о репозитории
async function fetchRepoData(repoName) {
    console.log('Запрос данных для:', repoName);
    try {
        // Добавляем заголовки для избежания CORS проблем
        const response = await axios.get(`https://api.github.com/repos/${repoName}`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            },
            timeout: 10000
        });
        console.log('Данные получены для:', repoName, response.data);
        return response.data;
    } catch (error) {
        console.error('Ошибка при запросе:', repoName, error);
        if (error.response && error.response.status === 404) {
            throw new Error(`Репозиторий "${repoName}" не найден`);
        } else if (error.response && error.response.status === 403) {
            throw new Error('Превышен лимит запросов к API GitHub. Попробуйте позже.');
        } else if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
            throw new Error('Проблемы с сетью. Проверьте подключение к интернету.');
        } else {
            throw new Error(`Ошибка при получении данных: ${error.message}`);
        }
    }
}

// Функция для создания карточки репозитория
function createRepoCard(repo) {
    const card = document.createElement('div');
    card.className = 'repo-card';
    
    const sizeInMB = (repo.size / 1024).toFixed(2);
    
    card.innerHTML = `
        <div class="repo-header">
            <div>
                <div class="repo-name">${repo.full_name}</div>
                <div class="repo-stars">
                    <span>★</span> ${repo.stargazers_count.toLocaleString()}
                </div>
            </div>
            <div class="repo-language">${repo.language || 'N/A'}</div>
        </div>
        <div class="repo-description">${repo.description || 'Описание отсутствует'}</div>
        <div class="repo-stats">
            <div class="stat">
                <span>👁️</span> ${repo.watchers_count.toLocaleString()}
            </div>
            <div class="stat">
                <span>🍴</span> ${repo.forks_count.toLocaleString()}
            </div>
            <div class="stat">
                <span>📏</span> ${sizeInMB} MB
            </div>
        </div>
    `;
    
    return card;
}

// Функция для отображения карточек репозиториев
function renderRepoCards(repos) {
    console.log('Отрисовка карточек:', repos);
    repoCards.innerHTML = '';
    
    if (repos.length === 0) {
        repoCards.innerHTML = '<p>Нет данных для отображения</p>';
        return;
    }
    
    repos.forEach(repo => {
        const card = createRepoCard(repo);
        repoCards.appendChild(card);
    });
}

// Функция для создания графика звезд
function createStarsChart(repos) {
    const ctx = document.getElementById('starsChart');
    if (!ctx) {
        console.error('Canvas starsChart не найден');
        return;
    }
    
    if (starsChart) {
        starsChart.destroy();
    }
    
    const labels = repos.map(repo => repo.full_name);
    const data = repos.map(repo => repo.stargazers_count);
    
    starsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Количество звезд',
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Количество звезд по репозиториям'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Функция для создания круговой диаграммы размеров
function createSizesChart(repos) {
    const ctx = document.getElementById('sizesChart');
    if (!ctx) {
        console.error('Canvas sizesChart не найден');
        return;
    }
    
    if (sizesChart) {
        sizesChart.destroy();
    }
    
    const labels = repos.map(repo => repo.full_name);
    const data = repos.map(repo => repo.size / 1024);
    
    const backgroundColors = [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)',
        'rgba(199, 199, 199, 0.7)',
        'rgba(83, 102, 255, 0.7)',
        'rgba(40, 159, 64, 0.7)',
        'rgba(210, 99, 132, 0.7)'
    ];
    
    sizesChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors.slice(0, repos.length),
                borderColor: backgroundColors.map(color => color.replace('0.7', '1')),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                },
                title: {
                    display: true,
                    text: 'Размеры репозиториев (MB)'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            return `${label}: ${value.toFixed(2)} MB`;
                        }
                    }
                }
            }
        }
    });
}

// Функция для сортировки репозиториев по звездам
function sortRepositories(order) {
    console.log('Сортировка:', order);
    if (order === 'asc') {
        repositories.sort((a, b) => a.stargazers_count - b.stargazers_count);
        sortStarsAsc.classList.add('active');
        sortStarsDesc.classList.remove('active');
    } else {
        repositories.sort((a, b) => b.stargazers_count - a.stargazers_count);
        sortStarsAsc.classList.remove('active');
        sortStarsDesc.classList.add('active');
    }
    
    renderRepoCards(repositories);
    createStarsChart(repositories);
    createSizesChart(repositories);
}

// Обработчик клика по кнопке сбора статистики
fetchButton.addEventListener('click', async () => {
    console.log('Кнопка нажата');
    hideError();
    
    const validation = validateInput(repoInput.value);
    if (!validation.isValid) {
        showError(validation.message);
        return;
    }
    
    showLoading();
    fetchButton.disabled = true;
    
    try {
        console.log('Начинаем загрузку данных для репозиториев:', validation.repos);
        const repoDataPromises = validation.repos.map(repo => fetchRepoData(repo.trim()));
        const results = await Promise.allSettled(repoDataPromises);
        
        repositories = [];
        const errors = [];
        
        results.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                repositories.push(result.value);
            } else {
                errors.push(`Ошибка для "${validation.repos[index]}": ${result.reason.message}`);
            }
        });
        
        console.log('Загружено репозиториев:', repositories.length);
        console.log('Ошибки:', errors);
        
        if (repositories.length === 0) {
            showError('Не удалось загрузить данные ни для одного репозитория');
        } else {
            if (errors.length > 0) {
                showError(errors.join('\n'));
            }
            
            sortRepositories('desc');
        }
    } catch (error) {
        console.error('Общая ошибка:', error);
        showError(`Произошла ошибка: ${error.message}`);
    } finally {
        hideLoading();
        fetchButton.disabled = false;
    }
});

// Обработчики для кнопок сортировки
sortStarsAsc.addEventListener('click', () => sortRepositories('asc'));
sortStarsDesc.addEventListener('click', () => sortRepositories('desc'));

// Предзаполнение примерами для демонстрации
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, инициализация приложения');
    repoInput.value = `facebook/react\nmicrosoft/vscode\nvuejs/vue\ntensorflow/tensorflow`;
});

// Добавляем обработчик для Enter в textarea
repoInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && e.ctrlKey) {
        fetchButton.click();
    }
});

console.log('Script.js загружен');