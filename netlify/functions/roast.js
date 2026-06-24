exports.handler = async (event) => {
  const { resume } = JSON.parse(event.body);

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `You are a brutally honest senior developer. Roast this resume in a funny but helpful way. Point out weaknesses, missing things, and give real advice. Resume: ${resume}`
        }
      ]
    })
  });

  const data = await response.json();

  return {
    statusCode: 200,
    body: JSON.stringify({ roast: data.content[0].text })
  };
};