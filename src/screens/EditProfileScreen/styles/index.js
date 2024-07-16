import { StyleSheet } from 'react-native';


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f9f9f9',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingTop: 20,
    },
    profileButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:'center',
      alignSelf:'center',
      marginTop:50
    },
 
    headerTextProfile: {
      fontSize: 18,
      fontWeight: 'bold',
      marginLeft: 140,
    },

    imageContainer: {
      alignItems: 'center',
      marginTop: 50,
      position: 'relative', 
    },
    image: {
      width: 120,
      height: 120,
      borderWidth:5,
      borderColor:'#ffffff',
      borderRadius: 60,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 1,
      shadowRadius: 4,
      elevation: 5,
      zIndex:-1,
    },
    iconContainer: {
      position: 'absolute',
      bottom:"10%",
   
      left: "55%",
      right:"50%",
      backgroundColor: '#EC353A',
      borderWidth:3,
      borderColor:'#ffffff',
      borderRadius: 35, // Ensures the container is circular
      width: 35, // Set width and height to be equal for a circle
      height: 35,
      justifyContent: 'center', // Center the icon within the container
      alignItems: 'center',
    },
    textInput: {
      fontSize: 15,
      paddingHorizontal:10,
      marginBottom: 10,
      fontWeight:'500',
      color:'#918f8f',
      alignSelf: 'flex-start', // Mengatur teks ke kiri
      textAlign: 'left',
  
    },
    input: {
      width: '100%',
      height: 40,
      borderBottomWidth:1,
      borderBottomColor:'#a7a7a74b',
      fontWeight:'bold',
      fontSize:17,
      borderRadius: 8,
      paddingHorizontal: 10,
      marginBottom: 20,
      color:"#000000"
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
      padding:10,
      borderRadius:10,
      marginTop:10,
      marginBottom:10
  
    },
    iconMenu:{
      justifyContent:'center',
      alignItems:'center'

    },

    textMenu:{
      alignSelf:'center',
      fontWeight:'bold',
      fontSize:20,
      right:0
  
    },


    radioButtonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    radioButton: {
      height: 24,
      width: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: '#e71818',
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioButtonSelected: {
      height: 12,
      width: 12,
      borderRadius: 6,
      backgroundColor: '#fc2b2b',
    },
    radioButtonLabel: {
      marginLeft: 10,
      fontSize: 16,
    },
  });

  export default styles;