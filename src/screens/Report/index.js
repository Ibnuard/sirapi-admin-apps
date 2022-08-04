import * as React from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {Colors} from '../../styles';
import {MONTH_LIST} from '../../utils/Constants';
import {GET_CURRENT_DATETIME} from '../../utils/Utils';
import Icon from 'react-native-vector-icons/Entypo';
import {ActivityIndicator} from 'react-native-paper';

const ReportScreen = () => {
  const MONTHS = MONTH_LIST(true);
  const currentMonth = Number(GET_CURRENT_DATETIME().split('-')[1]) - 1;

  const [activeMonth, setActiveMonth] = React.useState(currentMonth);
  const [isLoading, setIsLaoding] = React.useState(false);

  const EX_REPORT = [
    {
      id: 0,
      report: [
        {
          year: 2022,
          productIn: 200,
          productOut: 1000,
        },
      ],
    },
    {
      id: 1,
      report: [
        {
          year: 2022,
          productIn: 3200,
          productOut: 800,
        },
      ],
    },
    {
      id: 2,
      report: [
        {
          year: 2022,
          productIn: 900,
          productOut: 200,
        },
      ],
    },
    {
      id: 7,
      report: [
        {
          year: 2022,
          productIn: 300,
          productOut: 100,
        },

        {
          year: 2021,
          productIn: 300,
          productOut: 100,
        },
      ],
    },
  ];

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
      <View>
        {item?.report?.map((item, index) => {
          return (
            <View style={styles.card}>
              <Text style={styles.textYear}>{item?.year}</Text>
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
                  <Icon
                    name={'arrow-bold-up'}
                    size={18}
                    color={Colors.COLOR_WHITE}
                  />
                  <Text style={styles.textCount}>{item?.productIn}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>
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
      ) : filterReportByCurrentMonth(EX_REPORT).length ? (
        <View style={styles.content}>
          <FlatList
            data={filterReportByCurrentMonth(EX_REPORT)}
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
