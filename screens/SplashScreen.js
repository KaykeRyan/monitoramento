import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    async function verificarLogin() {
      const token = await AsyncStorage.getItem('token_usuario');

      setTimeout(() => {
        if (token) {
          navigation.replace('Home');
        } else {
          navigation.replace('Login');
        }
      }, 1500);
    }

    verificarLogin();
  }, [navigation]);

  return (
    <ImageBackground
      source={require('../assets/alertaaqui.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.content}>
        <Text style={styles.title}>Solicitação de Ajuda</Text>
        <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { alignItems: 'center', justifyContent: 'center' },
  title: { color: '#fff', fontSize: 26, fontWeight: 'bold' },
});