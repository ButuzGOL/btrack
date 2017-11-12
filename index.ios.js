/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Button from './Button';

function secToHHMMSS(sec) {
  const date = new Date(null);
  date.setSeconds(sec);
  return date.toISOString().substr(11, 8);
}

function getDistance(lat1, lon1, lat2, lon2) {
  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function msToKmh(ms) {
  return ms * 18 / 5;
}

function zeroPad(num, places) {
  const zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join('0') + num;
}

export default class btrack extends Component {
  state = {
    kmh: 0,
    km: 0,
    sec: 0,
    idle: true,
  };

  constructor() {
    super();

    this.onStart = this.onStart.bind(this);
    this.onStop = this.onStop.bind(this);

    this.onTick = this.onTick.bind(this);
    this.onLocationUpdated = this.onLocationUpdated.bind(this);
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchLocation);
    clearInterval(this.timer);
  }

  onStart() {
    this.setState({ idle: false });
    this.timer = setInterval(this.onTick, 1000);
    navigator.geolocation.getCurrentPosition(
      (location) => {
        this.setState({ location });

        this.watchLocation = navigator.geolocation.watchPosition(
          this.onLocationUpdated,
          (error) => alert(JSON.stringify(error)),
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 5 }
        );
      },
      (error) => alert(JSON.stringify(error)),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }
  onStop() {
    navigator.geolocation.clearWatch(this.watchLocation);
    clearInterval(this.timer);

    this.setState({
      kmh: 0,
      km: 0,
      sec: 0,
      idle: true,
    });
  }

  onLocationUpdated(location) {
    const { speed, latitude, longitude } = location.coords;
    const prevLocation = this.state.location;
    this.setState({
      kmh: msToKmh(speed),
      km: this.state.km + getDistance(
        prevLocation.coords.latitude, prevLocation.coords.longitude, latitude, longitude
      ),
      location,
    });
  }

  onTick() {
    this.setState({ sec: this.state.sec + 1 });
  }

  render() {
    const { idle, kmh, km, sec } = this.state;

    let mKmh = Math.round(kmh);
    mKmh = mKmh > 9 ? mKmh : `0${mKmh}`;

    let mKm = Math.floor(km * 10) / 10;
    const kmParts = mKm.toString().split('.');
    mKm = zeroPad(kmParts[0], 2) + '.' + (kmParts[1] !== undefined ? kmParts[1] : '0')

    return (
      <View style={styles.container}>
        <View style={styles.secContainer}>
          <Text style={styles.secText}>{secToHHMMSS(sec)}</Text>
        </View>
        <View style={styles.kmhContainer}>
          <Text style={styles.kmhText}>
            {mKmh}
          </Text>
          <Text style={[styles.textLegend, { marginBottom: 35 }]}>km/h</Text>
        </View>
        <View style={styles.kmContainer}>
          <Text style={styles.kmText}>{mKm}</Text>
          <Text style={[styles.textLegend, { marginBottom: 13, marginLeft: 5 }]}>km</Text>
        </View>
        {idle ?
          <Button
            onPress={this.onStart}
            text="Start"
            style={[{ backgroundColor: '#50D2C2' }, styles.actionButton]}
            textStyle={styles.actionText}
          />
          :
          <Button
            onPress={this.onStop}
            text="Stop"
            style={[{ backgroundColor: '#FF7E9E' }, styles.actionButton]}
            textStyle={styles.actionText}
          />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kmhContainer: {
    flexDirection: 'row',
    marginLeft: 50,
  },
  kmhText: {
    fontSize: 120,
    fontFamily: 'Avenir',
    fontWeight: 'bold',
    textAlign: 'right',
    color: '#1D1D26',
  },
  textLegend: {
    fontFamily: 'Avenir',
    fontSize: 24,
    color: '#1D1D26',
    alignSelf: 'flex-end',
  },
  secContainer: {},
  secText: {
    fontSize: 40,
    fontFamily: 'Avenir',
    fontWeight: 'bold',
    color: '#1D1D26',
  },
  kmContainer: {
    flexDirection: 'row',
    marginLeft: 20,
  },
  kmText: {
    fontSize: 60,
    fontFamily: 'Avenir',
    fontWeight: 'bold',
  },
  actionButton: {
    height: 126,
    width: 126,
    borderRadius: 63,
  },
  actionText: {
    fontSize: 30,
  },
});

AppRegistry.registerComponent('btrack', () => btrack);
