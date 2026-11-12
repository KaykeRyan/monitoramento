import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { atualizarSala, excluirSala, listarBlocos, listarTiposLocal } from '../services/api';

export default function SalaDetalheScreen({ route, navigation }) {
  // Recebe podeEditar e souDono da tela de listagem
  const { sala, podeEditar = false, souDono } = route.params;

  const [nome, setNome] = useState(sala.nome);
  const [identificador, setIdentificador] = useState(sala.identificador ?? '');
  const [blocoId, setBlocoId] = useState(sala.bloco_id);
  const [tipoLocalId, setTipoLocalId] = useState(sala.tipo_local_id);
  const [blocos, setBlocos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [carregandoListas, setCarregandoListas] = useState(true);

  useEffect(() => {
    async function carregarListas() {
      try {
        const token = await AsyncStorage.getItem('token_usuario');
        const [respBlocos, respTipos] = await Promise.all([
          listarBlocos(token),
          listarTiposLocal(token),
        ]);

        if (respBlocos.erro === 'n') setBlocos(respBlocos.blocos);
        if (respTipos.erro === 'n') setTipos(respTipos.tipos);
      } catch (erro) {
        Alert.alert('Erro de conexão', 'Não foi possível carregar blocos e tipos.');
      } finally {
        setCarregandoListas(false);
      }
    }

    carregarListas();
  }, []);

  async function salvar() {
    setCarregando(true);
    try {
      const token = await AsyncStorage.getItem('token_usuario');
      const resposta = await atualizarSala(sala.id, {
        bloco_id: blocoId, tipo_local_id: tipoLocalId, nome, identificador,
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
    Alert.alert('Confirmar exclusão', 'Tem certeza que deseja excluir esta sala?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: excluir },
    ]);
  }

  async function excluir() {
    setCarregando(true);
    try {
      const token = await AsyncStorage.getItem('token_usuario');
      const resposta = await excluirSala(sala.id, token);

      if (resposta.erro === 's') {
        Alert.alert('Erro', resposta.mensagem);
        return;
      }

      Alert.alert('Excluída', resposta.mensagem);
      navigation.goBack();
    } catch (erro) {
      Alert.alert('Erro de conexão', 'Não foi possível excluir a sala.');
    } finally {
      setCarregando(false);
    }
  }

  if (carregandoListas) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator color="#ff1a1a" size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 24 }}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      <Text style={styles.titulo}>{podeEditar ? 'Editar Sala' : 'Detalhes da Sala'}</Text>

      {/* Mostra o dono se for admin olhando a sala de outra pessoa */}
      {!souDono && sala.dono && (
        <Text style={styles.donoTexto}>Dono: {sala.dono}</Text>
      )}

      <Text style={styles.label}>Nome</Text>
      <TextInput 
        style={[styles.input, !podeEditar && styles.inputBloqueado]} 
        value={nome} 
        onChangeText={setNome} 
        editable={podeEditar} 
      />

      <Text style={styles.label}>Identificador</Text>
      <TextInput 
        style={[styles.input, !podeEditar && styles.inputBloqueado]} 
        value={identificador} 
        onChangeText={setIdentificador} 
        editable={podeEditar} 
      />

      <Text style={styles.label}>Bloco</Text>
      <View style={[styles.pickerWrapper, !podeEditar && styles.inputBloqueado]}>
        <Picker 
          selectedValue={blocoId} 
          onValueChange={(v) => setBlocoId(v)} 
          style={styles.picker} 
          dropdownIconColor="#fff"
          enabled={podeEditar}
        >
          {blocos.map((bloco) => (
            <Picker.Item key={bloco.id} label={bloco.nome} value={bloco.id} color="#000" />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Tipo de sala</Text>
      <View style={[styles.pickerWrapper, !podeEditar && styles.inputBloqueado]}>
        <Picker 
          selectedValue={tipoLocalId} 
          onValueChange={(v) => setTipoLocalId(v)} 
          style={styles.picker} 
          dropdownIconColor="#fff"
          enabled={podeEditar}
        >
          {tipos.map((tipo) => (
            <Picker.Item key={tipo.id} label={tipo.nome} value={tipo.id} color="#000" />
          ))}
        </Picker>
      </View>

      {/* Só mostra os botões se puder editar */}
      {podeEditar && (
        carregando ? (
          <ActivityIndicator color="#ff1a1a" size="large" style={{ marginTop: 20 }} />
        ) : (
          <>
            <TouchableOpacity style={styles.botaoSalvar} onPress={salvar}>
              <Text style={styles.textoBotao}>Salvar Alterações</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botaoExcluir} onPress={confirmarExclusao}>
              <Text style={styles.textoBotao}>Excluir Sala</Text>
            </TouchableOpacity>
          </>
        )
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  titulo: { fontSize: 22, fontWeight: '900', color: '#fff', textAlign: 'center', marginBottom: 24, textTransform: 'uppercase' },
  donoTexto: { color: '#ff1a1a', fontSize: 14, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  label: { color: '#b0b0b0', marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: '#141414', borderWidth: 1, borderColor: '#333', borderRadius: 8, padding: 14, color: '#fff', fontSize: 15 },
  inputBloqueado: { opacity: 0.5 }, // Deixa o campo cinza se não puder editar
  pickerWrapper: { backgroundColor: '#141414', borderWidth: 1, borderColor: '#333', borderRadius: 8, overflow: 'hidden' },
  picker: { color: '#fff' },
  botaoSalvar: { backgroundColor: '#ff1a1a', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 24 },
  botaoExcluir: { backgroundColor: '#141414', borderWidth: 1, borderColor: '#ff1a1a', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  textoBotao: { color: '#fff', fontWeight: '900', textTransform: 'uppercase' },
});