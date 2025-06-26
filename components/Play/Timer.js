import { View, Text } from 'react-native'
import React from 'react'
import { useTimer } from 'use-timer';
import { useRef } from 'react';

const useCustomTimer = (seconds, expire) => {
    const miliseconds = seconds * 1000;
    const { time, start, pause, reset, status, advanceTime } = useTimer(
      {
        initialTime: miliseconds,
        timerType: 'DECREMENTAL',
        interval: 200,
        step: 200,
        endTime: 0,
        onTimeOver: expire
      }
    );
    return [time, start, pause, reset, status, advanceTime]
}

export default useCustomTimer