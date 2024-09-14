
export async function addScores(name: string, team: string, score: number) {
    const response = await fetch('http://localhost:5000/api/scores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        team,
        score,
      }),
    });
  
    if (!response.ok) {
      throw new Error('Failed to add score');
    }
  
    return await response.json();
  }
  