// File: /api/tiktok.js
// This is a Vercel Serverless Function that acts as a proxy to avoid CORS errors.

export default async function handler(request, response) {
  // Get the TikTok URL from the query parameter
  const videoUrl = request.query.url;

  if (!videoUrl) {
    return response.status(400).json({ error: 'URL parameter is missing' });
  }

  // The original API endpoint
  const apiKey = 'https://aemt.me/download/tiktokdl?url=';
  const requestUrl = `${apiKey}${encodeURIComponent(videoUrl)}`;

  try {
    // Fetch data from the actual API on the server-side
    const apiResponse = await fetch(requestUrl);
    
    // Check if the external API call was successful
    if (!apiResponse.ok) {
        // Forward the error from the external API
        const errorData = await apiResponse.text();
        return response.status(apiResponse.status).json({ error: `API request failed: ${errorData}` });
    }
    
    // Get the JSON data from the API response
    const data = await apiResponse.json();

    // Send the data back to your frontend
    // Set cache control headers to prevent stale data
    response.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate');
    response.status(200).json(data);

  } catch (error) {
    // Handle any network or other errors during the fetch
    console.error(error);
    response.status(500).json({ error: 'An internal server error occurred.' });
  }
}
