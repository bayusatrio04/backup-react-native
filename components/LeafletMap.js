import React from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet, View } from 'react-native';

const LeafletMap = () => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Leaflet Map</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
      <style>
        #map {
          width: 100%;
          height: 100%;
        }
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          overflow: hidden;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
      <script>
        var map = L.map('map').setView([51.505, -0.09], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: 'Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        var marker = L.marker([51.505, -0.09]).addTo(map);
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        style={styles.webview}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default LeafletMap;
