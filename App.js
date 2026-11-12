import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import CadastroScreen from './screens/CadastroScreen';
import HomeScreen from './screens/HomeScreen';
import AjudaScreen from './screens/AjudaScreen';
import UsuariosScreen from './screens/UsuariosScreen';
import UsuarioDetalheScreen from './screens/UsuarioDetalheScreen';
import SalasScreen from './screens/SalasScreen';
import SalaDetalheScreen from './screens/SalaDetalheScreen';
import AudioScreen from './screens/AudioScreen';
import ChamadosScreen from './screens/ChamadosScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Ajuda" component={AjudaScreen} options={{ title: 'Solicitação de Ajuda' }} />
        <Stack.Screen name="Usuarios" component={UsuariosScreen} options={{ title: 'Usuários' }} />
        <Stack.Screen name="UsuarioDetalhe" component={UsuarioDetalheScreen} options={{ title: 'Detalhes do Usuário' }} />
        <Stack.Screen name="Salas" component={SalasScreen} options={{ title: 'Minhas Salas' }} />
        <Stack.Screen name="SalaDetalhe" component={SalaDetalheScreen} options={{ title: 'Editar Sala' }} />
        <Stack.Screen name="Audio" component={AudioScreen} options={{ title: 'Áudio' }} />
        <Stack.Screen name="Chamados" component={ChamadosScreen} options={{ title: 'Chamados' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}