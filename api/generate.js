export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { apiKey, messages, system, tools } = await req.json();

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    };

    if (tools) {
      headers['anthropic-beta'] = 'web-search-2025-03-05';
    }

    const body = {
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      system,
      messages,
    };

    if (tools) {
      body.tools = tools;
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify({ error: data.error?.message || 'API error' }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
