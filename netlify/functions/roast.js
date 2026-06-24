exports.handler = async (event) => {
  try {
    const { resume } = JSON.parse(event.body);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a brutally honest senior developer. Roast this resume in a funny but helpful way. Point out weaknesses, missing things, and give real advice. Resume: ${resume}`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();
    const roast = data.candidates[0].content.parts[0].text;

    return {
      statusCode: 200,
      body: JSON.stringify({ roast })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};