import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  FlatList,
  ScrollView,
  Alert,
} from 'react-native';
import {Button} from '../../components';
import {Colors} from '../../styles';
import {ADMIN_GET_PRODUCT_REPORT_IN_OUT} from '../../utils/FirebaseUtils';
import {GET_CURRENT_DATETIME} from '../../utils/Utils';
import SaveBase64Image from 'react-native-save-base-sixty-four';
import ViewShot from 'react-native-view-shot';
import {MONTH_LIST} from '../../utils/Constants';

const ReportDetailScreen = ({route}) => {
  const [productInList, setProductInList] = React.useState();
  const [productOutList, setProductOutList] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  const [reportImage, setReportImage] = React.useState();

  const timestamp = GET_CURRENT_DATETIME('llll');

  const viewRef = React.useRef();

  const MONTHS = MONTH_LIST(false);

  const DATA = {
    productIn: route?.params?.productIn,
    productOut: route?.params?.productOut,
    year: route?.params?.yearId,
    month: route?.params?.month,
  };

  // const captureReport = () => {
  //   captureRef(viewRef, {
  //     format: 'jpg',
  //     quality: 1,
  //     result: 'base64',
  //   }).then(value => {
  //     //console.log('Img: ' + value);
  //     saveTheReport(value);
  //   });
  // };

  const onCapture = React.useCallback(uri => {
    console.log('do something with ', uri);
    setReportImage(uri);
  }, []);

  React.useEffect(() => {
    getProductReport();
  }, []);

  function getReportData(type) {
    return ADMIN_GET_PRODUCT_REPORT_IN_OUT(type);
  }

  function getProductReport() {
    setIsLoading(true);
    Promise.all([getReportData('in'), getReportData('out')])
      .then(data => {
        if (data[0].size > 0) {
          let temp = [];
          data[0].forEach(datas => {
            temp.push(datas.data());
          });

          setProductInList(temp);
        } else {
          setProductInList([]);
        }

        if (data[1].size > 0) {
          let temp = [];
          data[1].forEach(datas => {
            temp.push(datas.data());
          });

          setProductOutList(temp);
        } else {
          setProductOutList([]);
        }

        setIsLoading(false);
      })
      .catch(error => {
        console.log('error: ' + error);
        setIsLoading(false);
        setIsError(true);
      });
  }

  async function saveTheReport(image) {
    // Save to device
    //    with async await
    try {
      const success = await SaveBase64Image.save(reportImage, {
        mimeType: 'image/png',
        quality: 100,
        fileName: 'sirapitest',
      });
      if (!success) {
        // 😭 user did not grant permission
        console.log('Fail not permission');
        Alert.alert('Gagal!', 'Gagal menyimpan laporan di galeri!');
      } else {
        console.log('Sukses menyimpan!!');
        Alert.alert('Sukses!', 'Berhasil menyimpan laporan di galeri!');
      }
    } catch (error) {
      // 💥 there was a crash
      console.log('ERR : ' + error);
      Alert.alert('Gagal!', 'Ada masalah tidak diketahui saat menyimpan!');
    }
  }

  if (isLoading) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator color={Colors.COLOR_ACCENT} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>Waktu permintaan habis. Silahkan coba lagi!</Text>
      </View>
    );
  }

  function renderListData(index, item) {
    return (
      <View style={{flexDirection: 'row', paddingVertical: 8}}>
        <Text style={styles.textCaption}>{item?.productName}</Text>
        <Text style={styles.textValue}>{item?.quantity}x</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{paddingBottom: 60}}>
        <ViewShot
          onCapture={onCapture}
          captureMode="mount"
          style={{backgroundColor: 'white'}}
          options={{result: 'base64'}}>
          <Image
            source={require('../../images/logo.png')}
            style={styles.logo}
            resizeMode={'contain'}
          />
          <Text style={styles.textTitle}>
            Laporan Penerimaan dan Penarikan Barang
          </Text>
          <View style={styles.reportContainer}>
            <Text style={styles.textSubtitle}>Laporan</Text>
            <View style={{flexDirection: 'row', paddingVertical: 8}}>
              <Text style={styles.textCaption}>Barang Masuk</Text>
              <Text style={styles.textValue}>{DATA.productIn}</Text>
            </View>
            <View style={{flexDirection: 'row', paddingVertical: 8}}>
              <Text style={styles.textCaption}>Barang Keluar</Text>
              <Text style={styles.textValue}>{DATA.productOut}</Text>
            </View>
            <View style={{flexDirection: 'row', paddingVertical: 8}}>
              <Text style={styles.textCaption}>Periode</Text>
              <Text style={styles.textValue}>{`${MONTHS[DATA.month].name} ${
                DATA.year
              }`}</Text>
            </View>
            <View style={{flexDirection: 'row', paddingVertical: 8}}>
              <Text style={styles.textCaption}>Waktu Laporan</Text>
              <Text style={styles.textValue}>{timestamp}</Text>
            </View>
          </View>
          <View style={styles.reportContainer}>
            <Text style={styles.textSubtitle}>Detail Barang Masuk</Text>
            {productInList?.length ? (
              <FlatList
                data={productInList}
                renderItem={({index, item}) => renderListData(index, item)}
              />
            ) : (
              <View style={{flexDirection: 'row', paddingVertical: 8}}>
                <Text style={styles.textCaption}>Belum ada barang</Text>
              </View>
            )}
          </View>
          <View style={styles.reportContainer}>
            <Text style={styles.textSubtitle}>Detail Barang Keluar</Text>
            {productOutList?.length ? (
              <FlatList
                data={productOutList}
                renderItem={({index, item}) => renderListData(index, item)}
              />
            ) : (
              <View style={{flexDirection: 'row', paddingVertical: 8}}>
                <Text style={styles.textCaption}>Belum ada barang</Text>
              </View>
            )}
          </View>
        </ViewShot>
      </ScrollView>
      <View style={styles.bottomContainer}>
        <Button
          title="Simpan Laporan ke Perangkat"
          onPress={() => saveTheReport()}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.COLOR_WHITE,
    padding: 24,
  },

  logo: {
    alignSelf: 'center',
    height: 56,
  },

  reportContainer: {
    padding: 14,
  },

  bottomContainer: {
    padding: 24,
    backgroundColor: Colors.COLOR_WHITE,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 4,
  },

  //textstyle
  textTitle: {
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'Roboto-Regular',
    fontWeight: 'bold',
    marginTop: 8,
  },

  textSubtitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    fontWeight: 'bold',
    marginVertical: 8,
  },

  textCaption: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
  },

  textValue: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Roboto-Regular',
  },
});

export default ReportDetailScreen;
