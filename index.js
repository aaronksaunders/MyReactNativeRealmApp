/**
 * @format
 */

import * as React from 'react';
import {AppRegistry} from 'react-native';
import {Colors, DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import {name as appName} from './app.json';
import App from './App';

const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: Colors.blue300,
      accent: Colors.blue100,
      text : Colors.blue900
    },
  };

export default function Main() {
  return (
    <PaperProvider theme={theme}>
      <App />
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
