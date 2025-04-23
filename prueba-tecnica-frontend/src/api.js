
export const obtenerDatos = async (keyword) => {
    const tbody = document.querySelector('#products tbody');

    //Limpiamos el contenido actual de la tabla
    tbody.innerHTML = '';

    try {
        const url = `http://localhost:3000/search?keyword=${keyword}`;

        // Realizamos la petición a la API
        const response = await fetch(url);
        // Verificamos si la respuesta es correcta (código 200)
        if (!response.ok) {
            throw new Error('Error en la respuesta de la API');
        }
        // Convertimos la respuesta a formato JSON
        const data = await response.json();

        // Verificamos si hay productos en la respuesta
        if (data.length === 0) {
            const noResultsRow = document.createElement('tr');
            noResultsRow.innerHTML = '<td colspan="4" class="text-center">No se encontraron productos</td>';
            tbody.appendChild(noResultsRow);
        } else {
            // Recorremos los productos y los añadimos a la tabla
            data.forEach((product, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="border-l-2 border-t-2 border-b-2 border-slate-700 px-4 py-2 text-center lg:text-lg font-bold xl:text-xl">${index + 1}</td>
                    <td class="border-t-2 border-b-2 border-slate-700 px-4 py-2 text-center md:text-lg font-bold xl:text-xl">${product.title}</td>
                    <td class="border-t-2 border-b-2 border-slate-700 px-4 py-2 text-center lg:text-lg font-bold xl:text-xl"><a href="${product.link}" target="_blank">Ver producto</a></td>
                    <td class="border-t-2 border-b-2 border-slate-700 px-4 py-2 text-center lg:text-lg font-bold xl:text-xl">$${product.price}</td>
                `;
                tbody.appendChild(row);
            });
            
        }

    } catch (error) {
        console.error('Error al obtener los datos:', error);
        const errorRow = document.createElement('tr');
        errorRow.innerHTML = '<td colspan="4" class="text-center">Error al obtener los datos</td>';
        tbody.appendChild(errorRow);
    }
};