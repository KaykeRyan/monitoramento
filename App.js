import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Splash from './Splash';
import Login from './login';
import Home from './home';
import Botao from './botao';
import Usuarios from './Usuarios';
import UsuarioDetalhe from './UsuarioDetalhe';
import Salas from './Salas';
import SalaDetalhe from './SalaDetalhe';

const Stack = createNativeStackNavigator();

// Tema personalizado escuro para o NavigationContainer
const temaEscuro = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#0a0a0a',
    card: '#141414',
    text: '#ffffff',
    border: '#333333',
    primary: '#ff1a1a',
  },
};

export default function App() {
  return (
    <>
      {/* Barra de status escura combinando com o tema */}
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      
      <NavigationContainer theme={temaEscuro}>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{ 
            headerShown: false,
            contentStyle: { backgroundColor: '#0a0a0a' }, // Fundo preto em todas as telas
            animation: 'fade', // Transição suave entre as telas
          }}
        >
          <Stack.Screen name="Splash" component={Splash} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Botao" component={Botao} />
          <Stack.Screen name="Usuarios" component={Usuarios} />
          <Stack.Screen name="UsuarioDetalhe" component={UsuarioDetalhe} />
          <Stack.Screen name="Salas" component={Salas} />
          <Stack.Screen name="SalaDetalhe" component={SalaDetalhe} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}