import { StyleSheet } from 'react-native';


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 50,
    },
    profileButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerTextProfile: {
      fontSize: 18,
      fontWeight: 'bold',
      marginLeft: 10,
    },
    headerTextLogout: {
      fontSize: 18,
      color:'#EC353A',
      fontWeight: 'bold',
      right: 10,
    },
    imageContainer: {
      alignItems: 'center',
      marginTop: 50,
    },
    image: {
      width: 120,
      height: 120,
      borderRadius: 60,
    },
    profileInfo: {
      flexDirection:'row',
      justifyContent: 'center',
      paddingTop: 10, 
    },
    infoText: {
      fontSize: 16,
      fontWeight: 'bold',
      color:'#EC353A'
    },
    infoSeparator: {
      backgroundColor:'#d6d6d6',
      borderRadius:100,
      width:10,
      height:10,
      alignSelf:'center',
      marginLeft:10,
      marginRight:10
    },
    boxInfoValues:{
      // backgroundColor:'#1713132a',
      padding:30,
      marginTop: 20,
    },
    borderRight: {
      borderRightWidth: 1,
      borderRightColor: '#d6d6d6',
      paddingRight: 15,
    },
    infoValues: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 13,
      
    },
    infoLabelContainer: {
      alignItems: 'center',
    },
    infoLabelText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#858585',
    },
    valueText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
      marginTop:15
    },
  
    boxProfile:{
      position: 'absolute',
      backgroundColor: '#ec353b06',
  
      paddingHorizontal:150,
      paddingVertical:110,
      top:150,
      padding: 40, 
  
      zIndex:-1,
      alignSelf:'center'
  
    },
  
    menuProfileContainer:{
      flex: 1,
      paddingHorizontal:30,
    },
    menuContainer:{
      flexDirection:'row',
      justifyContent: 'space-between',
      borderWidth:1,
      borderColor:'#c7c7c741',
      padding:5,
      borderRadius:10,
      marginTop:10
  
    },
    iconMenu:{
      justifyContent:'center',
      alignItems:'center'

    },
    circleMenu:{
        alignSelf:'center',
        borderRadius:100,
        backgroundColor:'#b1ff682a',
        width:50,
        height:50
    },
    textMenu:{
      alignSelf:'center',
      fontWeight:'bold',
      fontSize:20,
      right:25
  
    }
  });

  export default styles;