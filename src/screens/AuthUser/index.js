import * as React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Button, Input} from '../../components';
import {Colors} from '../../styles';

const UserLoginScreen = ({route, navigation}) => {
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [password, setPassword] = React.useState('');
  return (
    <View style={styles.container}>
      <Text style={styles.textHello}>Masuk</Text>
      <View style={styles.input}>
        <Input
          placeholder={'Masukan Nomor Telpon'}
          onChangeText={text => setPhoneNumber(text)}
          value={phoneNumber}
        />
      </View>
      <View style={styles.input}>
        <Input
          placeholder={'Masukan 6 Pin'}
          maxLength={6}
          secureTextEntry={true}
          onChangeText={text => setPassword(text)}
          value={password}
        />
      </View>
      <Button containerStyle={{marginTop: 24}} title={'Masuk'} />
      <View style={styles.bottomContainer}>
        <Text>Belum mempunyai akun?</Text>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => navigation.navigate('AuthRegister')}>
          <Text style={styles.textDaftar}>Daftar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },

  input: {
    marginVertical: 8,
  },

  bottomContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 24,
  },

  //text style
  textHello: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  textDaftar: {
    paddingHorizontal: 4,
    color: Colors.COLOR_SECONDARY,
    fontWeight: 'bold',
  },
});

export default UserLoginScreen;
