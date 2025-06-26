import { Polyglot } from "./Polyglot";
const getWeightedRandom = (data) =>{
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
        return entry;
      }
    }
  
    return null; // Should not reach here if totalWeight > 0
  }

const findBookMove =async (fen) => {
    const polyglot = new Polyglot();
    const move = await polyglot.getMovesFromFen(fen);
    const random = getWeightedRandom(move);
    console.log(random);
    if(random === null) return;
    console.log(fen);
    const lan = random.from + random.to;
    
    return {lan: lan};
    
}
export default findBookMove