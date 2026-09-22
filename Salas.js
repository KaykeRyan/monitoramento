import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, StatusBar, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { listarMinhasSalas } from './api';

export default function Salas({ navigation }) {
  const [salas, setSalas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  async function carregar() {
    setCarregando(true);
    try {
      const token = await AsyncStorage.getItem('token_usuario');
      const resposta = await listarMinhasSalas(token);

      if (resposta.erro === 's') {
        Alert.alert('Erro', resposta.mensagem);
        return;
      }

      setSalas(resposta.salas);
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
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('SalaDetalhe', { sala: item })}
        activeOpacity={0.8}
      >
        <Text style={styles.nome}>{item.nome}</Text>
        <Text style={styles.detalhe}>Bloco: {item.bloco?.nome ?? '-'}</Text>
        <Text style={styles.detalhe}>Tipo: {item.tipo_local?.nome ?? '-'}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      <Text style={styles.titulo}>Minhas Salas</Text>

      {carregando ? (
        <ActivityIndicator color="#ff1a1a" size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={salas}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 24 }}
          ListEmptyComponent={<Text style={styles.vazio}>Você ainda não cadastrou nenhuma sala.</Text>}
        />
      )}

      <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
        <Text style={styles.textoBotaoVoltar}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', padding: 20, paddingTop: 50 },
  titulo: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  nome: { color: '#fff', fontSize: 16, fontWeight: '700' },
  detalhe: { color: '#b0b0b0', fontSize: 14, marginTop: 4 },
  vazio: { color: '#666', textAlign: 'center', marginTop: 40 },
  botaoVoltar: {
    backgroundColor: '#333',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  textoBotaoVoltar: { color: '#fff', fontWeight: '700' },
});