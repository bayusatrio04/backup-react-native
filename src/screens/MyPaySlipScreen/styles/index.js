import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    containerLoading:{
        flex:1,
        justifyContent:'center',
        alignContent:'center',
        alignSelf:'center',
        alignItems:'center',
        textAlign:'center'
    },
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 18,
        paddingVertical: 20,
        backgroundColor: '#ff4444',
    },
    paySlipButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 30,
    },
    headerTextPaySlip: {
        fontSize: 18,
        fontWeight: '500',
        marginLeft: 100,
        color: '#feefef',
    },
    infoSalaryContainer: {
        paddingHorizontal: 10,
    },
    infoSalary: {
        backgroundColor: '#FFFFFF',
        padding: 10,
        height: 150,
    },
    salaryTextContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        marginBottom: 8,
    },
    salaryText: {
        color: 'grey',
    },
    salarySaldoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    salaryRP: {
        color: 'grey',
        fontSize: 20,
    },
    salarySaldo: {
        color: 'black',
        fontSize: 30,
        fontWeight: 'bold',
    },
    chartCircle: {
        width: 50,
        height: 50,
        backgroundColor: '#f5f5f5',
        borderWidth: 5,
        borderColor: '#3ef73e',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textChart: {
        textAlign: 'center',
        alignSelf: 'center',
    },
    stat: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
    },
    statText: {
        fontWeight: '500',
        color: '#474da3',
        letterSpacing: 2,
    },
    periodeContainer: {
        padding: 10,
    },
    periodeText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    periodeMonth: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: 'white',
        marginBottom:6
    },

    periodeYear: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: 'white',
    },
    closeButton: {
        marginTop: 10,
        left:140,
        padding: 10,
        backgroundColor: 'red',
        borderRadius: 5,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 18,
    },

    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.828)',
    },
    modalItem: {
        margin: 5,
        backgroundColor: 'white',
        color:'red',
        borderRadius: 10,
        padding: 30,
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




    periodeIcon: {
        width: 50,
        height: 50,
        borderRadius: 10,
        backgroundColor: '#d9d9d97a',
        justifyContent: 'center',
    },
    iconCalendar: {
        alignSelf: 'center',
    },
    periodeTextMonth: {
        alignSelf: 'center',
        right: 40,
        fontSize: 15,
        fontWeight: 'bold',
    },
    deductionContainer: {
        padding: 20,
        borderWidth: 1,
        borderColor: '#80808026',
        borderRadius: 20,
        backgroundColor: 'white',
        marginBottom:20
    },
    deductions: {
        color: 'red',
        fontSize: 20,
    },
    deductionsAllowance: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
        marginBottom: 6,
    },
    textAllowance: {
        color: 'grey',
    },
    textRP: {
        color: '#000000',
    },
    totalDeductionsContainer: {
        marginTop: 30,
        marginHorizontal: -20, 
        marginVertical: -25, 
        paddingHorizontal: 20, 
        paddingVertical: 20,
        borderTopWidth: 1,
        borderColor: '#80808026',
        backgroundColor: '#eaeaea',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    totalDeductions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    textTotal: {
        color: 'black',
        fontWeight:'bold',
        fontSize:20
    },
    earningContainer: {
        padding: 20,
        borderWidth: 1,
        borderColor: '#80808026',
        borderRadius: 20,
        backgroundColor: 'white',
        marginBottom:20
    },
    earnings: {
        color: 'red',
        fontSize: 20,
    },
    earningsAllowance: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
        marginBottom: 6,
    },
    textAllowance: {
        color: 'grey',
    },
    textRP: {
        color: '#000000',
    },
    totalEarningsContainer: {
        marginTop: 30,
        marginHorizontal: -20, 
        marginVertical: -25, 
        paddingHorizontal: 20, 
        paddingVertical: 20,
        borderTopWidth: 1,
        borderColor: '#80808026',
        backgroundColor: '#eaeaea',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    totalEarnings: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },


    calculateAllowance: {
        padding: 10,
        margin: 10,
        width: width - 90, // Mengatur agar tetap dalam batas layar
        backgroundColor: '#f8f8f8',
        borderRadius: 5,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      },
      textCalculateAllowance: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      calculationContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
      },
      textCalculateRP: {
        fontSize: 16,
        marginHorizontal: 5,
        textAlign: 'center',
      },
});


  export default styles;