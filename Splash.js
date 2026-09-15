import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function Splash({ navigation }) {
  return (
    <View style={styles.container}>
      {/* AQUI ESTÁ A CORREÇÃO: simion.png em vez de simon.png */}
      <Image 
        source={require('./assets/simion.png')}
        style={styles.logo} 
        resizeMode="contain"
      />
      
      <Text style={styles.title}>Sistema de Alerta</Text>
      <Text style={styles.subtitle}>Monitoramento Inteligente</Text>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.replace('Login')}
      >
        <Text style={styles.buttonText}>INICIAR</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a', // Fundo preto
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 24,
    borderWidth: 3,
    borderColor: '#ff1a1a', // Borda vermelha
    borderRadius: 100, // Deixa redondo
    shadowColor: '#ff1a1a',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#b0b0b0',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 40,
    letterSpacing: 1,
  },
  button: {
    backgroundColor: '#ff1a1a',
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 50,
    shadowColor: '#ff1a1a',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 15,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2,
  },
});