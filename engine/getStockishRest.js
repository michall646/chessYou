import { fetch } from 'expo/fetch';
import findBookMove from './findBookMove';


const getWeightedRandom = (data) =>{
  console.log(data);
  if (!data || data.length === 0) {
    return null;
  }

  const totalWeight = data.reduce((sum, entry) => sum + (entry.weight || 0), 0);

  if (totalWeight <= 0) {
    return data[Math.floor(Math.random() * data.length)] || null; // Fallback to uniform random
  }

  const randomNumber = Math.random() * totalWeight;
  let cumulativeWeight = 0;

  for (const entry of data) {
    const weight = entry.weight || 0;
    cumulativeWeight += weight;
    if (randomNumber <= cumulativeWeight) {
      console.log(entry)
      return entry;
    }
  }

  return null; // Should not reach here if totalWeight > 0
}

const skillTable = [
  [{depth: 1, weight: 3},{depth: 2, weight: 2}],
  [{depth: 1, weight: 2},{depth: 2, weight: 2},{depth: 3, weight: 1}],
  [{depth: 3, weight: 3},{depth: 4, weight: 2},{depth: 6, weight: 1}],//3.8
  [{depth: 3, weight: 1},{depth: 4, weight: 1},{depth: 5, weight: 3}],//4.4
  [{depth: 4, weight: 2},{depth: 5, weight: 2},{depth: 6, weight: 2}],//5.0
  [{depth: 4, weight: 1},{depth: 5, weight: 2},{depth: 6, weight: 3}],//5.3
  [{depth: 5, weight: 2},{depth: 6, weight: 2},{depth: 7, weight: 2}],//6.0
  [{depth: 6, weight: 3},{depth: 7, weight: 2},{depth: 9, weight: 1}],//6.8
  [{depth: 7, weight: 1},{depth: 8, weight: 2},{depth: 9, weight: 2}],//8.2
  [{depth: 9, weight: 3},{depth: 10, weight: 2},{depth: 11, weight: 1}],//9.6
  [{depth: 9, weight: 2},{depth: 10, weight: 2},{depth: 11, weight: 3}],//10.1
  [{depth: 10, weight: 1},{depth: 11, weight: 2},{depth: 12, weight: 2}],//11.2
  [{depth: 12, weight: 2},{depth: 13, weight: 3},{depth: 15, weight: 2}],//13.2
  [{depth: 13, weight: 2},{depth: 14, weight: 3},{depth: 16, weight: 2}],//14.2
  [{depth: 16, weight: 1}],//16.0
]

const getStockishRest = async (fen, skill, callback, showError) => {
  console.log("rest bot")
    const getDepth = (skill) => {
      return getWeightedRandom(skillTable[skill]).depth;
    }
    console.log(fen)
    const baseUrl = 'https://stockfish.online/api/s/v2.php';
    const depth = getDepth(skill);
    const params = {
        fen: fen,
        depth: depth,
        // Add more parameters as needed
    };
    const queryString = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');

    const urlWithParams = `${baseUrl}?${queryString}`;
    try{
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), 10000);

        const response = await Promise.race([
          fetch(urlWithParams, { signal: controller.signal }),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), 10000)
          )
        ]);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
          }
        const json = await response.json();
        console.log(json)
        const regex = /\b[a-h][1-8][a-h][1-8][qnbr]?\b/;
        const match = json.bestmove.match(regex);
        let move = null;
        if (match) {
            move = {lan: match[0]};
            console.log(move);
          } else {
            console.log("No move found");
          }
        console.log(callback)
        callback([null, move])

    }
    catch(error){
      console.log(error)
       if (error.name === 'AbortError') {
        showError("timeout")
       }
       else{
        showError(error.message)
       }
    }
    

}

export default getStockishRest