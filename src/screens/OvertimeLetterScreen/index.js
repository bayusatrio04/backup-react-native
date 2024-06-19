import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Button, ScrollView } from 'react-native';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
const OvertimeLetterScreen = () => {
    const [overtimeDate, setOvertimeDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [totalHours, setTotalHours] = useState('');
    const [overtimeReason, setOvertimeReason] = useState('');
    const [date, setDate] = useState(dayjs());
    const handleSubmit = () => {
        const formattedDate = dayjs(date).format('YYYY-MM-DD');
        console.log('Overtime Date:', formattedDate);
        console.log('Start Time:', startTime);
        console.log('End Time:', endTime);
        console.log('Total Hours:', totalHours);
        console.log('Overtime Reason:', overtimeReason);
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Overtime Request</Text>
            <DateTimePicker
        mode="single"
        date={date}
        onChange={(params) => setDate(params.date)}
      />
            <TextInput
                style={styles.input}
                placeholder="Start Time"
                value={startTime}
                onChangeText={setStartTime}
            />
            <TextInput
                style={styles.input}
                placeholder="End Time"
                value={endTime}
                onChangeText={setEndTime}
            />
            <TextInput
                style={styles.input}
                placeholder="Total Hours"
                value={totalHours}
                onChangeText={setTotalHours}
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
        marginBottom:30,
        backgroundColor: '#ff2727',
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
