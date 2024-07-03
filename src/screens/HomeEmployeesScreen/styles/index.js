import { StyleSheet, Dimensions, LinearGradient } from 'react-native';

const { width, height } = Dimensions.get('window');
const wp = (percentage) => (width * percentage) / 100;
const hp = (percentage) => (height * percentage) / 100;

export default StyleSheet.create({
  homeEmployee: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  dasar: {
    flex: 1,
    backgroundColor: '#EC353A',
    borderBottomLeftRadius:50,
    borderBottomRightRadius:50
  },
  containerNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: wp(5),
  },
  menuButton: {
    padding: wp(2),
  },
  notificationButton: {
    padding: wp(2),
  },
  rightButtonsContainer: {
    flexDirection: 'row', // Agar tombol notifikasi dan profil berdampingan
    alignItems: 'center', // Pusatkan secara vertikal
  },
  profileButton: {
    padding: wp(2),
  },
  profileImage: {
    width: wp(12),
    height: hp(6),
    borderRadius: wp(6),
  },
  textContainer: {
    padding: wp(5),
  },
  goodAfternoon: {
    fontSize: hp(2),
    fontWeight: 'bold',
    color:'white'
  },
  namaLengkap: {
    fontSize: hp(3),
 color:'white'
  },
  menuContainer: {
    padding: wp(5),
    paddingVertical:wp(5)
  },
  attendanceContainer: {
    marginBottom: hp(4.5),
  },
  buttonDashboard: {
    backgroundColor: '#900',
    padding: hp(2),
    borderRadius: wp(3),
    alignItems: 'center',
    top:hp(2),
  },
  disconnected: {
    color: 'red',
    textAlign: 'center',
  },
  MenuController: {
    padding: wp(5),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(3),
  },
  whiteBox: {
    backgroundColor: 'white',
    width: wp(42),
    padding: hp(2),
    borderRadius: wp(6),
    alignItems: 'center',
    elevation: 0.2,
  },
  redBox: {
    backgroundColor: '#e74c3c',
    width: wp(90),
    padding: hp(2),
    borderRadius: wp(3),
    position: 'relative',
  },
  Logout:{
    marginTop: hp(4.7),
  },
  imageContainer: {
    marginBottom: hp(1),
  },
  image: {
    width: wp(18),
    height: hp(10),
    resizeMode: 'contain',
  },
  caption: {
    fontSize: hp(2),
    color: '#333',
  },
  redCaption: {
    fontSize: hp(2),
    color: 'white',
    textAlign: 'center',
  },
  absoluteButton: {
    position: 'absolute',
    bottom: hp(2),
    left: wp(10),
    right: wp(10),
    alignItems: 'center',
  },
  boxTransparant: {
    width: wp(15),
    height: hp(3),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    position: 'absolute',
    top: 0,
    left: wp(2),
  },
  boxTransparant2: {
    width: wp(15),
    height: hp(3),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    position: 'absolute',
    bottom: 0,
    right: wp(2),
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(5),
    backgroundColor: 'white',
    padding: hp(4),
    borderRadius: wp(5),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
  },
  modalContent: {
    alignItems: 'center',
    width: '100%',
  },
  modalText: {
    fontSize: hp(2.5),
    marginBottom: hp(1.5),
    textAlign: 'center',
    color:'white'
  },
  buttonProfile: {
    backgroundColor: '#FF78C4',
    padding: hp(2),
    borderRadius: wp(3),
    alignItems: 'center',
    marginBottom: hp(2),
    width: '100%',
  },
  buttonLogout: {
    backgroundColor: '#FF78C4',
    padding: hp(2),
    borderRadius: wp(3),
    alignItems: 'center',
    width: '100%',
  },
});
