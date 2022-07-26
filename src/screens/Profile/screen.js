import * as React from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {Button} from '../../components';
import {Colors} from '../../styles';

const ProductScreen = () => {
  const stocks = [
    {
      name: 'Sepatu',
      image: '',
      description: 'test',
      stock: 80,
    },
    {
      name: 'Sendal',
      image: '',
      description: 'test',
      stock: 8,
    },
    {
      name: 'Topi',
      image: '',
      description: 'test',
      stock: 180,
    },
  ];

  const RenderItem = ({item}) => {
    return (
      <View style={styles.listCard}>
        <View style={styles.defaultIcon}>
          <Text style={styles.textTitleLarge}>{item?.qty}</Text>
        </View>
        <View style={{flex: 1}}>
          <Text style={styles.textTitleBlack}>{item?.name}</Text>
          <Text style={styles.textDescBlack}>{item?.stock}</Text>
          <Text style={styles.textDescBlack}>{item?.description}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Button title="+ Tambah Barang" />
      <View style={styles.stockContainer}>
        <Text style={styles.textTitleBlack}>Stock Barang</Text>
      </View>
      <FlatList
        data={stocks}
        renderItem={({item, index}) => <RenderItem item={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: Colors.COLOR_WHITE,
  },

  stockContainer: {
    marginTop: 18,
  },

  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.COLOR_WHITE,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginVertical: 4,
    marginHorizontal: 4,
    borderRadius: 12,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.16,
    shadowRadius: 1.51,
    elevation: 2,
  },

  defaultIcon: {
    width: 52,
    height: 52,
    backgroundColor: Colors.COLOR_SECONDARY,
    borderRadius: 12,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  //Text

  textTitleBlack: {
    color: Colors.COLOR_BLACK,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProductScreen;
