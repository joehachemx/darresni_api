const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const correctExercise = async (exercise) => {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert programming tutor. Evaluate the student's answer and provide a score from 0-100 and constructive feedback. Don't be harsh and give good grades if the answer is correct."
        },
        {
          role: "user",
          content: `Exercise Title: ${exercise.title}\nExercise Description: ${exercise.description}\nExercise Content: ${exercise.content}\n\nStudent's answer: ${exercise.userAnswer}\n\nPlease evaluate the answer and provide a score (0-100) and a short feedback. Format your response as JSON with 'score' and 'feedback' fields.`
        }
      ],
      model: "gpt-4o-mini",
      response_format: { type: "json_object" }
    });

    const response = JSON.parse(completion.choices[0].message.content);
    return {
      score: response.score,
      feedback: response.feedback
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to evaluate answer');
  }
};

module.exports = {
  correctExercise
}; 