import * as React from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {Colors} from '../../styles';
import Icon from 'react-native-vector-icons/Entypo';
import {CustomText} from '../../components';
import {
  ADMIN_GET_ALL_REQUEST,
  ADMIN_GET_REPORT,
} from '../../utils/FirebaseUtils';
import {ActivityIndicator} from 'react-native-paper';

const HomeScreen = ({navigation}) => {
  const [filter, setFilter] = React.useState('AB');
  const [filterKey, setFilterKey] = React.useState('all'); // 'all' || 'pending' || 'success' || 'reject'
  const [report, setReport] = React.useState();
  const [reportError, setReportError] = React.useState(false);
  const [requestList, setRequestList] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getProductReport();
      getAllRequest();
    });

    return unsubscribe;
  }, [navigation]);

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

  const filterStatus = [
    {
      type: 'all',
      title: 'Semua',
    },
    {
      type: 'pending',
      title: 'Pending',
    },
    {
      type: 'success',
      title: 'Sukses',
    },
    {
      type: 'reject',
      title: 'Ditolak',
    },
  ];

  function getProductReport() {
    ADMIN_GET_REPORT()
      .then(snapshot => {
        const data = snapshot.data();
        setReport(data);
      })
      .catch(() => {
        setReportError(true);
      });
  }

  function getAllRequest() {
    setIsLoading(true);
    setRequestList([]);
    ADMIN_GET_ALL_REQUEST().then(snapshot => {
      if (snapshot.size > 0) {
        let temp = [];
        snapshot.forEach(doc => {
          const data = doc?.data();
          temp.push(data);
        });
        setRequestList(temp);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    });
  }

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
        <View style={{marginTop: 8}}>
          <Text style={styles.textTitle}>{title ?? '...'}</Text>
          <Text style={styles.textDesc}>{desc ?? '...'}</Text>
        </View>
      </View>
    );
  };

  //list item
  const RenderItem = ({item}) => {
    return (
      <View style={styles.listCard}>
        <View style={styles.defaultIcon}>
          <Text style={styles.textTitleLarge}>
            {item?.requester?.requestQty}
          </Text>
        </View>
        <View style={{flex: 1}}>
          <Text style={styles.textTitleBlack}>
            {item?.product?.productName}
          </Text>
          <Text style={styles.textDescBlack}>
            permintaan oleh {item?.requester?.requestName}
          </Text>
          <Text style={styles.textDescBlackSmall}>{item.timestamp}</Text>
        </View>
        <Badge status={item?.status} />
      </View>
    );
  };

  //status filter
  const renderStatusFilter = () => {
    return (
      <View style={styles.filterContainer}>
        {filterStatus.map((item, index) => {
          return (
            <View
              style={
                item?.type == filterKey
                  ? styles.statusFilterContainerActive
                  : styles.statusFilterContainer
              }>
              <TouchableOpacity
                style={styles.statusFilterButton}
                activeOpacity={0.6}
                onPress={() => setFilterKey(item?.type)}>
                <Text
                  style={
                    item?.type == filterKey
                      ? styles.textFilter
                      : styles.textFilterInactive
                  }>
                  {item?.title}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    );
  };

  //MAIN RENDER
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <CardView
          title={report?.productIn}
          icon="arrow-bold-down"
          secondary={true}
          desc={'Barang Masuk'}
        />
        <CardView
          title={report?.productOut}
          icon="arrow-bold-up"
          desc={'Barang Keluar'}
        />
      </View>
      <View style={styles.row}>
        <CardView
          title={report?.productAvailable}
          icon="circular-graph"
          desc={'Barang Sisa'}
        />
        <CardView
          title={report?.productTotal}
          secondary
          icon={'circle'}
          desc={'Total Barang'}
        />
      </View>
      <View style={styles.stockContainer}>
        <View style={styles.itemRow}>
          <Text style={styles.textTitleBlack}>Permintaan</Text>
          {!requestList?.length ? null : (
            <TouchableOpacity
              style={styles.touchableFilter}
              activeOpacity={0.6}
              onPress={() => setFilter(filter == 'AB' ? 'BA' : 'AB')}>
              <Text style={styles.textTitleBlue}>
                {filter == 'AB' ? 'Terbaru-lama' : 'Terlama-baru'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {isLoading ? (
          <View style={{flex: 1, justifyContent: 'center'}}>
            <ActivityIndicator />
          </View>
        ) : !requestList?.length ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={styles.textDescBlack}>Belum ada permintaan</Text>
          </View>
        ) : (
          <>
            {renderStatusFilter()}
            <FlatList
              contentContainerStyle={styles.list}
              data={requestList}
              renderItem={({item, index}) => <RenderItem item={item} />}
            />
          </>
        )}
      </View>
    </View>
  );
};

{
  /* 
 ; */
}

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
    flex: 1,
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

  filterContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
  },

  statusFilterContainer: {
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 0.5,
  },

  statusFilterContainerActive: {
    flex: 1,
    backgroundColor: Colors.COLOR_SECONDARY,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 0,
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

  textFilter: {
    color: Colors.COLOR_WHITE,
    fontSize: 12,
  },

  textFilterInactive: {
    color: Colors.COLOR_BLACK,
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

export default HomeScreen;
