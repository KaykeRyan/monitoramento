import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, StatusBar, Alert, TouchableOpacity, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [menuAberto, setMenuAberto] = useState(false);

  useFocusEffect(
    useCallback(() => {
      async function carregarUsuario() {
        const usuarioStr = await AsyncStorage.getItem('usuario_logado');
        if (usuarioStr) {
          const usuario = JSON.parse(usuarioStr);
          setNome(usuario.nome);
        }
      }
      carregarUsuario();
    }, [])
  );

  async function sair() {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja voltar para a tela de Login?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sim, sair',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.multiRemove(['token_usuario', 'usuario_logado']);
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
          },
        },
      ]
    );
  }

  function abrirMenu() {
    setMenuAberto(true);
  }

  function ir(tela) {
    setMenuAberto(false);
    navigation.navigate(tela);
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />

      <TouchableOpacity onPress={abrirMenu} style={styles.menuButton}>
        <Text style={styles.menuIcon}>☰</Text>
      </TouchableOpacity>

      <View style={styles.iconContainer}>
        <View style={styles.iconTriangle}>
          <Text style={styles.iconText}>!</Text>
        </View>
      </View>

      <Text style={styles.title}>Bem-vindo{nome ? `, ${nome}` : ''}!</Text>
      <Text style={styles.subtitle}>
        Toque no ícone ☰ no canto superior direito para acessar o menu.
      </Text>

      {/* 🆕 BOTÃO VOLTAR PARA LOGIN */}
      <TouchableOpacity
        style={styles.btnVoltarLogin}
        onPress={sair}
        activeOpacity={0.8}
      >
        <Text style={styles.btnVoltarLoginTexto}>← Voltar para Login</Text>
      </TouchableOpacity>

      <Modal visible={menuAberto} transparent animationType="fade" onRequestClose={() => setMenuAberto(false)}>
        <TouchableOpacity style={styles.menuFundo} activeOpacity={1} onPress={() => setMenuAberto(false)}>
          <View style={styles.menuCaixa}>
            <TouchableOpacity style={styles.menuItem} onPress={() => ir('Ajuda')}>
              <Text style={styles.menuItemTexto}>🚨 Solicitar ajuda</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => ir('Chamados')}>
              <Text style={styles.menuItemTexto}>📋 Chamados</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => ir('Usuarios')}>
              <Text style={styles.menuItemTexto}>👥 Usuários</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => ir('Salas')}>
              <Text style={styles.menuItemTexto}>🏫 Minhas salas</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuAberto(false); sair(); }}>
              <Text style={[styles.menuItemTexto, { color: '#ff6a6a' }]}>Sair</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <View style={styles.cornerAccent} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a0a0a' },
  menuButton: { position: 'absolute', top: 50, right: 20, zIndex: 10 },
  menuIcon: { fontSize: 26, color: '#fff' },
  menuFundo: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'flex-end', paddingTop: 90, paddingRight: 20,
  },
  menuCaixa: {
    backgroundColor: '#141414', borderWidth: 1, borderColor: '#ff1a1a',
    borderRadius: 12, minWidth: 230, padding: 8,
  },
  menuItem: { paddingVertical: 14, paddingHorizontal: 16 },
  menuItemTexto: { color: '#fff', fontSize: 16, fontWeight: '700' },
  title: {
    fontSize: 32, fontWeight: '900', marginBottom: 12, color: '#ffffff',
    textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center',
  },
  subtitle: { fontSize: 16, color: '#b0b0b0', textAlign: 'center', lineHeight: 24, maxWidth: '80%' },
  iconContainer: { marginBottom: 24, alignItems: 'center', justifyContent: 'center' },
  iconTriangle: {
    width: 0, height: 0, backgroundColor: 'transparent', borderStyle: 'solid',
    borderLeftWidth: 40, borderRightWidth: 40, borderBottomWidth: 70,
    borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#ff1a1a',
    borderRadius: 10, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#ff1a1a', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 15, elevation: 10,
  },
  iconText: { position: 'absolute', top: 20, color: '#ffffff', fontSize: 32, fontWeight: 'bold' },
  cornerAccent: {
    position: 'absolute', top: 0, left: 0, width: 100, height: 100,
    borderTopWidth: 4, borderLeftWidth: 4, borderColor: '#ff1a1a', opacity: 0.6,
  },

  // 🆕 Estilo do botão de voltar para login
  btnVoltarLogin: {
    marginTop: 40,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#ff1a1a',
    backgroundColor: '#141414',
    shadowColor: '#ff1a1a',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 6,
  },
  btnVoltarLoginTexto: {
    color: '#ff6a6a',
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 14,
    textAlign: 'center',
  },
});