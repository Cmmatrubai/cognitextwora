export default async function handler(req, res) {
  // Extract path and query params from incoming URL
  // e.g. /api/v1/simplify?foo=bar -> /v1/simplify?foo=bar
  const path = req.url.replace(/^\/api/, '');
  const targetUrl = `https://cognitext.feeltiptop.com/api${path}`;

  // Clone headers
  const headers = { ...req.headers };
  
  // Override or delete headers that trigger CORS or host mismatch issues
  headers.host = 'cognitext.feeltiptop.com';
  headers.origin = 'https://cognitext.feeltiptop.com';
  headers.referer = 'https://cognitext.feeltiptop.com/';

  try {
    const fetchOptions = {
      method: req.method,
      headers: headers,
    };

    // Forward request body for non-GET/HEAD methods
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      if (req.body) {
        if (typeof req.body === 'object') {
          fetchOptions.body = JSON.stringify(req.body);
        } else {
          fetchOptions.body = req.body;
        }
      }
    }

    const response = await fetch(targetUrl, fetchOptions);
    const bodyText = await response.text();

    // Copy status code
    res.status(response.status);

    // Copy response headers (excluding headers that can break Vercel or CORS)
    const headersToIgnore = [
      'content-encoding',
      'content-length',
      'transfer-encoding',
      'connection',
      'access-control-allow-origin',
      'access-control-allow-credentials',
      'access-control-allow-methods',
      'access-control-allow-headers'
    ];

    response.headers.forEach((value, key) => {
      if (!headersToIgnore.includes(key.toLowerCase())) {
        res.setHeader(key, value);
      }
    });

    // Send body
    res.send(bodyText);
  } catch (error) {
    console.error('Vercel API Proxy Error:', error);
    res.status(500).json({ error: 'Proxy Server Error', details: error.message });
  }
}
