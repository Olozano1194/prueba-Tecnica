import { obtenerDatos } from "./api";

document.querySelector('#app').innerHTML = `
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Buscador de Amazon</h1>
    
    <!-- Formulario de búsqueda -->
    <form id="searchForm" class="mb-6">
      <div class="flex gap-2">
        <input 
          type="text" 
          id="keywordInput" 
          placeholder="Ejemplo: laptops, zapatos..." 
          class="flex-1 p-2 border rounded"
          required
        >
        <button 
          type="submit" 
          class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Buscar
        </button>
      </div>
    </form>
    
    <!-- Tabla de resultados -->
    <div class="bg-slate-800 p-6 rounded-lg shadow-md">
      <h3 class="text-lg font-bold text-center mb-6 text-white">Lista de Productos</h3>
      
      <!-- Mensaje de carga -->
      <div id="loading" class="hidden text-center text-white mb-4">
        <p>Buscando productos...</p>
      </div>
      
      <!-- Tabla -->
      <table id="products" class="w-full">
        <thead>
          <tr>
            <th class="border px-4 py-2 text-white">#</th>
            <th class="border px-4 py-2 text-white">Producto</th>
            <th class="border px-4 py-2 text-white">Enlace</th>
            <th class="border px-4 py-2 text-white">Precio</th>
          </tr>
        </thead>
        <tbody class="text-white"></tbody>
      </table>
    </div>
  </div>
`;

// Función para manejar el formulario
document.getElementById('searchForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const keyword = document.getElementById('keywordInput').value.trim();
  const tbody = document.querySelector('#products tbody');
  const loading = document.getElementById('loading');
  
  if (!keyword) {
    alert('Por favor ingresa un término de búsqueda');
    return;
  }

  try {
    // Mostrar carga
    loading.classList.remove('hidden');
    tbody.innerHTML = '';
    
    // Llamar a la API
    const response = await fetch(`http://localhost:3000/search?keyword=${encodeURIComponent(keyword)}`);
    
    if (!response.ok) throw new Error('Error al buscar productos');
    
    const { products } = await response.json();
    
    // Mostrar resultados
    if (products && products.length > 0) {
      tbody.innerHTML = products.map((product, index) => `
        <tr>
          <td class="border px-4 py-2">${index + 1}</td>
          <td class="border px-4 py-2">${product.title || 'No disponible'}</td>
          <td class="border px-4 py-2">
            <a href="${product.link}" target="_blank" class="text-blue-300 hover:underline">
              Ver producto
            </a>
          </td>
          <td class="border px-4 py-2">${product.price || 'No disponible'}</td>
        </tr>
      `).join('');
    } else {
      tbody.innerHTML = `
        <tr>
          <td colspan="4" class="border px-4 py-2 text-center">No se encontraron productos</td>
        </tr>
      `;
    }
  } catch (error) {
    console.error('Error:', error);
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="border px-4 py-2 text-center text-red-300">
          Error: ${error.message}
        </td>
      </tr>
    `;
  } finally {
    loading.classList.add('hidden');
  }
});
