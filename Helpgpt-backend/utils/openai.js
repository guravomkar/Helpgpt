import "dotenv/config";

const getOpenAIAPResponse = async (message) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
    model: "llama-3.3-70b-versatile",   // ....
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    }),
  };

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions", //....
      options
    );

    const data = await response.json();

    console.log("Groq API Response:", data);

    if (!data.choices || data.choices.length === 0) {
      console.error("Invalid Groq response:", data);
      return "No response generated from AI.";
    }

    return data.choices[0].message.content;

  } catch (err) {
    console.error("Error fetching AI response:", err);
    return "Sorry, I couldn’t generate a response.";
  }
};

export default getOpenAIAPResponse;