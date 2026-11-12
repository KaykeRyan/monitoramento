import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, StatusBar, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { listarSalas } from '../services/api';

export default function SalasScreen({ navigation }) {
  const [salas, setSalas] = useState([]);
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

      const resposta = await listarSalas(token);

      if (resposta.erro === 's') {
        Alert.alert('Erro', resposta.mensagem);
        return;
      }

      setSalas(resposta.salas || []);
    } catch (erro) {
      Alert.alert('Erro de conexão', 'Não foi possível carregar as salas.');
    } finally {
      setCarregando(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [])
  );

  function renderItem({ item }) {
    const souDono = item.usuario_id === meuId;
    const podeEditar = souAdmin || souDono;
    const dono = item.dono ?? null;

    return (
      <TouchableOpacity
        style={[styles.card, souDono && styles.cardMinha]}
        onPress={() => navigation.navigate('SalaDetalhe', { // <-- CORRIGIDO AQUI
          sala: item,
          podeEditar,
          souDono,
        })}
        activeOpacity={0.8}
      >
        <View style={styles.linhaTopo}>
          <Text style={styles.nome}>{item.nome}</Text>

          {souDono && (
            <View style={styles.badgeMinha}>
              <Text style={styles.badgeMinhaTexto}>MINHA</Text>
            </View>
          )}
        </View>

        <Text style={styles.detalhe}>Bloco: {item.bloco?.nome ?? '-'}</Text>
        <Text style={styles.detalhe}>Tipo: {item.tipo_local?.nome ?? '-'}</Text>

        {souAdmin && !souDono && (
          <Text style={styles.dono}>
            Dono: {dono ?? '—'}
          </Text>
        )}

        {!podeEditar && (
          <Text style={styles.aviso}>Somente leitura</Text>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      <Text style={styles.titulo}>{souAdmin ? 'Todas as Salas' : 'Minhas Salas'}</Text>

      {souAdmin && (
        <Text style={styles.subtitulo}>Você é admin — vê e edita todas</Text>
      )}

      {carregando ? (
        <ActivityIndicator color="#ff1a1a" size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={salas}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 24 }}
          ListEmptyComponent={
            <Text style={styles.vazio}>
              {souAdmin ? 'Nenhuma sala cadastrada no sistema.' : 'Você ainda não cadastrou nenhuma sala.'}
            </Text>
          }
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
  cardMinha: {
    borderColor: '#ff1a1a', shadowColor: '#ff1a1a', shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5, shadowRadius: 10, elevation: 5,
  },
  linhaTopo: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 4,
  },
  nome: { color: '#fff', fontSize: 16, fontWeight: '700', flex: 1 },
  badgeMinha: {
    backgroundColor: '#ff1a1a', borderRadius: 4, paddingHorizontal: 6,
    paddingVertical: 2, marginLeft: 6,
  },
  badgeMinhaTexto: { color: '#fff', fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
  detalhe: { color: '#b0b0b0', fontSize: 14, marginTop: 4 },
  dono: { color: '#ff1a1a', fontSize: 13, marginTop: 8, fontWeight: '600' },
  aviso: { color: '#666', fontSize: 11, marginTop: 8, fontStyle: 'italic' },
  vazio: { color: '#666', textAlign: 'center', marginTop: 40 },
});