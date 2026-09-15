import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';

export default function Login({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />

      <Text style={styles.titulo}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor="#666"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#666"
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.botao}
        onPress={() => navigation.navigate('Home')}
        activeOpacity={0.8}
      >
        <Text style={styles.textoBotao}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 24, 
    backgroundColor: '#0a0a0a', // Fundo preto
  },
  titulo: { 
    fontSize: 32, 
    fontWeight: '900', 
    textAlign: 'center', 
    marginBottom: 30, 
    color: '#ffffff', // Texto branco
    textTransform: 'uppercase',
    letterSpacing: 2,
    textShadowColor: 'rgba(255, 26, 26, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  input: {
    backgroundColor: '#141414', // Fundo do input escuro
    borderWidth: 1,
    borderColor: '#333', // Borda sutil
    borderRadius: 8,
    padding: 16,
    marginBottom: 15,
    fontSize: 16,
    color: '#ffffff', // Texto digitado branco
  },
  botao: {
    backgroundColor: '#ff1a1a', // Vermelho vibrante
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    // Efeito de brilho (Glow) vermelho
    shadowColor: '#ff1a1a',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  textoBotao: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});