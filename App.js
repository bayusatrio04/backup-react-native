// AppNavigator.js
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import LoginOrRegisterScreen from './src/screens/ChooseLoginOrRegisterScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeEmployeesScreen';
import ProfileScreen from './src/screens/ProfileScreen/';
import MyPaySlipScreen from './src/screens/MyPaySlipScreen/';
import EditProfileScreen from './src/screens/EditProfileScreen';
import HistoryAttendance from './src/screens/HistoryAttendanceScreen';
import HistorySalaries from './src/screens/HistorySalariesScreen';
import AllHistoryAttendance from './src/screens/AllAttendanceScreen';
import LetterCreationScreen from './src/screens/AllLetterScreen';
import OvertimeLetterScreen from './src/screens/OvertimeLetterScreen';

import HistoryLettersScreen from './src/screens/HistoryLettersScreen';
import HistoryOvertimeLetter from './src/screens/HistoryLettersScreen/OvertimeLetterScreen';

//Admin
import DashboardAdminScreen from './src/screens/DashboardAdminScreen';
import DashboardEmployeeManagementScreen from './src/screens/DashboardEmployeeManagementScreen';


import LoadingScreen from './src/screens/LoadingScreen';

//Employee Management
import DashboardEmployeeCreateScreen from './src/screens/DashboardEmployeeCreateScreen';
import EmployeeDetailScreen from './components/EmployeeDetailScreen';
import DashboardEmployeeListScreen from './src/screens/DashboardEmployeeListScreen';
import DashboardEmployeeUpdateScreen from './src/screens/DashboardEmployeeUpdateScreen';


//Payroll Management
import DashboardPayrollManagement from './src/screens/DashboardPayrollManagement';
import DashboardPayrolls from './src/screens/DashboardPayrolls';
import DashboardTaxScreen from './src/screens/DashboardTaxScreen';
import DetailTaxScreen from './src/screens/DashboardTaxScreen/read';
import DashboardTaxCreateScreen from './src/screens/DashboardTaxScreen/create';

// Manage Basic Salary
import DashboardBasicSalary from './src/screens/DashboardBasicSalary';
import DetailBasicSalaryScreen from './src/screens/DashboardBasicSalary/read';
import DashboardBasicSalaryCreateScreen from './src/screens/DashboardBasicSalary/create';




//Manage Position
import DashboardPositionScreen from './src/screens/DashboardPositionScreen';
import DashboardPositionJobCreateScreen from './src/screens/DashboardPositionScreen/create';
import DetailPositionScreen from './src/screens/DashboardPositionScreen/read';


// Manage User Login
import ManageDashboardUser from './src/screens/ManageDashboardUser';
import ManageDashboardUserCreate from './src/screens/ManageDashboardUserCreate';

import UserLoginDetailScreen from './components/UserLoginDetailScreen';

//Manage Overtime Screen
import OvertimeManagementScreen from './src/screens/DashboardOvertimeScreen';
import OvertimeDetailScreen from './components/OvertimeDetailScreen';
import OvertimeUpdateScreen from './src/screens/DashboardOvertimeUpdateScreen';



//Dashboard Absence Management Screen
import DashboardAbsenceManagement from './src/screens/DashboardAbsenceManagement';
import DashboardManageAbsensi from './src/screens/DashboardManageAbsensi';
import AbsensiDetail from './src/screens/DashboardManageAbsensi/read';
//Dashboard manage status
import DashboardManageStatus from './src/screens/DashboardManageStatus';
import StatusDetail from './src/screens/DashboardManageStatus/read';
import DashboardManageStatusCreate from './src/screens/DashboardManageStatus/create';
//Dashboard manage status
import DashboardManageType from './src/screens/DashboardManageType';
import TypeDetail from './src/screens/DashboardManageType/read';
import DashboardManageTypeCreate from './src/screens/DashboardManageType/create';



