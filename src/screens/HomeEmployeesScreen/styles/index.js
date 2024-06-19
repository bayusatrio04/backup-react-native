import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  homeEmployee: {
    backgroundColor: '#ECF0F3',
    borderStyle: "solid",
    height: '100%',
    overflow: "hidden",
    width: "100%",
    flex: 1,
    
  },
  container: {
    paddingHorizontal: 55,
    paddingVertical: 100
  },


  menuContainer: {
    flex: 0,
  },


  MenuController: {
    flex: 1,
    marginTop: 40,
    paddingHorizontal: 20, // Tambahkan padding horizontal 20px

  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20, 
  },
  whiteBox: {
    width: '48%', 
    height: 150,
    backgroundColor: 'white',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  redBox: {
    width: '48%',
    height: 150,
    backgroundColor: '#EC353A',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EC353A', // Warna bayangan sama dengan warna redBox
    shadowOffset: {
      width: 100,
      height: 100,
    },
    shadowOpacity: 1,
    shadowRadius: 100,
  },
  boxTransparant:{
    backgroundColor: 'rgba(255, 255, 255, 0.063)', 
    width: 90, 
    height: 90, 
    borderTopRightRadius: 30, 
    borderBottomRightRadius: 40, 
    borderTopLeftRadius: 100, 
    borderBottomLeftRadius: 100, 
    position: 'absolute', 
    right: 0, 
    top: 0, 
    bottom: 10 
  },
  boxTransparant2:{
    backgroundColor: 'rgba(255, 255, 255, 0.063)', 
    width: 90, 
    height: 90, 
    borderTopRightRadius: 50, 
    borderBottomRightRadius: 100, 
    borderTopLeftRadius: 100, 
    borderBottomLeftRadius: 100, 
    position: 'absolute', 
    right: 0, 
    top: 30, 
    bottom: 10 
  },
  redBoxText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  whiteBoxText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },

  imageContainer: {
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 70,
    borderRadius: 30,
    marginBottom: 10,
  },
  caption: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444444', 
    // backgroundColor: '#E66969', 


  },
  goodAfternoon: {
    fontSize: 15,
    color: '#ffffff',
    fontWeight: 'bold'
  },
  namaLengkap: {
    fontSize: 30,
    color: '#ffffff',
  },
  textContainer: {
    flex: 0,
    marginVertical: 20,
  },
  notificationButton: {
    marginLeft: 'auto',
    marginRight: 10,
    backgroundColor: '#ffffff',
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 4,
  },
  containerNav: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    backgroundColor: '#ffffffff',
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 4,
    marginRight: 10,
  },
  profileButton: {},
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  icon: {
    fontSize: 24,
    color: '#E66969'
  },
  attendanceContainer: {
    marginTop:8,
    color:'white'
  },
  attendance: {
    justifyContent:'center',
    alignSelf:'center'
  },
    refreshText: {
      
    color: '#5a5a624c',
    justifyContent:'center',
    alignSelf:'center'
  },
  dasar: {
    position: 'relative',
    backgroundColor: '#EC353A',
    borderBottomRightRadius: 80,
    borderBottomLeftRadius: 80,
    width: '100%',
    height: 330,
    overflow: 'visible',
    padding: 40, 
    margin: 0,



  },
  modalView: {
    margin: 0,
    height: "60%",
    top: "40%",
    backgroundColor: '#ffffff',
    borderRadius: 0,
    padding: 0,
    paddingTop: 70,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginBottom: 20,
    alignSelf: 'center',
  },
  button: {
    flex: 1,
    borderRadius: 20,
    width:"200",
    height:100,
    backgroundColor: '#b60707',
    marginHorizontal: 5, // Mengatur jarak antara tombol
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center', // Menengahkan teks secara horizontal
    justifyContent: 'center', // Menengahkan teks secara vertikal

  },
  buttonDashboard: {

    borderRadius: 20,
    width:"200",
    height:100,
    backgroundColor: '#b60707',
    marginHorizontal: 5, // Mengatur jarak antara tombol
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center', // Menengahkan teks secara horizontal
    justifyContent: 'center', // Menengahkan teks secara vertikal

  },
  modalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  quickAccess: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff6a6a',
    textAlign: 'center',
  },

  connected: {
    color: 'green',
    alignSelf:'center',

    marginTop: 20,
},
disconnected: {
    color: 'red',
    alignSelf:'center',

    marginTop: 20,
},
});

export default styles;
