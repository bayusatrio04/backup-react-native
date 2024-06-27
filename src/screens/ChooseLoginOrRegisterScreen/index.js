import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image, Alert } from "react-native";

const LoginOrRegisterScreen = ({ navigation }) => {
  const LoginButton = ({ onPress, title }) => (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
  const Role = ({ onPress, title }) => (
    <TouchableOpacity style={[styles.register, styles.textCenter]}  onPress={onPress}>
      <Text style={{color:'red', fontSize:16}}>{title}</Text>
    </TouchableOpacity>
  );

  const goToLogin = () => {
    navigation.navigate('LoginScreen');
  };
  const goToRegister = () => {
    Alert.alert(
      'Messages',
      'Anda Admin?',
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('LoginScreen'),
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      {/* Background */}
      <View style={styles.backgroundIcon} />

      {/* Register Button Section */}
      <View style={[styles.ctaFilledRegister, styles.ctaFilledLayout]}>
        <View style={[styles.shape, styles.shapePosition]} />
        {/* <Text style={[styles.register, styles.textCenter]}>Role Admin</Text> */}
        <Role title="Role Admin" onPress={goToRegister} />
      </View>

      {/* Sign In Button Section */}
      <View style={[styles.ctaFilledSignIn, styles.ctaFilledLayout]}>
        <View style={styles.shape1ShadowBox} />
        <LoginButton title="Sign In" onPress={goToLogin} />
      </View>

      {/* Welcoming Messages */}
      <View style={styles.welcomingMessages}>
        <Text style={[styles.otherwiseYouDont, styles.textLeft]}>
          Otherwise you don't get paid!
        </Text>
        <Text style={[styles.applyYourAttendance, styles.textLeft]}>
          Apply Your Attendance Work Now
        </Text>
      </View>

      {/* DJI Pay Logo */}
      <Text style={[styles.jobdesLogo, styles.textLeft]}>
        <Text style={styles.dji}>DJI</Text>
        <Text style={styles.pay}>Pay</Text>
      </Text>

      {/* Ornament Icon */}
      <Image
        style={styles.ornamentIcon}
        resizeMode="cover"
        source={require("./assets/ornament.png")}
      />

      {/* Picture Section */}
      <View style={styles.pictures}>
        <View style={[styles.picture5, styles.pictureLayout]}>
          <Image
            style={[styles.shapeIcon, styles.iconPosition]}
            resizeMode="cover"
            source={require("./assets/shape.png")}
          />
          <Image
            style={styles.imagePlaceHolder}
            resizeMode="cover"
            source={require("./assets/image-place-holder.png")}
          />
          <Text style={[styles.text, styles.textCenter]}>$</Text>
        </View>
        <Image
          style={[styles.picture4Icon, styles.iconLayout]}
          resizeMode="cover"
          source={require("./assets/picture-4.png")}
        />
        <Image
          style={styles.picture3Icon}
          resizeMode="cover"
          source={require("./assets/picture-3.png")}
        />
        <Image
          style={styles.picture2Icon}
          resizeMode="cover"
          source={require("./assets/picture-2.png")}
        />
        <Image
          style={[styles.picture1Icon, styles.iconLayout]}
          resizeMode="cover"
          source={require("./assets/picture-1.png")}
        />
      </View>

      {/* Status Up Icon */}
      <Image
        style={styles.statusUpIcon}
        resizeMode="cover"
        source={require("./assets/statusup.png")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    overflow: "hidden",
  },
  button: {
    backgroundColor: '#FF0000',
    borderRadius: 10,
    padding: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  ctaFilledLayout: {
    height: 56,
    width: 327,
    left: 24,
    position: "absolute",
  },
  shapePosition: {
    borderRadius: 10,
    bottom: 0,
    right: 0,
    height: "100%",
    left: 0,
    top: 0,
    position: "absolute",
    width: "100%",
  },
  textCenter: {
    textAlign: "center",
  },
  shape1ShadowBox: {
    shadowOpacity: 1,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
  textLeft: {
    textAlign: "left",
  },
  pictureLayout: {
    height: 200,
    width: 200,
    position: "absolute",
  },
  iconPosition: {
    top: 0,
    left: 0,
  },
  iconLayout: {
    height: 120,
    width: 120,
    position: "absolute",
  },
  backgroundIcon: {
    backgroundColor:"#ec353a",
    height: "100%",
    width: "100%",
    bottom: "46.8%",
    position: "absolute",
    overflow: "hidden",
  },
  shape: {
    borderWidth: 2,
    borderColor: "#ec353a",
  },
  ctaFilledRegister: {
    top: 750,
  },
  register: {
    color: "#ec353a",
    fontFamily: "Roboto-Regular",
    fontSize: 18,
    alignSelf: "center",
    top: "30.93%",
  },
  ctaFilledSignIn: {
    top: 680,
  },
  welcomingMessages: {
    top: 520,
    width: 278,
    height: 130,
    left: 24,
    position: "absolute",
  },
  otherwiseYouDont: {
    top: "100%",
    fontSize: 12,
    fontWeight: "300",
    fontFamily: "Roboto-Light",
    color: "rgba(46, 46, 46, 0.8)",
    left: 0,
  },
  applyYourAttendance: {
    fontSize: 28,
    lineHeight: 36,
    color: "#2e2e2e",
    fontFamily: "Roboto-Regular",
    left: 0,
    textAlign: "left",
    top: 0,
  },
  jobdesLogo: {
    top: "54.68%",
    left: "6.4%",
    fontSize: 20,
    fontWeight: "900",
    fontFamily: "Roboto-Black",
  },
  ornamentIcon: {
    top: 77,
    left: 28,
    width: 294,
    height: 329,
    position: "absolute",
  },
  shapeIcon: {
    left: 0,
    height: 200,
    width: 200,
    position: "absolute",
  },
  imagePlaceHolder: {
    top: 8,
    left: 8,
    width: 184,
    height: 184,
    position: "absolute",
  },
  text: {
    top: 46,
    left: 63,
    fontSize: 96,
    fontWeight: "700",
    fontFamily: "Urbanist-Bold",
    color: "#e93237",
    width: 74,
    height: 107,
  },
  picture5: {
    top: 246,
    left: 211,
    shadowColor: "rgba(0, 0, 0, 1)",
    shadowRadius: 4,
    elevation: 1,
    shadowOpacity: 3,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
  picture4Icon: {
    top: 129,
    left: 115,
  },
  picture3Icon: {
    top: 80,
    left: 313,
    width: 98,
    height: 98,
    position: "absolute",
  },
  picture2Icon: {
    top: 4,
    left: 220,
    width: 70,
    height: 70,
    position: "absolute",
  },
  picture1Icon: {
    left: 0,
    top: 0,
  },
  pictures: {
    top: 45,
    left: -60,
    width: 411,
    height: 446,
    position: "absolute",
  },
  statusUpIcon: {
    top: 81,
    width: 38,
    height: 38,
    left: 0,
    position: "absolute",
  },

  dji: {
    color: "#000",
    },
    pay: {
      color: "#ec353a",
      },
});

export default LoginOrRegisterScreen;
