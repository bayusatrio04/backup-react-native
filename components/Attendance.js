import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, TouchableOpacity, Button, RefreshControl } from 'react-native';
import {CheckInButton} from '../src/api/postCheckIn/index';
import {CheckOutButton} from '../src/api/postCheckOut/index';
import moment from 'moment-timezone';
import { useNavigation } from '@react-navigation/native';
import { Color, FontFamily, Border, FontSize } from "../GlobalStyles";
import useUserProfile from '../src/api/getUserProfile';
import  {fetchData}  from '../src/api/getLatestAttendance/fetchData';
const Attendance = () => {
  const {position} = useUserProfile();
  const [isConnected, setIsConnected] = useState(true);
  if (!isConnected) {
    Alert.alert('No Internet Connection', 'Check your internet connection!');
    return;
  }
  const currentDate = moment();
  const navigation = useNavigation();
  const formattedDate = currentDate.format('dddd, DD MMMM YYYY');
  const [refreshing, setRefreshing] = useState(false);
  const [latestTime, setLatestTime] = useState('');
  const [loading, setLoading] = useState(true); 
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false); 
  const [latestStatus, setLatestStatus] = useState(null); 

  useEffect(() => {
    fetchData(setLatestTime, setHasCheckedInToday, setLatestStatus, setLoading);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchData(setLatestTime, setHasCheckedInToday, setLatestStatus, setLoading);
    } catch (error) {
      console.error('Gagal mendapatkan data absensi log:', error.message);
    }
    setTimeout(() => {
      setRefreshing(false);
    }, 2000); // Contoh: berhenti refreshing setelah 2 detik
  };


  return (
    <View style={[styles.attendance, styles.mainOLayout]}
    refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    }>


      <View style={[styles.mainO, styles.mainOLayout]} />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View>
          {!hasCheckedInToday && (
            <Text style={[styles.youHaveAttendance, styles.textFlexBox]}>
              You have not checked in today
            </Text>
          )}
          {hasCheckedInToday && latestStatus === 2 && (
            <>
              <Text style={[styles.youHaveAttendance, styles.textFlexBox]}>
                You have already Attend today
              </Text>
              <View style={styles.attendanceChildOut}>
                <CheckOutButton />
              </View>
            </>
          )}
          <Text style={[styles.text, styles.textFlexBox]}>{latestTime}</Text>
          {!hasCheckedInToday && (
            <View style={styles.attendanceChild}>
              <CheckInButton />
        
            </View>
          )}
        </View>
      )}

      {hasCheckedInToday && latestStatus !== 2 && (
      
      <View>
        <Text style={[styles.youHaveAttendance, styles.textFlexBox]}>
          {`Terimakasih! Data Check IN sedang di proses. :)`}
        </Text>

    </View>


      )}

      <Text style={[styles.textDate, styles.amTypo]}>{formattedDate}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  mainOLayout: {
    width: '100%',
    height: 114,
    position: "absolute",
  },
  textFlexBox: {
    textAlign: "left",
    position: "absolute",
  },
  amTypo: {
    color: Color.colorSilver_100,
    textAlign: "left",
    fontFamily: FontFamily.robotoRegular,
    position: "absolute",
  },
  mainO: {
    top: 0,
    left: 0,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  youHaveAttendance: {
    top: 11,
    left: 27,
    fontSize: FontSize.size_mini,
    color: Color.colorDarkslategray_200,
    fontFamily: FontFamily.robotoRegular,
    textAlign: "left",
    letterSpacing: 0.5,
  },
  attendanceChild: {
    top: 63,
    left: 265,

    
  },
  attendanceChildOut: {
    top: 63,
    left: 265,

  },
  attendanceChildText: {
    top: 53,
    left: 190,
    width:150,
    flexDirection:'row'
  },
  ChildText:{
    color:'blue'
  },
  checkInMessage: {
    top: 100,
    left: 27,
    fontSize: FontSize.size_mini,
    color: Color.colorDarkslategray_200,
    fontFamily: FontFamily.robotoRegular,
    textAlign: "left",
    letterSpacing: 0.5,
  },
  text: {
    top: 39,
    left: 28,
    fontSize: 30,
    letterSpacing: 4.5,
    fontWeight: "600",
    fontFamily: FontFamily.robotoBold,
    color: Color.colorBlack,
  },
  am: {
    top: 49,
    left: 127,
    fontSize: FontSize.size_lg,
    letterSpacing: 0.5,
  },
  textDate: {
    top: 80,
    left: 30,
    fontSize: FontSize.size_2xs,
    width: 170,
 
    letterSpacing: 0.1,
  },

  icon: {
    position:'absolute',
    marginTop: 10, 
  },

});

export default Attendance;

