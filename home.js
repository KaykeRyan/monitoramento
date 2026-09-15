import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';

export default function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />

      <Text style={styles.titulo}>Bem-vindo à Home!</Text>
      <Text style={styles.subtitulo}>Projeto SENAI - Monitoramento</Text>

      <TouchableOpacity
        style={styles.botao}
        onPress={() => navigation.navigate('Botao')}
        activeOpacity={0.8}
      >
        <Text style={styles.textoBotao}>Ir para a página do Botão</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.botao, { backgroundColor: '#e60000', marginTop: 16 }]}
        onPress={() => navigation.navigate('Login')}
        activeOpacity={0.8}
      >
        <Text style={styles.textoBotao}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 24, 
    backgroundColor: '#0a0a0a', // Fundo preto
  },
  titulo: { 
    fontSize: 28, 
    fontWeight: '900', 
    marginBottom: 10, 
    color: '#ffffff', // Texto branco
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    textAlign: 'center',
    textShadowColor: 'rgba(255, 26, 26, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  subtitulo: { 
    fontSize: 16, 
    color: '#b0b0b0', // Cinza claro
    marginBottom: 40, 
    textAlign: 'center',
    letterSpacing: 1,
  },
  botao: {
    backgroundColor: '#ff1a1a', // Vermelho vibrante
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 50,
    width: '85%',
    alignItems: 'center',
    // Efeito de brilho (Glow) vermelho
    shadowColor: '#ff1a1a',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  textoBotao: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
});