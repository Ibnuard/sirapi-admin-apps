import * as React from 'react';
import {View, Text, StyleSheet, StatusBar} from 'react-native';
import {retrieveUserSession} from '../../utils/UserUtils';
import messaging from '@react-native-firebase/messaging';

const SplashScreen = ({navigation}) => {
  React.useEffect(() => {
    loadUserSession();
  }, []);

  async function loadUserSession() {
    const userSession = await retrieveUserSession();
    const parseSession = JSON.parse(userSession);

    if (userSession) {
      moveToFlow('home');
    } else {
      moveToFlow('auth');
    }

    // if (parseSession?.phoneNumber?.lenght) {
    //   moveToFlow('home');
    // } else {
    //   moveToFlow('auth');
    // }
  }

  function moveToFlow(type) {
    setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: type == 'home' ? 'UserHomeFlow' : 'AuthFlow',
          },
        ],
      });
    }, 2500);
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Text style={styles.textTitle}>Sirapi</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  textTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default SplashScreen;
