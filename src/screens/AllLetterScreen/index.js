import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const LetterCreationScreen = ({ navigation }) => {
    const handleCreateOvertimeLetter = () => {
        navigation.navigate('Create Overtime Letter');
    };

    const handleCreateLeaveLetter = () => {
        navigation.navigate('CreateLeaveLetter');
    };

    const handleCreateAppealLetter = () => {
        navigation.navigate('CreateAppealLetter');
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.itemContainer} onPress={handleCreateOvertimeLetter}>
                <View style={styles.itemTextContainer}>
                    <Text style={styles.monthText}>Letter Overtime</Text>
                    <Text style={styles.dateText}>Create a letter for overtime request</Text>
                </View>
                <Text style={styles.salaryText}>Create</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.itemContainer} onPress={handleCreateLeaveLetter}>
                <View style={styles.itemTextContainer}>
                    <Text style={styles.monthText}>Letter Cuti/Izin</Text>
                    <Text style={styles.dateText}>Create a letter for leave request</Text>
                </View>
                <Text style={styles.salaryText}>Create</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.itemContainer} onPress={handleCreateAppealLetter}>
                <View style={styles.itemTextContainer}>
                    <Text style={styles.monthText}>Letter Banding Attendance</Text>
                    <Text style={styles.dateText}>Create a letter for attendance appeal</Text>
                </View>
                <Text style={styles.salaryText}>Create</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f5f5f5',
    },
    itemContainer: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemTextContainer: {
        flexDirection: 'column',
    },
    monthText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    dateText: {
        fontSize: 14,
        color: '#888',
    },
    salaryText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#007bff',
    },
});

export default LetterCreationScreen;
