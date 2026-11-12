import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, StatusBar, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { listarChamados } from '../services/api';

export default function ChamadosScreen() {
  const [chamados, setChamados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);

  async function carregar() {
    try {
      const token = await AsyncStorage.getItem('token_usuario');
      const resposta = await listarChamados(token);

      if (resposta.erro === 's') {
        Alert.alert('Erro', resposta.mensagem);
        return;
      }

      setChamados(resposta.chamados);
    } catch (erro) {
      Alert.alert('Erro de conexão', 'Não foi possível carregar os chamados.');
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      setCarregando(true);
      carregar();
    }, [])
  );

  function renderItem({ item }) {
    return (
      <View style={styles.card}>
        <View style={styles.linha}>
          <Text style={styles.sala}>
            {item.sala ?? 'Sala removida'}{item.bloco ? ` — ${item.bloco}` : ''}
          </Text>
          <Text style={styles.data}>{item.data}</Text>
        </View>
        <Text style={styles.descricao}>{item.descricao}</Text>
        <Text style={styles.usuario}>Aberto por {item.usuario ?? '-'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      <Text style={styles.titulo}>Chamados</Text>

      {carregando ? (
        <ActivityIndicator color="#ff1a1a" size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={chamados}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          refreshing={atualizando}
          onRefresh={() => { setAtualizando(true); carregar(); }}
          contentContainerStyle={{ paddingBottom: 24 }}
          ListEmptyComponent={<Text style={styles.vazio}>Nenhum chamado registrado ainda.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', padding: 20 },
  titulo: {
    fontSize: 22, fontWeight: '900', color: '#fff', textAlign: 'center',
    marginBottom: 20, textTransform: 'uppercase', letterSpacing: 1,
  },
  card: { backgroundColor: '#141414', borderWidth: 1, borderColor: '#333', borderRadius: 10, padding: 16, marginBottom: 12 },
  linha: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sala: { color: '#ff6a6a', fontSize: 15, fontWeight: '700', flexShrink: 1, paddingRight: 8 },
  data: { color: '#b0b0b0', fontSize: 12 },
  descricao: { color: '#fff', fontSize: 15, marginTop: 8 },
  usuario: { color: '#666', fontSize: 12, marginTop: 8 },
  vazio: { color: '#666', textAlign: 'center', marginTop: 40 },
});