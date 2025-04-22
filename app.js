const express = require('express');
//dotenv sirve para cargar las variables de entorno desde un archivo .env
const dotenv = require("dotenv");
const axios = require('axios');
const cors = require('cors');
const { JSDOM } = require('jsdom');
const app = express();

dotenv.config();
const PORT = process.env.PORT || 3000;

// Configuramos CORS para permitir solicitudes desde el frontend
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));

// Middleware para analizar JSON
app.use(express.json());

app.get('/search', async (req, res) => {
    const keyword = req.query.keyword?.trim(); //Obtenemos la palabra clave de la consulta

    // Validamos que la palabra clave esté presente
    if (!keyword) {
        return res.status(400).json({ 
            error: 'Keyword is required',
            example: '/search?keyword=laptops'
        });
    }

    try {
        // configuramos la solicitud a Amazon
        const amazonUrl = `https://www.amazon.com/s?k=${keyword}`;
        const mercadoLibreUrl = `https://www.mercadolibre.com.co/search?q=${keyword}`;
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Referer': 'https://www.amazon.com/',
            'DNT': '1' // Do Not Track
          };
        
        
        // Realizamos la solicitud a Amazon con axios
        const { data } = await axios.get(amazonUrl, {
            headers,
            timeout: 5000
        });
        
        
        

        // Usamos JSDOM para analizar el HTML
        const dom = new JSDOM(data);
        const document = dom.window.document;        

        // Extraemos los detalles que necesitamos de la página
        const products = [];
        const productElements = document.querySelectorAll('.s-main-slot .s-result-item');

        // Iteramos sobre los elementos de productos y extraemos la información
        productElements.forEach((product) => {
            const title = product.querySelector('h2')?.textContent || 'No title found';
            const link = product.querySelector('a')?.href || '#';
            const price = product.querySelector('.a-price .a-offscreen')?.textContent || 'No price found';

            //Guardamos cada producto en el array
            products.push({ 
                title: title.trim(), 
                link: link.trim(), 
                price: price.trim() 
            });
        });
        
        // Enviamos la respuesta al cliente
        res.json({ products });

    } catch (error) {
        res.status(500).json({ error: 'Error fetching data from Amazon' });        
    }
});

app.listen(PORT, () => console.log(`Servidor: http://localhost:${PORT}`));