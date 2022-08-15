import * as React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Button, Input} from '../../components';
import messaging from '@react-native-firebase/messaging';
import {GET_ADMIN_TOKEN, SAVE_ADMIN_TOKEN} from '../../utils/FirebaseUtils';

const AuthScreen = ({navigation}) => {
  const [code, setCode] = React.useState('');
  const [isError, setIsError] = React.useState(false);

  const ADMIN_CODE = '1234';

  React.useEffect(async () => {
    await messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();

    SAVE_ADMIN_TOKEN(token).then(() => {
      console.log('Token saved!!');
    });

    // GET_ADMIN_TOKEN().then(data => {
    //   console.log('data : ' + JSON.stringify(data));
    // });

    // console.log('Token : ' + token);
  }, []);

  const checkAdminCode = () => {
    if (ADMIN_CODE == code) {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'Dashboard',
          },
        ],
      });
    } else {
      setIsError(true);
    }
  };

  return (
    <View style={styles.container}>
      <Input
        placeholder="Masukan kode admin"
        onChangeText={text => setCode(text)}
        onChange={() => setIsError(false)}
        value={code}
      />
      {isError && <Text style={styles.textError}>Error admin code</Text>}
      <Button
        isLoading={false}
        containerStyle={styles.buttonContainer}
        title={'Masuk'}
        onPress={() => checkAdminCode()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },

  buttonContainer: {
    marginTop: 24,
  },

  textError: {
    color: 'red',
    marginTop: 4,
  },
});

export default AuthScreen;
