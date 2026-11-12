import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, Alert, ActivityIndicator, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { cadastroUsuario } from '../services/api';

export default function CadastroScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [cpf, setCpf] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleCadastrar() {
    if (!nome || !email || !senha || !dataNascimento || !cpf) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    setCarregando(true);
    try {
      const resposta = await cadastroUsuario({
        nome, email, senha,
        data_nascimento: dataNascimento,
        cpf,
      });

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
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 24, justifyContent: 'center', flexGrow: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />

      <View style={styles.cornerAccentTop} />

      <Text style={styles.title}>Cadastro</Text>
      <Text style={styles.subtitle}>Preencha seus dados para continuar.</Text>

      <TextInput style={styles.input} placeholder="Nome" placeholderTextColor="#666" value={nome} onChangeText={setNome} />
      <TextInput
        style={styles.input} placeholder="Email" placeholderTextColor="#666"
        value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none"
      />
      <TextInput style={styles.input} placeholder="Senha" placeholderTextColor="#666" secureTextEntry value={senha} onChangeText={setSenha} />
      <TextInput
        style={styles.input} placeholder="Data de nascimento (AAAA-MM-DD)" placeholderTextColor="#666"
        value={dataNascimento} onChangeText={setDataNascimento}
      />
      <TextInput style={styles.input} placeholder="CPF" placeholderTextColor="#666" value={cpf} onChangeText={setCpf} />

      {carregando ? (
        <ActivityIndicator color="#ff1a1a" size="large" style={{ marginTop: 16 }} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleCadastrar} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ marginTop: 20 }}>
        <Text style={styles.linkLogin}>Já tem conta? Entrar</Text>
      </TouchableOpacity>

      <View style={styles.cornerAccentBottom} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
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
  linkLogin: { color: '#ff6a6a', textAlign: 'center', fontSize: 14 },
  cornerAccentTop: {
    position: 'absolute', top: 0, left: 0, width: 120, height: 120,
    borderTopWidth: 4, borderLeftWidth: 4, borderColor: '#ff1a1a', opacity: 0.4,
  },
  cornerAccentBottom: {
    position: 'absolute', width: 150, height: 150,
    borderBottomWidth: 6, borderRightWidth: 6, borderColor: '#ff1a1a', opacity: 0.6,
    transform: [{ rotate: '45deg' }], right: -50, bottom: -50,
  },
});