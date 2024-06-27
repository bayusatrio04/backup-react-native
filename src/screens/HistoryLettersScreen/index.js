import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendar, faClock, faFileAlt, faArrowRight, faArrowLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const HistoryLettersScreen = ({ navigation }) => {
    const goHome = () => {
        navigation.navigate('Home');
    };
    const goHistoryOvertimeLetter = () => {
        navigation.navigate('History Overtime Letter');
        console.log('History Overtime Letter Screen');
    };
    const handleCreateOvertimeLetter = () => {
        navigation.navigate('Create Overtime Letter');
    };

    const handleCreateLeaveLetter = () => {
        navigation.navigate('CreateLeaveLetter');
    };

    const handleCreateAppealLetter = () => {
        navigation.navigate('CreateAppealLetter');
    };

    const renderItem = (icon, text, onPress) => (
        <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
            <View style={styles.itemTextContainer}>
                <FontAwesomeIcon icon={icon} size={24} color="#007bff" style={styles.icon} />
                <Text style={styles.monthText}>{text}</Text>
                {/* <Text style={styles.dateText}>Create a letter for {text.toLowerCase()} request</Text> */}
            </View>
            <FontAwesomeIcon icon={faChevronRight} size={24} color="#007bff" />
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container}>
        <View style={styles.dasar}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={goHome}>
                    <FontAwesomeIcon icon={faArrowLeft} size={25} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerText}>History Letters </Text>
            </View>
        </View>

        <View style={styles.contentWhite}>
        <View style={styles.containerContent}>
            {renderItem(faClock, 'History Letter Overtime', goHistoryOvertimeLetter)}
            {renderItem(faCalendar, 'History Letter Cuti/Izin', handleCreateLeaveLetter)}
            {renderItem(faFileAlt, 'History Letter Banding Attendance', handleCreateAppealLetter)}
        </View>
        </View>
    </ScrollView>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    dasar: {
        backgroundColor: '#6759ff',
        height: 220, // Adjust the height as needed
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingVertical: 50
    },
    contentWhite: {
        backgroundColor: 'white',
        width: '100%',
        flex: 1,
        borderRadius: 30,
        padding: 30,
        marginTop: -90, // Adjust to position the white content area correctly over the red background
    },
    headerText: {
        fontSize: 24,
        fontWeight: '500',
        color: '#ffffff',
        marginLeft: 30
    },
    containerContent: {
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
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    itemTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 10,
    },
    monthText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    dateText: {
        fontSize: 14,
        color: '#888',
    },
});

export default HistoryLettersScreen;
