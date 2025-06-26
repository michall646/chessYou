
import { useEffect, useState, useCallback, useRef } from 'react';
import useCustomNativeStockfish from './useCustomNativeStockfish';

const useNativeStockfish = (onOutput) => {
  const {start, stop, sendCommand} = useCustomNativeStockfish({
    onOutput: useCallback((output) => {
        handleResponse(output);
    }, []),
    onError: useCallback((error) => {
        console.log("error" + error);
    }, [])
  });
  const lastResponse = useRef("");

  const handleResponse = (output) => {
    
    
    if(output === "") return
    if(output.trim() == "restart") {
      stop();
      start();
      return
    }
    console.log(output)
    const reg = /^[a-h][1-8][a-h][1-8][qknb]*/;
    const match = output.match(reg);
    if (match && lastResponse.current !== " ponder ") {
        console.log(lastResponse.current.length, lastResponse.current.length)
        const move = {lan: match[0]};
        console.log(move);

        onOutput([null, move])

    }
    lastResponse.current = output;
    
  }

  useEffect(() => {
    start();

  }, []);
  

    return {start, stop, sendCommand}
}

export default useNativeStockfish