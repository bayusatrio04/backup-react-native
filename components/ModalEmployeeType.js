// ModalEmployeeType.js

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const ModalEmployeeType = ({ visible, initialValue, onSave, onClose }) => {
    const [editedValue, setEditedValue] = useState(initialValue);

    const handleSave = () => {
        onSave(editedValue);
        onClose();
    };

    return (
        <View style={styles.modalContainer}>
            <Text style={styles.modalHeader}>Edit Employee Type</Text>
            <TextInput
                style={styles.input}
                value={editedValue}
                onChangeText={setEditedValue}
            />
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                    <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
    },
    modalHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 8,
        marginBottom: 10,
        borderRadius: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    saveButton: {
        backgroundColor: '#4caf50',
        padding: 10,
        borderRadius: 5,
    },
    cancelButton: {
        backgroundColor: '#c71515',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default ModalEmployeeType;
