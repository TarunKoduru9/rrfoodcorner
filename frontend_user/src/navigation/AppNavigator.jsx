import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/authentication/LoginScreen";
import SignupScreen from "../screens/authentication/SignupScreen";
import ForgotPasswordScreen from "../screens/authentication/ForgorPasswordScreen";
import ResetPasswordScreen from "../screens/authentication/ResetPasswordScreen";
import VerifyOTPScreen from "../screens/authentication/VerifyOTPScreen";
import OtpLoginScreen from "../screens/authentication/OtpLoginScreen";

import HomeScreen from "../screens/pages/HomeScreen";
import ProfileScreen from "../screens/menu/ProfileScreen";
import OrderScreen from "../screens/menu/OrderScreen";
import CategoryScreen from "../screens/pages/CategoryScreen";
import CartScreen from "../screens/pages/CartScreen";
import CouponScreen from "../screens/pages/CouponScreen";
import AddressScreen from "../screens/authentication/AddressScreen";
import SuccessScreen from "../screens/pages/SuccessScreen";
import FeedbackScreen from "../screens/menu/FeedbackScreen";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="signup"
          component={SignupScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="VerifyOTP"
          component={VerifyOTPScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OtpLogin"
          component={OtpLoginScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: "Cart" }}
        />
        <Stack.Screen
          name="Orders"
          component={OrderScreen}
          options={{ title: "Order" }}
        />
        <Stack.Screen
          name="Feedback"
          component={FeedbackScreen}
          options={{ title: "Feedback" }}
        />
        <Stack.Screen
          name="CategoryItems"
          component={CategoryScreen}
          options={({ route }) => ({
            title: route.params?.categoryName || "Category",
            headerTitleStyle: {
              fontSize: 16,
            },
          })}
        />
        <Stack.Screen
          name="CartScreen"
          component={CartScreen}
          options={{ title: "Cart" }}
        />
        <Stack.Screen
          name="Coupons"
          component={CouponScreen}
          options={{ title: "Coupons" }}
        />
        <Stack.Screen
          name="Location"
          component={AddressScreen}
          options={{ title: "Address" }}
        />
        <Stack.Screen
          name="Success"
          component={SuccessScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </>
  );
};

export default AppNavigator;
