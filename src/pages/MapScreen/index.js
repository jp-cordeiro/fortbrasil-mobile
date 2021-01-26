import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Dimensions,
  Image,
  Text,
  BackHandler,
  View,
  Alert,
} from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import establishmentMarker from '../../images/establishment-icon.png';
import userMarker from '../../images/user-location.png';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import api from '../../services/api';

export default function index() {
  const navigation = useNavigation();
  const mapRef = React.createRef();
  BackHandler.addEventListener('hardwareBackPress', function () {
    return true;
  });

  const [location, setLocation] = useState({
    latitude: -3.7305015,
    longitude: -38.5411658,
  });
  const [establishments, setEstablishments] = useState([]);
  useEffect(() => {
    api.get('establishments').then(
      async (response) => {
        let { status } = await Location.requestPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg(
            'Para o funcionamento correto do App é necessário que você permita o acesso a localização.'
          );
          return;
        }
        let { coords } = await Location.getCurrentPositionAsync({});
        setLocation(coords);

        const establishmentsData = response.data.map((estab) => {
          return {
            name: estab.name,
            description: estab.description,
            id: estab.id,
            latitude: parseFloat(estab.latitude),
            longitude: parseFloat(estab.longitude),
          };
        });
        setEstablishments(establishmentsData);
      },
      (error) => Alert('Não foi possível carregar os establecimentos')
    );
  }, []);
  useEffect(() => {
    mapRef.current.animateToRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.008,
      longitudeDelta: 0.008,
    });
  }, [establishments]);

  function handleNavigation() {
    navigation.navigate('SignIn');
  }
  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        }}
      >
        {establishments.map((establishment) => (
          <Marker
            key={establishment.id}
            coordinate={{
              latitude: establishment.latitude,
              longitude: establishment.longitude,
            }}
          >
            <Image source={establishmentMarker} style={styles.marker} />
            <Callout
              onPress={handleNavigation}
              style={styles.callouContainer}
              tooltip={true}
            >
              <Text style={styles.callouText}>{establishment.name}</Text>
            </Callout>
          </Marker>
        ))}
        {location ? (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
          >
            <Image source={userMarker} style={styles.marker} />
            <Callout
              onPress={handleNavigation}
              style={styles.callouContainer}
              tooltip={true}
            >
              <Text style={styles.callouText}>Você está aqui!</Text>
            </Callout>
          </Marker>
        ) : null}
      </MapView>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {establishments.length} estabelecimentos encontrados
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  marker: {
    width: 50,
    height: 50,
  },
  callouContainer: {
    width: 168,
    height: 46,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    justifyContent: 'center',
  },
  callouText: {
    color: '#0d683f',
    fontSize: 14,
  },
  footer: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 32,

    backgroundColor: '#fff',
    borderRadius: 28,
    height: 46,
    paddingLeft: 24,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 5,
  },
  footerText: {
    color: '#02864d',
  },
});
