import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import SyncStorage from 'sync-storage';
import logo from '../../images/logo.png';
import api from '../../services/api';

export default function index() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('admin@teste.com');
  const [password, setPassword] = useState('123456');

  useEffect(() => {
    const token = SyncStorage.get('token');
    console.log(token);
    if (token) {
      navigation.navigate('MapScreen');
    }
  }, []);

  async function handleSubmit() {
    try {
      const { data } = await api.post('/sessions', {
        email,
        password,
      });

      SyncStorage.set('user', data.user);
      SyncStorage.set('token', data.token);
      navigation.navigate('MapScreen');
    } catch (error) {
      Alert.alert('Usuário ou senha incorretos.');
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logo} />
        </View>
        <Text style={styles.label}>Seu E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="Seu e-mail"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />
        <Text style={styles.label}>Tecnologias</Text>
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Logar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0d683f',
    padding: 10,
  },
  label: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 8,
  },
  form: {
    borderRadius: 20,
    alignSelf: 'stretch',
    paddingHorizontal: 30,
    marginTop: 30,
    backgroundColor: '#fff',
    padding: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#444',
    height: 44,
    marginBottom: 20,
    borderRadius: 2,
  },
  button: {
    height: 42,
    backgroundColor: '#0d683f',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  logo: {
    width: 100,
    height: 50,
  },
});
