import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import axios from 'axios';
import SweetAlert from 'react-native-sweet-alert';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EmployeeDetailScreen = ({ route, navigation }) => {
    const { id } = route.params;
    const [employeeDetail, setEmployeeDetail] = useState(null);
    const [editField, setEditField] = useState(null);
    const [editedValue, setEditedValue] = useState('');

    useEffect(() => {
        fetchEmployeeDetail();
    }, []);

    const fetchEmployeeDetail = async () => {
        try {
            const token = await AsyncStorage.getItem('accessToken');
            if (!token) {
                throw new Error('Token tidak ditemukan di AsyncStorage');
            }
            const response = await axios.get(
                `https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/frontend/web/index.php?r=employees/view&id=${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setEmployeeDetail(response.data);

            if (response.data.position_id) {
                const positionResponse = await axios.get(
                    `https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/frontend/web/index.php?r=position-employees`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const positionsData = positionResponse.data;
                const position = positionsData.find(pos => pos.id === response.data.position_id);

                setEmployeeDetail(prevEmployeeDetail => ({
                    ...prevEmployeeDetail,
                    position_name: position ? position.position_name : 'Unknown'
                }));
            }
        } catch (error) {
            console.error('Error fetching employee detail:', error);
            SweetAlert.showAlertWithOptions({
                title: 'Error',
                subTitle: 'Failed to fetch employee detail.',
                confirmButtonTitle: 'OK',
                confirmButtonColor: '#c71515',
                style: 'error',
                cancellable: true,
                subTitleStyle: { fontSize: 16 },
            });
        }
    };

    const handleSaveField = async (field) => {
        try {
            const token = await AsyncStorage.getItem('accessToken');
            if (!token) {
                throw new Error('Token tidak ditemukan di AsyncStorage');
            }
            const response = await axios.put(
                `https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/frontend/web/index.php?r=employees/update&id=${id}`,
                { [field]: editedValue },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setEmployeeDetail(prevDetail => ({
                ...prevDetail,
                [field]: editedValue
            }));

            setEditField(null);
            setEditedValue('');

            if (response.status === 200) {
                console.log(`Successfully updated ${field}`);
                SweetAlert.showAlertWithOptions({
                    title: 'Success',
                    subTitle: `Berhasil Mengganti ${field}.`,
                    confirmButtonTitle: 'OK',
                    confirmButtonColor: '#c71515',
                    style: 'success',
                    cancellable: true,
                    subTitleStyle: { fontSize: 16 },
                });
            }
        } catch (error) {
            console.error(`Error updating ${field}:`, error);
            SweetAlert.showAlertWithOptions({
                title: 'Error',
                subTitle: `Failed to update ${field}.`,
                confirmButtonTitle: 'OK',
                confirmButtonColor: '#c71515',
                style: 'error',
                cancellable: true,
                subTitleStyle: { fontSize: 16 },
            });
        }
    };

    if (!employeeDetail) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    const renderEditableField = (label, field, editable = true) => {
        return (
            <View style={styles.detailContainer}>
                <Text style={styles.label}>{label}:</Text>
                {editField === field && editable ?(
                    <View>
                        <TextInput
                            style={styles.input}
                            value={editedValue}
                            onChangeText={setEditedValue}
                        />
                        <TouchableOpacity style={styles.saveButton} onPress={() => handleSaveField(field)}>
                            <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.valueContainer}>
                        <Text style={styles.value}>{employeeDetail[field]}</Text>
                        <TouchableOpacity onPress={() => { setEditField(field); setEditedValue(employeeDetail[field]); }}>
                            <Text style={styles.editButtonText}>Edit</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.headerText}>Employee Detail #{employeeDetail.id}</Text>
            {renderEditableField('Nama Depan', 'nama_depan')}
            {renderEditableField('Nama Belakang', 'nama_belakang')}
            {renderEditableField('Email', 'email')}
            {renderEditableField('Gender', 'jenis_kelamin')}
            {renderEditableField('Phone Number', 'no_telepon')}
            {renderEditableField('Marital Status', 'status_nikah')}
            {renderEditableField('Anak', 'jumlah_tanggungan')}
            {renderEditableField('Date of Birth', 'tanggal_lahir')}
            {renderEditableField('Position', 'position_name', false)}
            {renderEditableField('Employee Type', 'type_karyawan')}
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Employee Management')}>
                <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#efefef',
        padding: 20,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        alignSelf: 'center',
    },
    detailContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        elevation: 2,
        marginTop: 5,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    valueContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    value: {
        fontSize: 16,
        marginBottom: 15,
    },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 8,
        marginBottom: 10,
        borderRadius: 5,
    },
    button: {
        backgroundColor: '#6759ff',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 50,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    editButtonText: {
        color: '#6759ff',
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: '#4caf50',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default EmployeeDetailScreen;
