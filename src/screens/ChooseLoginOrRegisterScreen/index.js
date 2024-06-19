import * as React from "react";
import { Image, StyleSheet, View, Text, TouchableOpacity, Button } from "react-native";

const LoginOrRegisterScreen = ({navigation}) => {
  const LoginButton = ({ onPress, title }) => (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
  const goToLogin = () => {
    navigation.navigate('LoginScreen');
  };
  return (
    <View style={styles.loginOrRegister}>
      <View style={styles.backgroundIcon}/>

      <View
        style={[
          styles.buttonctafilledregister,
          styles.buttonctafilledsignInLayout,
        ]}
      >
        <View style={[styles.shape, styles.shapePosition]} />
        <Text style={[styles.register, styles.textFlexBox]}>Register</Text>
      </View>
      <View
        style={[
          styles.buttonctafilledsignIn,
          styles.buttonctafilledsignInLayout,
        ]}
      >
        <View style={[ styles.shape1ShadowBox]} />
        <LoginButton title="Sign In" onPress={goToLogin} />
        {/* <Button title="Sign In" onPress={goToLogin} color="#FF0000"  /> */}
        {/* <TouchableOpacity onPress={goToLogin} style={[styles.signIn, styles.textFlexBox]}>
          <Text style={styles.signInText}>Sign In</Text>
        </TouchableOpacity> */}
      </View>
      <View style={styles.welcomingMessages}>
        <Text style={[styles.otherwiseYouDont, styles.jobdesLogoFlexBox]}>
          Otherwise you don't get paid!
        </Text>
        <Text
          style={[styles.applyYourAttendance, styles.jobdesLogoFlexBox]}
        >{`Apply Your 
Attendance Work Now`}</Text>
      </View>
      <Text style={[styles.jobdesLogo, styles.jobdesLogoFlexBox]}>
        <Text style={styles.dji}>DJI</Text>
        <Text style={styles.pay}>Pay</Text>
      </Text>
      <Image
        style={styles.ornamentIcon}
        resizeMode="cover"
        source={require("./assets/ornament.png")}
      />
      <View style={styles.pictures}>
        <View style={[styles.picture5, styles.picture5Layout]}>
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
          <Text style={[styles.text, styles.textFlexBox]}>$</Text>
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
      <Image
        style={styles.statusUpIcon}
        resizeMode="cover"
        source={require("./assets/statusup.png")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FF0000', // Mengganti warna latar belakang tombol menjadi merah
    padding:15,
    // paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff', // Mengganti warna teks menjadi putih
    fontSize: 18,
    fontWeight: 'regular',
    textAlign: 'center',
  },
  buttonctafilledsignInLayout: {
    height: 56,
    width: 327,
    left: 24,
    position: "absolute",
  },
  shapePosition: {
    borderRadius: 10,
    bottom: "0%",
    right: "0%",
    height: "100%",
    left: "0%",
    top: "0%",
    position: "absolute",
    width: "100%",
  },
  textFlexBox: {
    textAlign: "center",
    position: "absolute",
  },
  shape1ShadowBox: {
    shadowOpacity: 1,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
  jobdesLogoFlexBox: {
    textAlign: "left",
    position: "absolute",
  },
  picture5Layout: {
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
    maxWidth: "100%",
    maxHeight: "100%",
    position: "absolute",
    overflow: "hidden",
  },
  shape: {
    borderStyle: "solid",
    borderColor: "#ec353a",
    borderWidth: 2,
  },

  buttonctafilledregister: {
    top: 700,
  },
  shape1: {
    shadowColor: "rgba(245, 195, 0, 0.32)",
    shadowRadius: 16,
    elevation: 16,
    backgroundColor: "#ec353a",
    borderRadius: 10,
    bottom: "0%",
    right: "0%",
    height: "100%",
    left: "0%",
    top: "0%",
    position: "absolute",
    width: "100%",
  },
  register: {
    color: "#ec353a",
    fontFamily: "Roboto-Regular",
    fontSize: 18,
    top: "33.93%",
    alignSelf:"center"
  },
  signIn: {


    fontFamily: "Roboto-Regular",
    fontSize: 18,
 
    top: "33.93%",
    alignSelf:"center"
  },
  signInText:{
    color: "#fff",
  },
  buttonctafilledsignIn: {
    top: 628,
  },
  otherwiseYouDont: {
    top: "85.11%",
    fontSize: 12,
    fontWeight: "300",
    fontFamily: "Roboto-Light",
    color: "rgba(46, 46, 46, 0.8)",
    left: "0%",
    textAlign: "left",
  },
  applyYourAttendance: {
    fontSize: 28,
    lineHeight: 36,
    color: "#2e2e2e",
    fontFamily: "Roboto-Regular",
    left: "0%",
    textAlign: "left",
    top: "0%",
  },
  welcomingMessages: {
    top: 480,
    width: 278,
    height: 94,
    left: 24,
    position: "absolute",
  },
  dji: {
    color: "#000",
  },
  pay: {
    color: "#ec353a",
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
  loginOrRegister: {
    backgroundColor: "#ffffff",
    flex: 1,
    height: 812,
    overflow: "hidden",
    width: "100%",
  },
});

export default LoginOrRegisterScreen;
