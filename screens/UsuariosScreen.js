import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, StatusBar, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { listarUsuarios } from '../services/api';

export default function UsuariosScreen({ navigation }) {
  const [usuarios, setUsuarios] = useState([]);
  const [meuId, setMeuId] = useState(null);
  const [souAdmin, setSouAdmin] = useState(false);
  const [carregando, setCarregando] = useState(true);

  async function carregar() {
    setCarregando(true);
    try {
      const token = await AsyncStorage.getItem('token_usuario');
      const usuarioLogadoStr = await AsyncStorage.getItem('usuario_logado');
      const usuarioLogado = usuarioLogadoStr ? JSON.parse(usuarioLogadoStr) : null;

      if (usuarioLogado) {
        setMeuId(usuarioLogado.id);
        setSouAdmin(!!usuarioLogado.admin);
      }

      const resposta = await listarUsuarios(token);

      if (resposta.erro === 's') {
        Alert.alert('Erro', resposta.mensagem);
        return;
      }

      setUsuarios(resposta.usuarios || []);
    } catch (erro) {
      Alert.alert('Erro de conexão', 'Não foi possível carregar os usuários.');
    } finally {
      setCarregando(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [])
  );

  function textoOuTraco(valor) {
    return valor === null || valor === undefined || valor === '' ? '—' : valor;
  }

  function renderItem({ item }) {
    const souEu = item.id === meuId;
    const ehAdmin = !!item.admin;
    const podeEditar = !!item.pode_editar;

    return (
      <TouchableOpacity
        style={[styles.card, souEu && styles.cardMeu]}
        onPress={() => navigation.navigate('UsuarioDetalhe', { // <-- CORRIGIDO AQUI
          usuario: item,
          souEu,
          podeEditar,
        })}
        activeOpacity={0.8}
      >
        <View style={styles.linhaTopo}>
          <Text style={styles.nome}>
            {item.nome} {souEu && <Text style={styles.voce}>(Você)</Text>}
          </Text>

          <View style={styles.badges}>
            {ehAdmin && (
              <View style={styles.badgeAdmin}>
                <Text style={styles.badgeAdminTexto}>ADMIN</Text>
              </View>
            )}
            {!podeEditar && (
              <View style={styles.badgeBloqueado}>
                <Text style={styles.badgeBloqueadoTexto}>🔒</Text>
              </View>
            )}
          </View>
        </View>

        <Text style={styles.email}>{textoOuTraco(item.email)}</Text>

        <Text style={styles.detalhe}>CPF: {textoOuTraco(item.cpf)}</Text>
        <Text style={styles.detalhe}>Nascimento: {textoOuTraco(item.data_nascimento)}</Text>

        {!podeEditar && (
          <Text style={styles.aviso}>Sem permissão para editar</Text>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      <Text style={styles.titulo}>Usuários Cadastrados</Text>

      {souAdmin && (
        <Text style={styles.subtitulo}>Você é admin — vê e edita todos</Text>
      )}

      {carregando ? (
        <ActivityIndicator color="#ff1a1a" size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={usuarios}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 24 }}
          ListEmptyComponent={<Text style={styles.vazio}>Nenhum usuário encontrado.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', padding: 20 },
  titulo: {
    fontSize: 22, fontWeight: '900', color: '#fff', textAlign: 'center',
    marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1,
  },
  subtitulo: {
    fontSize: 12, color: '#ff1a1a', textAlign: 'center',
    marginBottom: 16, fontWeight: '600',
  },
  card: {
    backgroundColor: '#141414', borderWidth: 1, borderColor: '#333',
    borderRadius: 10, padding: 16, marginBottom: 12,
  },
  cardMeu: {
    borderColor: '#ff1a1a', shadowColor: '#ff1a1a', shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5, shadowRadius: 10, elevation: 5,
  },
  linhaTopo: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  nome: { color: '#fff', fontSize: 16, fontWeight: '700', flex: 1 },
  voce: { color: '#ff1a1a', fontWeight: '500' },
  badges: { flexDirection: 'row', alignItems: 'center' },
  badgeAdmin: {
    backgroundColor: '#ff1a1a', borderRadius: 4, paddingHorizontal: 6,
    paddingVertical: 2, marginLeft: 6,
  },
  badgeAdminTexto: { color: '#fff', fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
  badgeBloqueado: {
    backgroundColor: '#333', borderRadius: 4, paddingHorizontal: 6,
    paddingVertical: 2, marginLeft: 6,
  },
  badgeBloqueadoTexto: { color: '#999', fontSize: 10 },
  email: { color: '#b0b0b0', fontSize: 14, marginTop: 6 },
  detalhe: { color: '#888', fontSize: 13, marginTop: 4 },
  aviso: { color: '#666', fontSize: 11, marginTop: 8, fontStyle: 'italic' },
  vazio: { color: '#666', textAlign: 'center', marginTop: 40 },
});