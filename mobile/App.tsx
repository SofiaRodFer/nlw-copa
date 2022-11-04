import React from 'react'
import { NativeBaseProvider, Center, StatusBar } from 'native-base';

import { AuthContextProvider } from './src/contexts/AuthContext';

import { SignIn } from './src/screens/SignIn';

import { Loading } from './src/components/Loading';

import { useFonts, Roboto_400Regular, Roboto_500Medium, Roboto_700Bold } from '@expo-google-fonts/roboto'
import { THEME } from './src/styles/theme'

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold
  })

  return (
    <NativeBaseProvider theme={THEME}>
      <AuthContextProvider>
        <StatusBar 
          barStyle='light-content'
          backgroundColor="transparent"
          translucent
        />
        <SignIn />
        {/* { fontsLoaded ? <SignIn /> : <Loading /> } */}
      </AuthContextProvider>
    </NativeBaseProvider>
  );
}

