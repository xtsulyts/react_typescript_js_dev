// netlify/functions/pexels-proxy.js
exports.handler = async (event) => {
    // Para más seguridad, puedes validar el origen aquí
    // const origin = event.headers.origin;
    // const allowedOrigins = ['https://eshopshoes.netlify.app'];

    try {
        // Extrae los parámetros de la petición, si los hay
        const { query = 'sneakers+shoes', per_page = 80, orientation = 'landscape', size = 'medium' } = event.queryStringParameters;

        // Construye la URL de Pexels. ¡IMPORTANTE: Mueve tu API_KEY aquí!
        const PEXELS_API_KEY = '9tNEjFhwUIus25QDwOd8iywPhg5QEyYDWiVS9NlvWfD2MeSClgYAU125';
        const pexelsUrl = `https://api.pexels.com/v1/search?query=${query}&per_page=${per_page}&orientation=${orientation}&size=${medium}`;

        // Realiza la petición a Pexels desde el servidor (sin restricciones CORS)
        const response = await fetch(pexelsUrl, {
            headers: {
                'Authorization': PEXELS_API_KEY
            }
        });

        const data = await response.json();

        // Responde al frontend con los encabezados CORS que permitan tu origen
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': 'https://eshopshoes.netlify.app', // ¡Especifica tu dominio!
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify(data),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error al obtener las imágenes' }),
        };
    }
};