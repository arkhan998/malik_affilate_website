// File: /api/scrape.js
// This is a Vercel Serverless Function to scrape download links from ssstik.io

export default async function handler(request, response) {
  // Get the TikTok URL from the query parameter sent by the frontend
  const videoUrl = request.query.url;

  if (!videoUrl) {
    return response.status(400).json({ error: 'TikTok URL is required.' });
  }

  // The endpoint for ssstik.io's download logic
  const SSS_URL = 'https://ssstik.io/abc?url=dl';

  try {
    // We need to mimic a form submission to ssstik.io's server
    const params = new URLSearchParams();
    params.append('id', videoUrl);
    params.append('locale', 'en');

    // Make the POST request to ssstik.io
    const sssResponse = await fetch(SSS_URL, {
      method: 'POST',
      body: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36'
      },
    });

    // Check if the request to ssstik.io was successful
    if (!sssResponse.ok) {
      throw new Error(`ssstik.io server responded with status: ${sssResponse.status}`);
    }

    // Get the HTML content from the response
    const html = await sssResponse.text();

    // --- Use Regular Expressions to parse the HTML and find the data ---

    // Find the "Without Watermark" download link
    const noWatermarkLinkMatch = html.match(/<a href="([^"]+)" class="[^"]*without_watermark/);
    const noWatermarkLink = noWatermarkLinkMatch ? noWatermarkLinkMatch[1] : null;
    
    // Find the "MP3" download link
    const mp3LinkMatch = html.match(/<a href="([^"]+)" class="[^"]*music/);
    const mp3Link = mp3LinkMatch ? mp3LinkMatch[1] : null;

    // Find the video thumbnail/cover image
    const coverImageMatch = html.match(/<img class="result_author" src="([^"]+)"/);
    const cover = coverImageMatch ? coverImageMatch[1] : null;

    // Find the video title
    const titleMatch = html.match(/<p class="maintext">([^<]+)<\/p>/);
    const title = titleMatch ? titleMatch[1].trim() : "TikTok Video";

    // If we couldn't find the main download link, the scrape probably failed
    if (!noWatermarkLink) {
        throw new Error('Could not find download links. The TikTok link might be invalid or the video is private.');
    }

    // Send the extracted data back to our frontend
    response.status(200).json({
      status: true,
      result: {
        title,
        cover,
        links: {
          noWatermark: noWatermarkLink,
          mp3: mp3Link,
        },
      },
    });

  } catch (error) {
    console.error('Scraping Error:', error);
    response.status(500).json({ status: false, message: error.message });
  }
}
