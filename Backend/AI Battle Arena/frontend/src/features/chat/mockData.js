export const mockChats = [
  {
    id: "chat-1",
    title: "Fetch data in React",
    messages: [
      {
        id: "msg-1-1",
        role: "user",
        content: "Give me a clean and readable function to do this",
      },
      {
        id: "msg-1-2",
        role: "battle",
        result: {
          problem: "Write a function to fetch data from an API",
          solution_1: `Here's a simple approach using synchronous logic:

\`\`\`javascript
async function fetchUserData(userId) {
  const response = await fetch("https://api.example.com/users/" + userId);
  const data = await response.text();

  let user;
  try {
    user = JSON.parse(data);
  } catch (err) {
    throw new Error("Invalid JSON response");
  }

  if (!response.ok) {
    return { success: false, status: response.status, user: null };
  }

  const { id, name, email } = user;

  if (id !== userId) {
    console.log("The id in the data does not match the id requested");
  }

  return { success: true, status: response.status, user: { id, name, email } };
}
\`\`\`

This keeps everything explicit: it validates the response, parses safely, and returns a consistent shape.`,
          solution_2: `Here's a clean, modern approach:

\`\`\`javascript
async function fetchUserData(userId) {
  const res = await fetch("https://api.example.com/users/" + userId);
  if (!res.ok) throw new Error("Request failed with status " + res.status);

  const user = await res.json();
  return { id: user.id, name: user.name, email: user.email };
}
\`\`\`

Uses \`res.json()\` so no manual parsing, throws early on failures, and returns only the fields you need.`,
          judge: {
            solution_1_score: 6,
            solution_2_score: 9,
            solution_1_feedback:
              "Solution 1 is verbose but reasonably safe. There is odd manual JSON parsing when res.json() exists, an id match check that is only logged rather than handled, and string concatenation instead of URL params. The logic works, but it is not clean and readable as asked.",
            solution_2_feedback:
              "Solution 2 is concise, handles errors early, avoids manual parsing, and returns only the fields needed. Fully meets the 'clean and readable' requirement.",
            winner: "solution_2",
          },
        },
      },
    ],
  },
  {
    id: "chat-2",
    title: "Is 17 a prime number?",
    messages: [
      { id: "msg-2-1", role: "user", content: "Is 17 a prime number?" },
      {
        id: "msg-2-2",
        role: "battle",
        result: {
          problem: "Is 17 a prime number?",
          solution_1:
            "17 is prime. Its only divisors are 1 and 17; checking numbers 2 through 4 (up to the square root of 17 ≈ 4.12) shows none divide it evenly.",
          solution_2:
            "Yes, 17 is a prime number. A prime number has exactly two factors. For 17, testing division by 2, 3, and 4 (since 4² = 16 < 17 < 25 = 5²) yields no clean divisions, so it has no factors besides 1 and itself.",
          judge: {
            solution_1_score: 9,
            solution_2_score: 9,
            solution_1_feedback:
              "Concise, correct, and mentions the square-root checking strategy, which is exactly how primality should be checked.",
            solution_2_feedback:
              "Also correct and explains how primality is verified. Slightly more wordy with the same depth of explanation.",
            winner: "tie",
          },
        },
      },
    ],
  },
  {
    id: "chat-3",
    title: "Two-sum problem",
    messages: [
      { id: "msg-3-1", role: "user", content: "Solve the two-sum problem efficiently" },
      {
        id: "msg-3-2",
        role: "battle",
        error: "Battle failed. Please try again.",
      },
    ],
  },
]
