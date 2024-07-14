import {
  View,
  Text,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { styles } from "./styles";
import { useState, useEffect } from "react";
import * as SQLite from "expo-sqlite";
import FontAwesome from "@expo/vector-icons/FontAwesome6";
import ListaScreen from "./lista";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import TemplateList from "./TemplateList";
import TemplateItems from "./TemplateItems";
export default function App() {

  const Drawer = createDrawerNavigator();
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Lista della spesa" component={ListaScreen} />
        <Drawer.Screen name="Lista dei template" component={TemplateList} ></Drawer.Screen>
        <Drawer.Screen name="TemplateItems" unmountOnBlur={true} component={TemplateItems} options={{
                  drawerItemStyle: { display: 'none' }
        }}></Drawer.Screen>
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
