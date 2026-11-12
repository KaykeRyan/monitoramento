import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '../services/api';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleLogin() {
    if (!email || !senha) {
      Alert.alert('Atenção', 'Preencha email e senha.');
      return;
    }

    setCarregando(true);
    try {
      const resposta = await login(email, senha);

      if (resposta.erro === 's') {
        Alert.alert('Erro', resposta.mensagem);
        return;
      }

      await AsyncStorage.setItem('token_usuario', resposta.token);
      await AsyncStorage.setItem('usuario_logado', JSON.stringify(resposta.usuario));
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } catch (erro) {
      Alert.alert('Erro de conexão', 'Não foi possível conectar ao servidor.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />

      <View style={styles.cornerAccentTop} />

      <Text style={styles.title}>Login</Text>
      <Text style={styles.subtitle}>Entre com sua conta para continuar.</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#666"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#666"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      {carregando ? (
        <ActivityIndicator color="#ff1a1a" size="large" style={{ marginTop: 16 }} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleLogin} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('Cadastro')} style={{ marginTop: 20 }}>
        <Text style={styles.linkCadastro}>Não tem conta? Cadastre-se</Text>
      </TouchableOpacity>

      <View style={styles.cornerAccentBottom} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#0a0a0a' },
  title: { fontSize: 32, fontWeight: '900', marginBottom: 8, color: '#ffffff', textTransform: 'uppercase', letterSpacing: 1 },
  subtitle: { fontSize: 16, color: '#b0b0b0', marginBottom: 32, lineHeight: 24 },
  input: {
    borderWidth: 1, borderColor: '#333', backgroundColor: '#141414',
    borderRadius: 8, padding: 16, marginBottom: 16, fontSize: 16, color: '#ffffff',
  },
  button: {
    backgroundColor: '#ff1a1a', borderRadius: 8, paddingVertical: 16, alignItems: 'center', marginTop: 8,
    shadowColor: '#ff1a1a', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 10, elevation: 8,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },
  linkCadastro: { color: '#ff6a6a', textAlign: 'center', fontSize: 14 },
  cornerAccentTop: {
    position: 'absolute', top: 0, left: 0, width: 120, height: 120,
    borderTopWidth: 4, borderLeftWidth: 4, borderColor: '#ff1a1a', opacity: 0.4,
  },
  cornerAccentBottom: {
    position: 'absolute', bottom: -50, right: -50, width: 150, height: 150,
    borderBottomWidth: 6, borderRightWidth: 6, borderColor: '#ff1a1a', opacity: 0.6, transform: [{ rotate: '45deg' }],
  },
});