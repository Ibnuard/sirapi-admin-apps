import * as React from 'react';
import {View, Text, StyleSheet, StatusBar, Image} from 'react-native';
import {retrieveUserSession} from '../../utils/UserUtils';
import messaging from '@react-native-firebase/messaging';
import {GET_ADMIN_TOKEN} from '../../utils/FirebaseUtils';

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
      <Image
        source={require('../../../assets/images/logo.png')}
        resizeMode={'contain'}
        style={{width: 100, height: 100}}
      />
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