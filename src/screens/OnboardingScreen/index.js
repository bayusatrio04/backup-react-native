import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper';

const OnboardingScreen = ({ navigation }) => {
  const swiperRef = React.useRef(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const handleNext = () => {
    if (swiperRef.current && currentIndex < 2) {
      swiperRef.current.scrollBy(1);
      setCurrentIndex(currentIndex + 1);
    }
  };
  
  const handleGetStarted = () => {
    navigation.navigate('LoginOrRegister');
  };

  const handlePrevious = () => {
    if (swiperRef.current && currentIndex > 0) {
      swiperRef.current.scrollBy(-1);
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <View style={styles.container}>
      <Swiper
        style={styles.wrapper}
        showsButtons={false}
        loop={false}
        ref={swiperRef}
        onIndexChanged={index => setCurrentIndex(index)}
        dotColor="#cccccc"  // Warna untuk indikator yang tidak aktif
        activeDotColor="#EC353A"  // Warna untuk indikator yang aktif
      >
        <View style={styles.slide}>
          <Image
            source={require('../../assets/images/onboardingslide1.png')}
            style={styles.image}
          />
        </View>
        <View style={styles.slide}>
          <Image
            source={require('../../assets/images/onboardingslide2.png')}
            style={styles.image}
          />
        </View>
        <View style={styles.slide}>
          <Image
            source={require('../../assets/images/onboardingslide3.png')}
            style={styles.image}
          />
        </View>
      </Swiper>
      <View style={styles.buttonContainer}>
        {currentIndex !== 0 ? (
          <TouchableOpacity
            style={[styles.button, styles.previousButton]}
            onPress={handlePrevious}
          >
            <Text style={styles.buttonText}>Previous</Text>
          </TouchableOpacity>
        ) : <View style={styles.button} />}

        {currentIndex !== 2 ? (
          <TouchableOpacity
            style={[styles.button, styles.nextButton]}
            onPress={handleNext}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.getStartedButton]}
            onPress={handleGetStarted}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  previousButton: {
    backgroundColor: '#eb838338',
  },
  nextButton: {
    backgroundColor: '#EC353A',
  },
  getStartedButton: {
    backgroundColor: '#061495',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});
