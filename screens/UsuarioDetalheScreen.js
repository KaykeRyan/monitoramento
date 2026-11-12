import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, Alert, ActivityIndicator, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { atualizarUsuario, excluirUsuario } from '../services/api';

export default function UsuarioDetalheScreen({ route, navigation }) {
  const { usuario, souEu, podeEditar = false } = route.params;

  const [nome, setNome] = useState(usuario.nome || '');
  const [email, setEmail] = useState(usuario.email || '');
  const [cpf, setCpf] = useState(usuario.cpf || '');
  const [dataNascimento, setDataNascimento] = useState(usuario.data_nascimento || '');
  const [senha, setSenha] = useState(''); // Vazio por padrão
  const [carregando, setCarregando] = useState(false);

  async function salvar() {
    setCarregando(true);
    try {
      const token = await AsyncStorage.getItem('token_usuario');
      
      const dados = {
        nome,
        email,
        cpf,
        data_nascimento: dataNascimento,
      };

      // Só envia a senha se o usuário digitou algo
      if (senha.trim().length > 0) {
        dados.senha = senha;
      }

      const resposta = await atualizarUsuario(usuario.id, dados, token);

      if (resposta.erro === 's') {
        Alert.alert('Erro', resposta.mensagem);
        return;
      }

      Alert.alert('Sucesso', resposta.mensagem);
      
      // Se eu editei a mim mesmo, preciso atualizar o AsyncStorage
      if (souEu) {
        const usuarioLogadoStr = await AsyncStorage.getItem('usuario_logado');
        if (usuarioLogadoStr) {
          const logado = JSON.parse(usuarioLogadoStr);
          logado.nome = nome;
          logado.email = email;
          await AsyncStorage.setItem('usuario_logado', JSON.stringify(logado));
        }
      }

      navigation.goBack();
    } catch (erro) {
      Alert.alert('Erro de conexão', 'Não foi possível salvar as alterações.');
    } finally {
      setCarregando(false);
    }
  }

  function confirmarExclusao() {
    Alert.alert('Confirmar exclusão', 'Tem certeza que deseja excluir esta conta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: excluir },
    ]);
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

      Alert.alert('Excluída', resposta.mensagem);

      // Se eu excluí a mim mesmo, preciso deslogar
      if (souEu) {
        await AsyncStorage.clear();
        navigation.reset({
          index: 0,
          routes: [{ name: 'LoginScreen' }], // Ajuste para o nome da sua tela de login
        });
      } else {
        navigation.goBack();
      }
    } catch (erro) {
      Alert.alert('Erro de conexão', 'Não foi possível excluir o usuário.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 24 }}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      <Text style={styles.titulo}>{podeEditar ? 'Editar Usuário' : 'Detalhes do Usuário'}</Text>
      
      {souEu && <Text style={styles.souEuTexto}>Esta é a sua conta</Text>}

      <Text style={styles.label}>Nome</Text>
      <TextInput 
        style={[styles.input, !podeEditar && styles.inputBloqueado]} 
        value={nome} 
        onChangeText={setNome} 
        editable={podeEditar} 
      />

      <Text style={styles.label}>E-mail</Text>
      <TextInput 
        style={[styles.input, !podeEditar && styles.inputBloqueado]} 
        value={email} 
        onChangeText={setEmail} 
        keyboardType="email-address"
        autoCapitalize="none"
        editable={podeEditar} 
      />

      <Text style={styles.label}>CPF</Text>
      <TextInput 
        style={[styles.input, !podeEditar && styles.inputBloqueado]} 
        value={cpf} 
        onChangeText={setCpf} 
        keyboardType="numeric"
        editable={podeEditar} 
      />

      <Text style={styles.label}>Data de Nascimento</Text>
      <TextInput 
        style={[styles.input, !podeEditar && styles.inputBloqueado]} 
        value={dataNascimento} 
        onChangeText={setDataNascimento} 
        placeholder="AAAA-MM-DD"
        placeholderTextColor="#666"
        editable={podeEditar} 
      />

      {podeEditar && (
        <>
          <Text style={styles.label}>Nova Senha (deixe em branco para manter)</Text>
          <TextInput 
            style={styles.input} 
            value={senha} 
            onChangeText={setSenha} 
            secureTextEntry
            placeholder="••••••"
            placeholderTextColor="#666"
          />
        </>
      )}

      {podeEditar && (
        carregando ? (
          <ActivityIndicator color="#ff1a1a" size="large" style={{ marginTop: 20 }} />
        ) : (
          <>
            <TouchableOpacity style={styles.botaoSalvar} onPress={salvar}>
              <Text style={styles.textoBotao}>Salvar Alterações</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.botaoExcluir} onPress={confirmarExclusao}>
              <Text style={styles.textoBotao}>Excluir Conta</Text>
            </TouchableOpacity>
          </>
        )
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  titulo: { fontSize: 22, fontWeight: '900', color: '#fff', textAlign: 'center', marginBottom: 10, textTransform: 'uppercase' },
  souEuTexto: { color: '#ff1a1a', textAlign: 'center', marginBottom: 20, fontWeight: 'bold' },
  label: { color: '#b0b0b0', marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: '#141414', borderWidth: 1, borderColor: '#333', borderRadius: 8, padding: 14, color: '#fff', fontSize: 15 },
  inputBloqueado: { opacity: 0.5 },
  botaoSalvar: { backgroundColor: '#ff1a1a', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 24 },
  botaoExcluir: { backgroundColor: '#141414', borderWidth: 1, borderColor: '#ff1a1a', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  textoBotao: { color: '#fff', fontWeight: '900', textTransform: 'uppercase' },
});