import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {Button} from '../../components';
import {Colors} from '../../styles';
import {ADMIN_GET_ALL_PRODUCT} from '../../utils/FirebaseUtils';

const ProductScreen = ({navigation}) => {
  const [products, setProducts] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getAllProducts();
    });

    return unsubscribe;
  }, [navigation]);

  function getAllProducts() {
    setIsLoading(true);
    setProducts([]);
    console.log('Getting products....');
    ADMIN_GET_ALL_PRODUCT().then(data => {
      if (data.size > 0) {
        let temp = [];
        data?.forEach(doc => {
          temp.push(doc.data());
        });
        setProducts(temp);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    });
  }

  const RenderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.listCard}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('EditDeleteProduct', {data: item})}>
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
      </TouchableOpacity>
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
        <Text style={styles.textDesc}>
          Tekan untuk mengupdate atau menghapus barang
        </Text>
      </View>
      <View style={{flex: 1}}>
        {isLoading ? (
          <View style={{justifyContent: 'center', flex: 1}}>
            <ActivityIndicator />
          </View>
        ) : !products?.length ? (
          <View
            style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
            <Text style={styles.textDesc}>Belum Ada Product</Text>
          </View>
        ) : (
          <FlatList
            data={products}
            renderItem={({item, index}) => <RenderItem item={item} />}
          />
        )}
      </View>
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
    width: 52,
    height: 52,
    borderRadius: 12,
  },

  //Text

  textTitleBlack: {
    color: Colors.COLOR_BLACK,
    fontSize: 18,
    fontWeight: 'bold',
  },

  textDesc: {
    color: Colors.COLOR_GRAY,
    fontSize: 12,
  },

  textDescBlack: {
    color: Colors.COLOR_BLACK,
    fontSize: 12,
  },

  textDescBlackSmall: {
    color: Colors.COLOR_GRAY,
    marginTop: 8,
    fontSize: 10,
  },
});

export default ProductScreen;
