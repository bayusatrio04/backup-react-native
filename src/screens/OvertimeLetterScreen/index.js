import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import DateTimePicker from 'react-native-ui-datepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import axios from 'axios';
import SweetAlert from 'react-native-sweet-alert';
const OvertimeLetterScreen = ({navigation}) => {
    const [overtimeDate, setOvertimeDate] = useState(dayjs());
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [totalHours, setTotalHours] = useState('');
    const [overtimeReason, setOvertimeReason] = useState('');

    useEffect(() => {
        if (startTime && endTime) {
            const [startHour, startMinute] = startTime.split(':').map(Number);
            const [endHour, endMinute] = endTime.split(':').map(Number);

            const startTotalMinutes = startHour * 60 + startMinute;
            const endTotalMinutes = endHour * 60 + endMinute;

            if (endTotalMinutes > startTotalMinutes) {
                const durationMinutes = endTotalMinutes - startTotalMinutes;
                const durationHours = durationMinutes / 60;
                setTotalHours(durationHours.toFixed(2)); // Format to 2 decimal places
            } else {
                setTotalHours('');
            }
        }
    }, [startTime, endTime]);

    const handleSubmit = async () => {
        const formattedDate = dayjs(overtimeDate).format('YYYY-MM-DD');

        const payload = {
            overtime_date: formattedDate,
            start_time: startTime,
            end_time: endTime,
            total_hours: totalHours,
            overtime_reason: overtimeReason,
            status: "Pending",
        };

        console.log('Payload:', payload);

        try {
         
            const token = await AsyncStorage.getItem('accessToken');
            if (!token) {
                Alert.alert('Token Tidak ada');
            }
            const response = await axios.post(
                'https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php/absence/overtime/create',
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log('Response:', response.data);
            SweetAlert.showAlertWithOptions({
                title: 'Messages',
                subTitle: 'Overtime request submitted successfully!',
                confirmButtonTitle: 'OK',
                confirmButtonColor: '#c71515',
                otherButtonTitle: 'Cancel',
                otherButtonColor: '#dedede',
                style: 'success',
                cancellable: true,
                subTitleStyle: {
                  fontSize: 40
                }
              });
              navigation.replace('Home');
              navigation.replace('Create Overtime Letter');
        } catch (error) {
            console.error('Error submitting overtime request:', error);
            Alert.alert('Error', 'Failed to submit overtime request. Please try again.');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Overtime Request</Text>
            <DateTimePicker
                mode="single"
                date={overtimeDate}
                onChange={(params) => setOvertimeDate(params.date)}
            />
            <TextInput
                style={styles.input}
                placeholder="Start Time (HH:mm)"
                value={startTime}
                onChangeText={setStartTime}
            />
            <TextInput
                style={styles.input}
                placeholder="End Time (HH:mm)"
                value={endTime}
                onChangeText={setEndTime}
            />
            <TextInput
                style={styles.input}
                placeholder="Total Hours"
                value={totalHours}
                editable={false} // Disable input
            />
            <TextInput
                style={styles.input}
                placeholder="Overtime Reason"
                multiline={true}
                numberOfLines={4}
                value={overtimeReason}
                onChangeText={setOvertimeReason}
            />
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#ffffff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    button: {
        marginBottom: 30,
        backgroundColor: '#E1AEFF',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default OvertimeLetterScreen;
