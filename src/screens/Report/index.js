import * as React from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {Colors} from '../../styles';
import {MONTH_LIST} from '../../utils/Constants';
import {GET_CURRENT_DATETIME} from '../../utils/Utils';
import Icon from 'react-native-vector-icons/Entypo';
import {ActivityIndicator} from 'react-native-paper';
import {GET_REPORT_DATA, SEND_REPORT_DATA} from '../../utils/FirebaseUtils';

const ReportScreen = ({navigation}) => {
  const MONTHS = MONTH_LIST(true);
  const currentMonth = Number(GET_CURRENT_DATETIME().split('-')[1]) - 1;

  const [activeMonth, setActiveMonth] = React.useState(currentMonth);
  const [isLoading, setIsLoading] = React.useState(false);

  const [report, setReport] = React.useState([]);

  console.log('Active Month : ' + activeMonth);

  React.useEffect(() => {
    getMonthlyReport();
  }, [activeMonth]);

  function getMonthlyReport() {
    setIsLoading(true);
    const month = MONTH_LIST(false)[activeMonth];
    console.log('Update month report....' + month.sub);
    //SEND_REPORT_DATA();
    setReport([]);
    GET_REPORT_DATA(month.sub).then(snapshot => {
      if (snapshot.size > 0) {
        let temp = [];
        snapshot.forEach(data => {
          const datas = data.data();
          temp.push(datas);
        });
        setReport(temp);
        setIsLoading(false);
        console.log('DATA : ' + JSON.stringify(temp));
      } else {
        setIsLoading(false);
      }
    });
  }

  const filterReportByCurrentMonth = (data = []) => {
    return data.filter(function (item) {
      return item?.id == activeMonth;
    });
  };

  function renderMonthList(item, index) {
    return (
      <TouchableOpacity
        style={styles.monthListCard}
        activeOpacity={0.6}
        onPress={() => setActiveMonth(item?.id)}>
        <Text
          style={
            activeMonth == item?.id ? styles.activeText : styles.normalText
          }>
          {item?.sub}
        </Text>
      </TouchableOpacity>
    );
  }

  function renderCardReport(item, index) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.card}
        onPress={() =>
          navigation.navigate('ReportDetail', {
            productIn: item?.productIn,
            productOut: item?.productOut,
            yearId: item?.yearId,
            month: activeMonth,
          })
        }>
        <Text style={styles.textYear}>{item?.yearId}</Text>
        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.COLOR_SECONDARY,
              borderRadius: 12,
              padding: 4,
              margin: 4,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Icon
              name={'arrow-bold-down'}
              size={18}
              color={Colors.COLOR_WHITE}
            />
            <Text style={styles.textCount}>{item?.productIn}</Text>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.COLOR_PRIMARY,
              borderRadius: 12,
              padding: 4,
              margin: 4,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Icon name={'arrow-bold-up'} size={18} color={Colors.COLOR_WHITE} />
            <Text style={styles.textCount}>{item?.productOut}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{backgroundColor: Colors.COLOR_WHITE}}>
        <FlatList
          data={MONTHS}
          horizontal
          renderItem={({item, index}) => renderMonthList(item, index)}
        />
        <View style={styles.divider} />
      </View>
      {isLoading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator />
        </View>
      ) : report.length ? (
        <View style={styles.content}>
          <FlatList
            data={report}
            renderItem={({item, index}) => renderCardReport(item, index)}
          />
        </View>
      ) : (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>Belum ada laporan bulan ini.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.COLOR_LIGHT_GRAY,
    flex: 1,
  },

  divider: {
    height: 0.5,
    backgroundColor: Colors.COLOR_LIGHT_GRAY,
    marginTop: 4,
    width: '100%',
  },

  monthListCard: {
    paddingTop: 8,
    paddingHorizontal: 16,
    height: 36,
    alignItems: 'center',
    marginRight: 8,
  },

  content: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 8,
  },

  card: {
    backgroundColor: Colors.COLOR_WHITE,
    padding: 8,
    borderRadius: 12,
    marginBottom: 8,
  },

  //tectstyles

  activeText: {
    fontSize: 18,
    color: Colors.COLOR_SECONDARY,
  },

  normalText: {
    fontSize: 18,
    color: Colors.COLOR_GRAY,
  },

  textCount: {
    fontSize: 18,
    marginHorizontal: 4,
    color: Colors.COLOR_WHITE,
    paddingHorizontal: 4,
  },

  textYear: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 8,
  },
});

export default ReportScreen;
