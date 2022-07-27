import * as React from 'react';
import {View, Text, StyleSheet, FlatList, Image} from 'react-native';
import {Button} from '../../components';
import {Colors} from '../../styles';
import {ADMIN_GET_ALL_PRODUCT} from '../../utils/FirebaseUtils';

const ProductScreen = ({navigation}) => {
  const [products, setProducts] = React.useState([]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getAllProducts();
    });

    return unsubscribe;
  }, [navigation]);

  function getAllProducts() {
    console.log('Getting products....');
    ADMIN_GET_ALL_PRODUCT().then(data => {
      if (data.size > 0) {
        let temp = [];
        data?.forEach(doc => {
          temp.push(doc.data());
          console.log('DATA: ' + doc?.data());
        });
        setProducts(temp);
      }
    });
  }

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
          <Image
            source={{uri: `data:image/png;base64,${item?.productPic}`}}
            style={styles.defaultPic}
            resizeMode={'cover'}
          />
        </View>
        <View style={{flex: 1}}>
          <Text style={styles.textTitleBlack}>{item?.productName}</Text>
          <Text style={styles.textDescBlack}>
            Tersedia {item?.productQuantity}
          </Text>
          <Text style={styles.textDescBlack}>{item?.productDescription}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Button
        title="+ Tambah Barang"
        onPress={() => navigation.navigate('AddProduct')}
      />
      <View style={styles.stockContainer}>
        <Text style={styles.textTitleBlack}>Stock Barang</Text>
      </View>
      <FlatList
        data={products}
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
    marginVertical: 18,
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

  defaultPic: {
    width: 50,
    height: 50,
    borderRadius: 12,
  },

  //Text

  textTitleBlack: {
    color: Colors.COLOR_BLACK,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProductScreen;
