import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';

const PositionModal = ({ isVisible, closeModal, data }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={closeModal}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>X</Text>
                    </TouchableOpacity>
                    {data.map((position, index) => (
                        <TouchableOpacity key={index} style={styles.positionItem} onPress={() => console.log(position.id)}>
                            <Text style={styles.positionName}>{position.position_name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    closeButtonText: {
        fontSize: 20,
    },
    positionItem: {
        marginBottom: 20,
    },
    positionName: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 5,
    },
});

export default PositionModal;
