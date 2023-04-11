import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NavigationContainer } from "@react-navigation/native";
import ListUser from "./Components/ListUser";
import ListProduct from "./Components/ListProduct";

const Tab = createMaterialTopTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="ListUser" style={styles.container}>
        <Tab.Screen
          name="ListUser"
          component={ListUser}
          options={{ title: "Danh sách tài khoản" }}
        />
        <Tab.Screen
          name="ListProduct"
          component={ListProduct}
          options={{ title: "Danh sách sản phẩm" }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    marginTop: 50,
  }
});
