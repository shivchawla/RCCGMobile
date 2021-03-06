import Icon from '@expo/vector-icons/Ionicons';
import React from 'react';
import { createStackNavigator } from 'react-navigation';
import colors from '../Constants/Colors';
import AboutScreen from '../Screens/About/AboutScreen';

const AboutStackNavigator = createStackNavigator(
  {
    AboutTabNavigator: AboutScreen
  },
  {
    defaultNavigationOptions: ({ navigation }) => {
      return {
        headerTitle: 'About RCCG',
        headerStyle: {
          backgroundColor: colors.green01
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerLeft: (
          <Icon style={{ paddingLeft: 10 }}
            onPress={() => navigation.openDrawer()}
            name="md-menu"
            color="#fff"
            size={30}
          />
        )
      };
    }
  }
);

export default AboutStackNavigator;