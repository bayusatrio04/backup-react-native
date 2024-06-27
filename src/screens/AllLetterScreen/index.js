import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendar, faClock, faFileAlt, faArrowRight, faArrowLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const LetterCreationScreen = ({ navigation }) => {
    const goHome = () => {
        navigation.navigate('Home');
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
                <FontAwesomeIcon icon={icon} size={24} color="#E1AEFF" style={styles.icon} />
                <Text style={styles.monthText}>{text}</Text>
                {/* <Text style={styles.dateText}>Create a letter for {text.toLowerCase()} request</Text> */}
            </View>
            <FontAwesomeIcon icon={faChevronRight} size={24} color="#E1AEFF" />
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container}>
        <View style={styles.dasar}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={goHome}>
                    <FontAwesomeIcon icon={faArrowLeft} size={25} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Letter Creation</Text>
            </View>
        </View>

        <View style={styles.contentWhite}>
        <View style={styles.containerContent}>
            {renderItem(faClock, 'Create Letter Overtime', handleCreateOvertimeLetter)}
            {renderItem(faCalendar, 'Create Letter Cuti/Izin', handleCreateLeaveLetter)}
            {renderItem(faFileAlt, 'Create Letter Banding Attendance', handleCreateAppealLetter)}
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
        backgroundColor: '#E1AEFF',
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

export default LetterCreationScreen;
