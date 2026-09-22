import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, Alert, ActivityIndicator, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { atualizarUsuario, excluirUsuario } from './api';

export default function UsuarioDetalhe({ route, navigation }) {
  const { usuario, souEu } = route.params;

  const [nome, setNome] = useState(usuario.nome);
  const [email, setEmail] = useState(usuario.email);
  const [cpf, setCpf] = useState(usuario.cpf);
  const [dataNascimento, setDataNascimento] = useState(usuario.data_nascimento);
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function salvar() {
    setCarregando(true);
    try {
      const token = await AsyncStorage.getItem('token_usuario');
      const resposta = await atualizarUsuario(usuario.id, {
        nome, email, cpf,
        data_nascimento: dataNascimento,
        senha: senha || null,
      }, token);

      if (resposta.erro === 's') {
        Alert.alert('Erro', resposta.mensagem);
        return;
      }

      Alert.alert('Sucesso', resposta.mensagem);
      navigation.goBack();
    } catch (erro) {
      Alert.alert('Erro de conexão', 'Não foi possível salvar as alterações.');
    } finally {
      setCarregando(false);
    }
  }

  function confirmarExclusao() {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir sua conta? Essa ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: excluir },
      ]
    );
  }

  async function excluir() {
    setCarregando(true);
    try {
      const token = await AsyncStorage.getItem('token_usuario');
      const resposta = await excluirUsuario(usuario.id, token);

      if (resposta.erro === 's') {
        Alert.alert('Erro', resposta.mensagem);
        return;
      }

      await AsyncStorage.multiRemove(['token_usuario', 'usuario_logado']);
      Alert.alert('Conta excluída', resposta.mensagem);
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    } catch (erro) {
      Alert.alert('Erro de conexão', 'Não foi possível excluir a conta.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 24, paddingTop: 50 }}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      <Text style={styles.titulo}>{souEu ? 'Meus Dados' : 'Dados do Usuário'}</Text>

      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        editable={souEu}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        editable={souEu}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>CPF</Text>
      <TextInput
        style={styles.input}
        value={cpf}
        onChangeText={setCpf}
        editable={souEu}
      />

      <Text style={styles.label}>Data de nascimento</Text>
      <TextInput
        style={styles.input}
        value={dataNascimento}
        onChangeText={setDataNascimento}
        editable={souEu}
        placeholder="AAAA-MM-DD"
        placeholderTextColor="#666"
      />

      {souEu && (
        <>
          <Text style={styles.label}>Nova senha (opcional)</Text>
          <TextInput
            style={styles.input}
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            placeholder="Deixe em branco para manter a atual"
            placeholderTextColor="#666"
          />
        </>
      )}

      {carregando ? (
        <ActivityIndicator color="#ff1a1a" size="large" style={{ marginTop: 20 }} />
      ) : (
        <>
          {souEu && (
            <>
              <TouchableOpacity style={styles.botaoSalvar} onPress={salvar}>
                <Text style={styles.textoBotao}>Salvar Alterações</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.botaoExcluir} onPress={confirmarExclusao}>
                <Text style={styles.textoBotao}>Excluir Minha Conta</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
            <Text style={styles.textoBotaoVoltar}>Voltar</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  titulo: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 24,
    textTransform: 'uppercase',
  },
  label: { color: '#b0b0b0', marginBottom: 6, marginTop: 12 },
  input: {
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    padding: 14,
    color: '#fff',
    fontSize: 15,
  },
  botaoSalvar: {
    backgroundColor: '#ff1a1a',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  botaoExcluir: {
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#ff1a1a',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  botaoVoltar: {
    backgroundColor: '#333',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  textoBotao: { color: '#fff', fontWeight: '900', textTransform: 'uppercase' },
  textoBotaoVoltar: { color: '#fff', fontWeight: '700' },
});