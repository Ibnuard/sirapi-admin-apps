import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {Button, Counter, Input} from '../../components';
import {Colors} from '../../styles';

const AddProductScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.textInputTitle}>Nama Barang</Text>
        <Input placeholder={'Masukan nama barang'} />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.textInputTitle}>Deskripsi Barang</Text>
        <Input placeholder={'Masukan deskripsi barang'} />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.textInputTitle}>Kode Barang</Text>
        <Input placeholder={'Masukan kode barang'} />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.textInputTitle}>Jumlah Barang</Text>
        <Input placeholder={'Masukan jumlah barang'} keyboardType={'numeric'} />
      </View>
      {/* <Counter /> */}
      <View style={styles.bottomContainer}>
        <Button title="Tambah" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.COLOR_WHITE,
    padding: 24,
  },

  inputContainer: {
    marginBottom: 16,
  },

  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  //text styles

  textInputTitle: {
    color: Colors.COLOR_GRAY,
    fontSize: 14,
    fontWeight: 'normal',
    marginBottom: 8,
  },
});

export default AddProductScreen;
