import {
    stockfishLoop,
    sendCommandToStockfish,
    subscribeToStockfishOutput,
    subscribeToStockfishError,
    stopStockfish,
  } from '@loloof64/react-native-stockfish';
import { useEffect, useState, useCallback, useRef } from 'react';

const useCustomNativeStockfish = ({ onOutput, onError }) => {
    const isStockfishRunning = useRef(false);
    const start = useCallback(() => {
      console.log("restart")
        if (!isStockfishRunning.current) {
          isStockfishRunning.current = true;
          stockfishLoop();
        }
      }, []);
    const stop = useCallback(() => {
        if (isStockfishRunning.current) {
        stopStockfish();
        isStockfishRunning.current = false;
        }
    }, []);
    const sendCommand = useCallback((command) => {
      console.log(command);
        if (isStockfishRunning.current) {
          sendCommandToStockfish(command);
        } else {
          console.warn('Stockfish is not running. Cannot send command.');
        }
      }, []);
      useEffect(() => {
        const cancelOutputSubscription = subscribeToStockfishOutput(
          (output) => {
            if (isStockfishRunning.current && onOutput) {
              onOutput(output);
            }
          }
        );
    
        const cancelErrorSubscription = subscribeToStockfishError(
          (error) => {
            if (isStockfishRunning.current && onOutput) {
              onOutput(error);
            }
          }
        );
    
        return () => {
          // Clean up subscriptions and stop Stockfish
          cancelOutputSubscription();
          cancelErrorSubscription();
          stopStockfish();
        };
      }, [onOutput, onError, stopStockfish]);
      return { start, stop, sendCommand };
}

export default useCustomNativeStockfish