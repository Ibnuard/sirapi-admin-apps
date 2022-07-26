import * as React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Button, Input} from '../../components';

const AuthScreen = ({navigation}) => {
  const [code, setCode] = React.useState('');
  const [isError, setIsError] = React.useState(false);

  const ADMIN_CODE = '1234';

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
