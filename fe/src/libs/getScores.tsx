
export default async function getScores() {
  

    const response = await fetch('http://localhost:5000/api/scores');
    if(!response.ok){
        throw new Error("failed to fetch scores")
    }

  return await response.json();
}
