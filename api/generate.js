export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { apiKey, messages, system, tools } = req.body;

    if (!apiKey) {
      return res.status(400).json({ error: 'API key required' });
    }

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages required' });
    }

    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    };

    if (tools && tools.length > 0) {
      headers['anthropic-beta'] = 'web-search-2025-03-05';
    }

    const requestBody = {
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      messages,
    };

    if (system) {
      requestBody.system = system;
    }

    if (tools && tools.length > 0) {
      requestBody.tools = tools;
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: data.error?.message || `Claude API error: ${response.status}` 
      });
    }

    return res.status(200).json(data);

  } catch (err) {
    console.error('API Error:', err);
    return res.status(500).json({ error: `Server error: ${err.message}` });
  }
}
