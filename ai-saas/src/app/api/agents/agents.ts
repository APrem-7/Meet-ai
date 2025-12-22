export async function fetchAgents() {
  const res = await fetch("http://localhost:8000/agents");

  if (!res.ok) {
    throw new Error("Failed to fetch agents");
  }

  return res.json();
}
