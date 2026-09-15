import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert, StatusBar } from 'react-native';

export default function Botao({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />

      <TouchableOpacity
        style={styles.botao}
        onPress={() => Alert.alert('Você clicou!', 'O botão central funcionou 🎉')}
        activeOpacity={0.8}
      >
        <Text style={styles.textoBotao}>Clique Aqui</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.voltar}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.textoVoltar}>← Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#0a0a0a', // Fundo preto
  },
  botao: {
    backgroundColor: '#ff1a1a', // Vermelho vibrante
    paddingVertical: 30,
    paddingHorizontal: 70,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: '#ff4d4d', // Borda mais clara para dar profundidade
    // Efeito de brilho (Glow) vermelho
    shadowColor: '#ff1a1a',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 25,
    elevation: 15,
  },
  textoBotao: { 
    color: '#fff', 
    fontSize: 22, 
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  voltar: {
    position: 'absolute',
    top: 60,
    left: 24,
    padding: 10,
  },
  textoVoltar: { 
    fontSize: 16, 
    color: '#ff1a1a', // Vermelho para combinar com o tema
    fontWeight: '700',
    letterSpacing: 1,
  },
});