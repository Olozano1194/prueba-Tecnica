const express = require('express');
//dotenv sirve para cargar las variables de entorno desde un archivo .env
const dotenv = require("dotenv");
const axios = require('axios');
const { JSDOM } = require('jsdom');
const app = express();

dotenv.config();
const PORT = process.env.PORT || 3000;

// Middleware para analizar JSON
app.use(express.json());

app.get('/search', async (req, res) => {
    const keyword = req.query.keyword?.trim(); //Obtenemos la palabra clave de la consulta

    // Validamos que la palabra clave esté presente
    if (!keyword) {
        return res.status(400).json({ 
            error: 'Keyword is required',
            example: '/search?keyword=laltops'
        });
    }

    try {
        // configuramos la solicitud a Amazon
        const amazonUrl = `https://www.amazon.com/s?k=${keyword}`;
        
        // Realizamos la solicitud a Amazon con axios
        const { data } = await axios.get(amazonUrl);

        // Usamos JSDOM para analizar el HTML
        const dom = new JSDOM(data);
        const document = dom.window.document;        

        // Extraemos los detalles que necesitamos de la página
        const products = [];
        const productEelements = document.querySelectorAll('.s-main-slot .s-result-item');

        // Iteramos sobre los elementos de productos y extraemos la información
        productEelements.forEach((product) => {
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