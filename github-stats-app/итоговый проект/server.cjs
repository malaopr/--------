const serverModule = require('http');
const fileSystem = require('fs');
const pathHandler = require('path');
const urlProcessor = require('url');

const SERVER_PORT = 3000;
const DATA_SOURCE = pathHandler.join(__dirname, 'countries.json');

let countryDataSet = [];

function initializeData() {
    try {
        console.log('Загрузка данных из:', DATA_SOURCE);
        const fileContent = fileSystem.readFileSync(DATA_SOURCE, 'utf8');
        countryDataSet = JSON.parse(fileContent);
        console.log('Данные загружены:', countryDataSet.length, 'стран');
    } catch (err) {
        console.error('Ошибка загрузки данных:', err);
        process.exit(1);
    }
}

initializeData();

const requestHandler = (request, response) => {
    const processedUrl = urlProcessor.parse(request.url, true);
    const route = processedUrl.pathname;

    
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (request.method === 'OPTIONS') {
        response.writeHead(200);
        response.end();
        return;
    }

    
    if (route === '/api/countries') {
        processCountryList(request, response, processedUrl.query);
    } else if (route.startsWith('/api/countries/')) {
        const countryCode = route.split('/').pop();
        processSingleCountry(request, response, countryCode);
    } else {
        
        serveStaticFile(request, response);
    }
};

function processCountryList(request, response, queryParams) {
    try {
        console.log('API запрос /countries с параметрами:', queryParams);
        
        let result = [...countryDataSet];
        
        
        if (queryParams.search) {
            const searchTerm = queryParams.search.toLowerCase();
            result = result.filter(country => {
                
                if (country.name.common.toLowerCase().includes(searchTerm)) return true;
                if (country.name.official.toLowerCase().includes(searchTerm)) return true;
                
                
                if (country.translations) {
                    return Object.values(country.translations).some(trans => 
                        (trans.common && trans.common.toLowerCase().includes(searchTerm)) ||
                        (trans.official && trans.official.toLowerCase().includes(searchTerm))
                    );
                }
                return false;
            });
        }
        
        if (queryParams.region) {
            result = result.filter(country => country.region === queryParams.region);
        }
        
        const populationMin = parseInt(queryParams.minPopulation);
        const populationMax = parseInt(queryParams.maxPopulation);
        if (!isNaN(populationMin)) {
            result = result.filter(country => country.population >= populationMin);
        }
        if (!isNaN(populationMax)) {
            result = result.filter(country => country.population <= populationMax);
        }
        
        const areaMin = parseInt(queryParams.minArea);
        const areaMax = parseInt(queryParams.maxArea);
        if (!isNaN(areaMin)) {
            result = result.filter(country => country.area >= areaMin);
        }
        if (!isNaN(areaMax)) {
            result = result.filter(country => country.area <= areaMax);
        }
        
        
        const formatted = result.map(country => ({
            code: country.cca3,
            name: country.name.common,
            flag: country.flag,
            region: country.region,
            capital: country.capital ? country.capital[0] : '',
            area: country.area,
            population: country.population,
            coordinates: country.latlng,
            translations: country.translations || {}
        }));
        
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(formatted));
        
    } catch (error) {
        console.error('Ошибка обработки запроса:', error);
        response.writeHead(500, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: 'Internal server error' }));
    }
}

function processSingleCountry(request, response, code) {
    try {
        console.log('API запрос деталей страны:', code);
        
        const country = countryDataSet.find(c => 
            c.cca3 === code || c.cca2 === code
        );
        
        if (!country) {
            response.writeHead(404, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ error: 'Country not found' }));
            return;
        }
        
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(country));
        
    } catch (error) {
        console.error('Ошибка:', error);
        response.writeHead(500, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: 'Internal server error' }));
    }
}

function serveStaticFile(request, response) {
    let filePath = request.url === '/' ? '/index.html' : request.url;
    filePath = pathHandler.join(__dirname, filePath);
    
    const extname = pathHandler.extname(filePath);
    let contentType = 'text/html';
    
    switch (extname) {
        case '.js': contentType = 'text/javascript'; break;
        case '.css': contentType = 'text/css'; break;
        case '.json': contentType = 'application/json'; break;
        case '.png': contentType = 'image/png'; break;
        case '.jpg': contentType = 'image/jpg'; break;
        case '.svg': contentType = 'image/svg+xml'; break;
    }
    
    fileSystem.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                fileSystem.readFile(pathHandler.join(__dirname, 'index.html'), (err, html) => {
                    if (err) {
                        response.writeHead(404);
                        response.end('File not found');
                    } else {
                        response.writeHead(200, { 'Content-Type': 'text/html' });
                        response.end(html);
                    }
                });
            } else {
                response.writeHead(500);
                response.end('Server error: ' + error.code);
            }
        } else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content);
        }
    });
}

const server = serverModule.createServer(requestHandler);

server.listen(SERVER_PORT, () => {
    console.log(`Сервер запущен на http://localhost:${SERVER_PORT}`);
    console.log(`Папка проекта: ${__dirname}`);
    console.log(`Доступные эндпоинты:`);
    console.log(`   GET /api/countries - список стран с фильтрацией`);
    console.log(`   GET /api/countries/{code} - детали страны`);
});