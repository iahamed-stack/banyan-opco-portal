export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  const { messages } = req.body;
  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        max_tokens: 1000,
        messages: messages
      })
    });
    const data = await r.json();
    if (data.error) {
      return res.status(200).json({ choices: [{ message: { content: `Error: ${data.error.message}` } }] });
    }
    const text = data.choices?.[0]?.message?.content || 'Unable to respond.';
    res.status(200).json({ choices: [{ message: { content: text } }] });
  } catch(e) {
    res.status(200).json({ choices: [{ message: { content: `Error: ${e.message}` } }] });
  }
}
