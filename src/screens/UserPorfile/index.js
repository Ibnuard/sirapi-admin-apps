import * as React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {Colors} from '../../styles';
import Icon from 'react-native-vector-icons/AntDesign';
import {removeUserSession, retrieveUserSession} from '../../utils/UserUtils';
import {Button} from '../../components';

const UserProfileScreen = ({navigation}) => {
  const [user, setUser] = React.useState();

  React.useEffect(() => {
    getUserProfile();
  }, []);

  async function getUserProfile() {
    const userSession = await retrieveUserSession();
    const parseSession = JSON.parse(userSession);

    setUser(parseSession);
  }

  async function onLogoutButtonPress() {
    await removeUserSession().then(() => {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'Auth',
          },
        ],
      });
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileTopContainer}>
        <View style={styles.profilePicContainer}>
          <Icon name="user" size={32} />
        </View>
        <Text style={styles.textName}>{user?.fullname}</Text>
        <Text style={styles.textNumber}>{user?.phoneNumber}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.textCaption}>Email</Text>
        <Text>{user?.email}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.textCaption}>Jabatan</Text>
        <Text>{user?.jabatan}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.textCaption}>Departemen</Text>
        <Text>{user?.departemen}</Text>
      </View>
      <Button
        containerStyle={{marginTop: 54}}
        title="Keluar"
        onPress={() => onLogoutButtonPress()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.COLOR_WHITE,
    padding: 24,
  },

  profileTopContainer: {
    alignItems: 'center',
  },

  profilePicContainer: {
    alignSelf: 'center',
    backgroundColor: Colors.COLOR_GRAY,
    height: 64,
    width: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 32,
    marginBottom: 8,
  },

  infoContainer: {
    marginTop: 24,
  },

  //text style

  textName: {
    fontSize: 14,
    fontWeight: 'bold',
  },

  textNumber: {
    fontSize: 12,
  },

  textCaption: {
    fontSize: 12,
    color: Colors.COLOR_GRAY,
  },
});

export default UserProfileScreen;
