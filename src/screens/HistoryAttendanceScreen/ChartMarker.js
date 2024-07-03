import React from 'react';
import { View, Text } from 'react-native';

const ChartMarker = ({ selectedMonth, selectedTotal }) => {
  return (
    <View style={{ position: 'absolute', left: 0, top: 0 }}>
      <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: 5, borderRadius: 5 }}>
        <Text style={{ fontWeight: 'bold' }}>{selectedMonth}</Text>
        <Text>Total: {selectedTotal}</Text>
      </View>
    </View>
  );
};

export default ChartMarker;
