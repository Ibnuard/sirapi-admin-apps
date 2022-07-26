import * as React from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {Colors} from '../../styles';
import Icon from 'react-native-vector-icons/Entypo';
import {CustomText} from '../../components';

const HomeScreen = ({navigation}) => {
  const [filter, setFilter] = React.useState('AB');

  const testBarang = [
    {
      nama: 'Bapak Adek',
      barang: 'Buku',
      kode: 'ABCD',
      qty: '12',
      status: 'pending',
      message: '',
      datetime: 'Senin, 1 Juli 2022',
    },
    {
      nama: 'Bapak Kakak',
      barang: 'Sepatu',
      kode: 'ABCD',
      qty: '3',
      status: 'success',
      message: '',
      datetime: 'Selasa, 2 Juli 2022',
    },
    {
      nama: 'Bapak Bubu',
      barang: 'Sandal',
      kode: 'ABCD',
      qty: '4',
      status: 'reject',
      message: 'stock habis',
      datetime: 'Rabu, 3 Juli 2022',
    },
    {
      nama: 'Bapak Adek',
      barang: 'Buku',
      kode: 'ABCD',
      qty: '12',
      status: 'pending',
      message: '',
      datetime: 'Senin, 1 Juli 2022',
    },
    {
      nama: 'Bapak Kakak',
      barang: 'Sepatu',
      kode: 'ABCD',
      qty: '3',
      status: 'success',
      message: '',
      datetime: 'Selasa, 2 Juli 2022',
    },
    {
      nama: 'Bapak Bubu',
      barang: 'Sandal',
      kode: 'ABCD',
      qty: '4',
      status: 'reject',
      message: 'stock habis',
      datetime: 'Rabu, 3 Juli 2022',
    },
  ];

  //render badge
  const Badge = ({status}) => {
    const _setConfig = () => {
      switch (status) {
        case 'reject':
          return {style: styles.badgeReject, title: 'Ditolak'};
          break;
        case 'success':
          return {style: styles.badgeSuccess, title: 'Sukses'};
          break;
        default:
          return {style: styles.badgePending, title: 'Pending'};
          break;
      }
    };
    return (
      <View style={_setConfig().style}>
        <Text style={styles.textBadge}>{_setConfig().title}</Text>
      </View>
    );
  };

  //card view
  const CardView = ({title, desc, secondary, icon}) => {
    return (
      <View style={secondary ? styles.cardSecondary : styles.card}>
        <Icon name={icon} size={18} color={Colors.COLOR_WHITE} />
        <View>
          <Text style={styles.textTitle}>{title ?? 'title'}</Text>
          <Text style={styles.textDesc}>{desc ?? 'desc'}</Text>
        </View>
      </View>
    );
  };

  //list item
  const RenderItem = ({item}) => {
    return (
      <View style={styles.listCard}>
        <View style={styles.defaultIcon}>
          <Text style={styles.textTitleLarge}>{item?.qty}</Text>
        </View>
        <View style={{flex: 1}}>
          <Text style={styles.textTitleBlack}>{item?.barang}</Text>
          <Text style={styles.textDescBlack}>permintaan oleh {item?.nama}</Text>
          <Text style={styles.textDescBlackSmall}>{item.datetime}</Text>
        </View>
        <Badge status={item?.status} />
      </View>
    );
  };

  //MAIN RENDER
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <CardView
          title={'1234'}
          icon="arrow-bold-down"
          secondary={true}
          desc={'Barang Masuk'}
        />
        <CardView title={'8080'} icon="arrow-bold-up" desc={'Barang Keluar'} />
      </View>
      <View style={styles.row}>
        <CardView title={'1234'} icon="circular-graph" desc={'Barang Sisa'} />
        <CardView
          title={'8080'}
          secondary
          icon={'circle'}
          desc={'Total Barang'}
        />
      </View>
      <View style={styles.stockContainer}>
        <View style={styles.itemRow}>
          <Text style={styles.textTitleBlack}>Permintaan</Text>
          <TouchableOpacity
            style={styles.touchableFilter}
            activeOpacity={0.6}
            onPress={() => setFilter(filter == 'AB' ? 'BA' : 'AB')}>
            <Text style={styles.textTitleBlue}>
              {filter == 'AB' ? 'Terbaru-lama' : 'Terlama-baru'}
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          contentContainerStyle={styles.list}
          data={testBarang}
          renderItem={({item, index}) => <RenderItem item={item} />}
        />
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

  card: {
    flex: 1,
    backgroundColor: Colors.COLOR_ACCENT,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginHorizontal: 4,
  },

  cardSecondary: {
    flex: 1,
    backgroundColor: Colors.COLOR_SECONDARY,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginHorizontal: 4,
  },

  row: {
    flexDirection: 'row',
    marginTop: 8,
  },

  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  touchableFilter: {
    flex: 1,
    alignItems: 'flex-end',
  },

  stockContainer: {
    marginTop: 18,
  },

  list: {
    marginTop: 8,
    paddingBottom: 240,
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

  badgePending: {
    backgroundColor: Colors.COLOR_ACCENT,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },

  badgeSuccess: {
    backgroundColor: Colors.COLOR_SECONDARY,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },

  badgeReject: {
    backgroundColor: 'red',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },

  //textstyle

  textTitle: {
    color: Colors.COLOR_WHITE,
    fontSize: 18,
    fontWeight: 'bold',
  },

  textTitleLarge: {
    color: Colors.COLOR_WHITE,
    fontSize: 24,
    fontWeight: 'bold',
  },

  textTitleBlack: {
    color: Colors.COLOR_BLACK,
    fontSize: 18,
    fontWeight: 'bold',
  },

  textTitleBlue: {
    color: Colors.COLOR_SECONDARY,
    fontSize: 14,
    fontWeight: 'bold',
  },

  textDesc: {
    color: Colors.COLOR_LIGHT_GRAY,
    fontSize: 12,
  },

  textBadge: {
    color: Colors.COLOR_WHITE,
    fontSize: 12,
    fontWeight: 'bold',
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

export default HomeScreen;
