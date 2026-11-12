import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar,
  Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { acionarAlerta } from '../services/api';

export default function AjudaScreen({ navigation }) {
  const [descricao, setDescricao] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function handlePress() {
    if (enviando) return;

    if (!descricao.trim()) {
      Alert.alert('Atenção', 'Descreva o que está sendo chamado.');
      return;
    }

    setEnviando(true);
    try {
      const token = await AsyncStorage.getItem('token_usuario');
      
      // Enviando o texto descricao corretamente
      const resposta = await acionarAlerta(token, descricao.trim());

      if (resposta.erro === 's') {
        Alert.alert('Atenção', resposta.mensagem || 'Não foi possível enviar o alerta.');
        if (resposta.status === 500) setDescricao(''); 
      } else {
        Alert.alert('Chamado enviado!', resposta.mensagem);
        setDescricao('');
      }
    } catch (erro) {
      Alert.alert('Erro de conexão', 'Não foi possível conectar ao servidor.');
    } finally {
      setTimeout(() => setEnviando(false), 3000);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />

        <View style={styles.cornerAccentTop} />
        <View style={styles.cornerAccentBottom} />

        <Text style={styles.description}>
          Descreva o que está sendo chamado e pressione o botão para enviar o alerta.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Ex.: Projetor não liga, aluno passando mal..."
          placeholderTextColor="#666"
          value={descricao}
          onChangeText={setDescricao}
          multiline
          maxLength={500}
          textAlignVertical="top"
        />
        <Text style={styles.contador}>{descricao.length}/500</Text>

        <TouchableOpacity
          style={[styles.helpButton, enviando && { opacity: 0.6 }]}
          onPress={handlePress}
          disabled={enviando}
          activeOpacity={0.8}
        >
          {enviando ? (
            <ActivityIndicator color="#fff" size="large" />
          ) : (
            <Text style={styles.helpButtonText}>SOLICITAR{'\n'}AJUDA</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Chamados')} style={{ marginTop: 28 }}>
          <Text style={styles.link}>📋 Ver lista de chamados</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  content: { alignItems: 'center', justifyContent: 'center', padding: 24, flexGrow: 1 },
  description: {
    fontSize: 16, color: '#b0b0b0', textAlign: 'center',
    marginBottom: 20, lineHeight: 24, maxWidth: '90%', fontWeight: '500',
  },
  input: {
    width: '100%', minHeight: 100, borderWidth: 1, borderColor: '#333',
    backgroundColor: '#141414', borderRadius: 8, padding: 14, fontSize: 16, color: '#fff',
  },
  contador: { alignSelf: 'flex-end', color: '#666', fontSize: 12, marginTop: 4, marginBottom: 28 },
  helpButton: {
    width: 190, height: 190, borderRadius: 95, backgroundColor: '#ff1a1a',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#ff1a1a', shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8, shadowRadius: 25, elevation: 15,
    borderWidth: 4, borderColor: '#ff4d4d',
  },
  helpButtonText: {
    color: '#fff', fontSize: 22, fontWeight: '900', textAlign: 'center',
    textTransform: 'uppercase', letterSpacing: 1.5,
  },
  link: { color: '#ff6a6a', fontSize: 15, fontWeight: '700' },
  cornerAccentTop: {
    position: 'absolute', top: 0, left: 0, width: 120, height: 120,
    borderTopWidth: 4, borderLeftWidth: 4, borderColor: '#ff1a1a', opacity: 0.4,
  },
  cornerAccentBottom: {
    position: 'absolute', bottom: -50, right: -50, width: 150, height: 150,
    borderBottomWidth: 6, borderRightWidth: 6, borderColor: '#ff1a1a', opacity: 0.6,
    transform: [{ rotate: '45deg' }],
  },
});