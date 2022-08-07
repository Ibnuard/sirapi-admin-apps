import * as React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Button, Input} from '../../components';
import BaseModal from '../../components/Modal';
import {Colors} from '../../styles';
import {USER_LOGIN} from '../../utils/FirebaseUtils';
import {storeUserSession} from '../../utils/UserUtils';

const UserLoginScreen = ({route, navigation}) => {
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [password, setPassword] = React.useState('');

  //modal
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalMessage, setModalMessage] = React.useState('');
  const [modalType, setModalType] = React.useState('loading');

  const onLoginButtonPressed = async () => {
    setModalType('loading');
    setModalVisible(true);

    const data = {
      phoneNumber: phoneNumber,
      pin: password,
    };

    await USER_LOGIN(data)
      .then(data => {
        setModalVisible(false);
        storeUserSession(data).then(() => {
          navigation.reset({
            index: 0,
            routes: [
              {
                name: 'UserHome',
              },
            ],
          });
        });
      })
      .catch(error => {
        setModalMessage(error);
        setModalType('warning');
        console.log('Error : ' + error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textHello}>Masuk</Text>
      <View style={styles.input}>
        <Input
          placeholder={'Masukan Nomor Telpon'}
          onChangeText={text => setPhoneNumber(text)}
          keyboardType={'phone-pad'}
          maxLength={16}
          value={phoneNumber}
        />
      </View>
      <View style={styles.input}>
        <Input
          placeholder={'Masukan 6 Pin'}
          maxLength={6}
          keyboardType={'default'}
          secureTextEntry={true}
          onChangeText={text => setPassword(text)}
          value={password}
        />
      </View>
      <Button
        containerStyle={{marginTop: 24}}
        title={'Masuk'}
        onPress={() => onLoginButtonPressed()}
      />
      <View style={styles.bottomContainer}>
        <Text>Belum mempunyai akun?</Text>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => navigation.navigate('AuthRegister')}>
          <Text style={styles.textDaftar}>Daftar</Text>
        </TouchableOpacity>
      </View>
      <BaseModal
        visible={modalVisible}
        type={modalType}
        message={modalMessage}
        onButtonPress={() => (
          setModalVisible(false),
          modalType == 'success' ? navigation.navigate('Auth') : null
        )}
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
