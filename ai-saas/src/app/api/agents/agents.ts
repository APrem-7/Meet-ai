export async function fetchAgents() {
  const res = await fetch("http://localhost:8000/agents");

  if (!res.ok) {
    throw new Error("Failed to fetch agents");
  }

  return res.json();
}

async function createAgent(data: { name: string; description: string }) {
  const res = await fetch("http://localhost:8000/agents", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // IMPORTANT for cookies/session
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to create agent");
  }

  return res.json();
}