const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="OnboardingScreen">
      <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{ headerShown: false }} // Menghilangkan header
        />
      <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{ headerShown: false }} // Menghilangkan header
        />
        <Stack.Screen
          name="Loading"
          component={LoadingScreen}
          options={{ headerShown: false }} // Menghilangkan header
        />
      <Stack.Screen
          name="LoginOrRegister"
          component={LoginOrRegisterScreen}
          options={{ headerShown: false }} // Menghilangkan header
        />
      <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ headerShown: false }} // Menghilangkan header
        />
      <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }} // Menghilangkan header
        />

      <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            headerShown:false
          }}
        />
      <Stack.Screen
          name="Edit Profile"
          component={EditProfileScreen}
          options={{
            headerShown:false
          }}
        />
      <Stack.Screen
          name="Attendance Summary"
          component={HistoryAttendance}
          options={{
            headerShown:true
          }}
        />
        <Stack.Screen
          name="History Salaries"
          component={HistorySalaries}
          options={{
            headerShown:false
          }}
        />
          <Stack.Screen
          name="Month Attendance History"
          component={AllHistoryAttendance}
          options={{
            headerShown:true
          }}
        />
          <Stack.Screen
          name="Letter Creation"
          component={LetterCreationScreen}
          options={{
            headerShown:false
          }}
        />
                  <Stack.Screen
          name="History Letters"
          component={HistoryLettersScreen}
          options={{
            headerShown:false
          }}
        />
                          <Stack.Screen
          name="History Overtime Letter"
          component={HistoryOvertimeLetter}
          options={{
            headerShown:false
          }}
        />
        <Stack.Screen
          name="Create Overtime Letter"
          component={OvertimeLetterScreen}
          options={{
            headerShown:true
          }}
        />

      <Stack.Screen
          name="PayslipScreen"
          component={MyPaySlipScreen}
          options={{
            headerShown:false
          }}
        />



    {/* Admin Screen */}
    <Stack.Screen
          name="Dashboard Admin"
          component={DashboardAdminScreen}
          options={{
            headerShown:false
          }}
        />




            {/* Employee Management Screen */}
          <Stack.Screen
          name="Employee Management"
          component={DashboardEmployeeManagementScreen}
          options={{
            headerShown:false
          }}
          
        />
          <Stack.Screen
          name="Create Employee"
          component={DashboardEmployeeCreateScreen}
          options={{
            headerShown:false
          }}
          
        />
          <Stack.Screen
          name="Employees"
          component={DashboardEmployeeListScreen}
          options={{
            headerShown:false
          }}
          
          
        />
        <Stack.Screen name="Employee Detail" component={EmployeeDetailScreen} />
          <Stack.Screen
          name="Update Employee"
          component={DashboardEmployeeUpdateScreen}
          options={{
            headerShown:false
          }}
          
          
        />


        {/* Payroll Management Screen */}
          <Stack.Screen
          name="Payroll Management"
          component={DashboardPayrollManagement}
          options={{
            headerShown:false
          }}
          
        />
             <Stack.Screen
          name="Payrolls"
          component={DashboardPayrolls}
          options={{
            headerShown:false
          }}
          
        />
          <Stack.Screen
          name="Tax"
          component={DashboardTaxScreen}
          options={{
            headerShown:false
          }}
          
        />        
        <Stack.Screen
        name="Detail Tax"
        component={DetailTaxScreen}
        options={{
          headerShown:false
        }}
        
      />
        <Stack.Screen
        name="Create New Tax"
        component={DashboardTaxCreateScreen}
        options={{
          headerShown:false
        }}
        
      />
      {/* Dashboard Basic Salary */}
      <Stack.Screen
          name="Manage Basic Salary"
          component={DashboardBasicSalary}
          options={{
            headerShown:false
          }}
          
        />
        <Stack.Screen
        name="Detail Basic Salary"
        component={DetailBasicSalaryScreen}
        options={{
          headerShown:false
        }}
        
      />
              <Stack.Screen
        name="Create New Basic Salary"
        component={DashboardBasicSalaryCreateScreen}
        options={{
          headerShown:false
        }}
        
      />


        {/* Manage Dashboard User Login */}

          <Stack.Screen
          name="Manage User Login"
          component={ManageDashboardUser}
          options={{
            headerShown:false
          }}
          
          
        />
          <Stack.Screen
          name="Create User Login"
          component={ManageDashboardUserCreate}
          options={{
            headerShown:false
          }}
          
          
        />
         <Stack.Screen name="Detail User Login" component={UserLoginDetailScreen} />
      {/* Manage Position */}
      <Stack.Screen
          name="Position Job"
          component={DashboardPositionScreen}
          options={{
            headerShown:false
          }}
          />
        <Stack.Screen
          name="Create Position Job"
          component={DashboardPositionJobCreateScreen}
          options={{
            headerShown:false
          }}
          />
        <Stack.Screen
          name="Detail Position Job"
          component={DetailPositionScreen}
          options={{
            headerShown:false
          }}
          />
      {/* Manage Dashboard Overtime */}
      <Stack.Screen
          name="Management Overtime"
          component={OvertimeManagementScreen}
          options={{
            headerShown:true
          }}
          
          
        />
        <Stack.Screen name="Overtime Detail" component={OvertimeDetailScreen} />

        <Stack.Screen
          name="Overtime Update"
          component={OvertimeUpdateScreen}
          options={{
            headerShown:true
          }}
          
          
        />


          {/* Dashboard management Absensi */}

          <Stack.Screen
          name="Absence Management"
          component={DashboardAbsenceManagement}
          options={{
            headerShown:false
          }}
          
          
        />
        {/* Manage Absensi */}
          <Stack.Screen
          name="Manage Absensi"
          component={DashboardManageAbsensi}
          options={{
            headerShown:true
          }}
          
          
        />
          <Stack.Screen
          name="AbsensiDetail"
          component={AbsensiDetail}
          options={{
            headerShown:true
          }}
          
        />
        {/* Manage Status */}
        <Stack.Screen
          name="Manage Status"
          component={DashboardManageStatus}
          options={{
            headerShown:false
          }}
          
          
        />
          <Stack.Screen
          name="StatusDetail"
          component={StatusDetail}
          options={{
            headerShown:true
          }}
          
        />
          <Stack.Screen
          name="Create New Status"
          component={DashboardManageStatusCreate}
          options={{
            headerShown:false
          }}
          
        />

           {/* Manage Type */}
           <Stack.Screen
          name="Manage Type"
          component={DashboardManageType}
          options={{
            headerShown:false
          }}
          
          
        />
          <Stack.Screen
          name="TypeDetail"
          component={TypeDetail}
          options={{
            headerShown:true
          }}
          
        />
          <Stack.Screen
          name="Create New Type"
          component={DashboardManageTypeCreate}
          options={{
            headerShown:false
          }}
          
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
