import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import DateTimePicker from 'react-native-ui-datepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import axios from 'axios';
import SweetAlert from 'react-native-sweet-alert';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const OvertimeLetterScreen = ({ navigation }) => {
    const [overtimeDate, setOvertimeDate] = useState(dayjs());
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [totalHours, setTotalHours] = useState('');
    const [overtimeReason, setOvertimeReason] = useState('');
    const [startTimeOpen, setStartTimeOpen] = useState(false);
    const [selectedTime, setSelectedTime] = useState('');
    const [endTimeOpen, setEndTimeOpen] = useState(false);
    const [selectedEndTime, setSelectedEndTime] = useState('');

    const showStartTime = () => setStartTimeOpen(true);
    const hideStartTime = () => setStartTimeOpen(false);
    const handleConfirmTime = (date) => {
        setSelectedTime(dayjs(date).format('HH:mm'));
        hideStartTime();
    };

    const showEndTime = () => setEndTimeOpen(true);
    const hideEndTime = () => setEndTimeOpen(false);
    const handleConfirmEndTime = (date) => {
        setSelectedEndTime(dayjs(date).format('HH:mm'));
        hideEndTime();
    };

    useEffect(() => {
        if (selectedTime && selectedEndTime) {
            const [startHour, startMinute] = selectedTime.split(':').map(Number);
            const [endHour, endMinute] = selectedEndTime.split(':').map(Number);
            const startTotalMinutes = startHour * 60 + startMinute;
            const endTotalMinutes = endHour * 60 + endMinute;

            if (endTotalMinutes > startTotalMinutes) {
                const durationMinutes = endTotalMinutes - startTotalMinutes;
                const durationHours = durationMinutes / 60;
                setTotalHours(durationHours.toFixed(2));
            } else {
                setTotalHours('');
            }
        }
    }, [selectedTime, selectedEndTime]);

    const handleSubmit = async () => {
        const formattedDate = dayjs(overtimeDate).format('YYYY-MM-DD');
        if (!overtimeDate || !selectedTime || !selectedEndTime || !overtimeReason) {
            console.log('overtimeDate:', formattedDate);
            console.log('startTime:', selectedTime);
            console.log('endTime:', selectedEndTime);
            console.log('overtimeReason:', overtimeReason);
            Alert.alert('Error', 'Isi Formulir Lembur dengan benar');
            return;
        }

        const payload = {
            overtime_date: formattedDate,
            start_time: selectedTime,
            end_time: selectedEndTime,
            total_hours: totalHours,
            overtime_reason: overtimeReason,
            status: "Pending",
        };

        try {
            const token = await AsyncStorage.getItem('accessToken');
            if (!token) {
                Alert.alert('Token Tidak ada');
                return;
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
            <DateTimePicker
                mode="single"
                date={overtimeDate}
                onChange={(params) => setOvertimeDate(params.date)}
                headerButtonColor="#900"
                headerButtonsPosition="#900"
                selectedItemColor="#900"
                yearContainerStyle='red'
            />
            <TouchableOpacity onPress={showStartTime}>
                <TextInput
                    style={styles.input}
                    placeholder="Pilih Jam Mulai nya (HH:mm)"
                    value={selectedTime}
                    editable={false}
                />
            </TouchableOpacity>
            <DateTimePickerModal
                isVisible={startTimeOpen}
                mode="time"
                onConfirm={handleConfirmTime}
                onCancel={hideStartTime}
            />
            <TouchableOpacity onPress={showEndTime}>
                <TextInput
                    style={styles.input}
                    placeholder="Pilih Jam Berakhir nya (HH:mm)"
                    value={selectedEndTime}
                    editable={false}
                />
            </TouchableOpacity>
            <DateTimePickerModal
                isVisible={endTimeOpen}
                mode="time"
                onConfirm={handleConfirmEndTime}
                onCancel={hideEndTime}
            />
            <TextInput
                style={styles.input}
                placeholder="Total Hours"
                value={totalHours}
                editable={false}
            />
            <TextInput
                style={styles.input}
                placeholder="Alasan Lembur"
                multiline
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
    input: {
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        color: '#000',
        borderRadius: 20,
        padding: 10,
    },
    button: {
        marginTop: 10,
        marginBottom: 30,
        backgroundColor: '#900',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default OvertimeLetterScreen;
