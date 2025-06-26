import React, { useState, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { BottomNavigation, Text } from 'react-native-paper';
import { router, Tabs, useNavigation } from 'expo-router';
import TabBar from '../../lib/components/TabBar';
import TabsHeader from '../../lib/components/TabHeader';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const TabLayout = () => {
  return (<>
      <Tabs
        tabBar={(props) => <TabBar {...props} />}
        screenOptions={{
          tabBarHideOnKeyboard: true,
          animation: 'shift',
          header: (props) => <TabsHeader navProps={props} children={undefined} />,
        }}
    >
      <Tabs.Screen name={'play'} options={
        {
          headerShown: false,
          title: 'Home',
          tabBarIcon: (props) => (
            <MaterialCommunityIcons
              {...props}
              size={24}
              name={props.focused ? 'home' : 'home-outline'}
            />
        ),   
      }}/>
      <Tabs.Screen name={'puzzle'} options={
        {
          headerShown: false,
          
          title: 'Puzzles',
          tabBarIcon: (props) => (
            <MaterialCommunityIcons
              {...props}
              size={24}
              name={props.focused ? 'puzzle' : 'puzzle-outline'}
            />
        ),   
      }}/>
      <Tabs.Screen name={'more'} options={
        {
          headerShown: false,
          
          title: 'More',
          tabBarIcon: (props) => (
            <MaterialCommunityIcons
              {...props}
              size={24}
              name={'dots-horizontal'}
            />
        ),   
      }}/>


      </Tabs>
    </>)
};

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
});

export default TabLayout;