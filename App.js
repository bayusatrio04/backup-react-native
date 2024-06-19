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


//Admin
import DashboardAdminScreen from './src/screens/DashboardAdminScreen';
import DashboardEmployeeManagementScreen from './src/screens/DashboardEmployeeManagementScreen';


import LoadingScreen from './src/screens/LoadingScreen';

//Employee Management
import DashboardEmployeeCreateScreen from './src/screens/DashboardEmployeeCreateScreen';
import EmployeeDetailScreen from './components/EmployeeDetailScreen';
import DashboardEmployeeListScreen from './src/screens/DashboardEmployeeListScreen';
import DashboardEmployeeUpdateScreen from './src/screens/DashboardEmployeeUpdateScreen';




// Manage User Login
import ManageDashboardUser from './src/screens/ManageDashboardUser';
import ManageDashboardUserCreate from './src/screens/ManageDashboardUserCreate';

import UserLoginDetailScreen from './components/UserLoginDetailScreen';


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
            headerShown:true
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
            headerShown:true
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

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
