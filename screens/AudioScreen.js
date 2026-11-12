import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';

export default function AudioScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />

      <View style={styles.cornerAccent} />
      <Text style={styles.title}>Audio</Text>
      <Text style={styles.description}>Conteudo de audio</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a0a0a',
    padding: 24,
  },
  title: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  description: {
    color: '#b0b0b0',
    fontSize: 18,
    textAlign: 'center',
  },
  cornerAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 100,
    height: 100,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#ff1a1a',
    opacity: 0.6,
  },
});
