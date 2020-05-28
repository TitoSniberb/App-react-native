import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from "@react-navigation/drawer";

import { AuthContext } from "../context";

import { Login } from '../screens/login/Login';
import { Consult } from '../screens/consult/Consult';
import { Splash } from '../screens/splash/Splash';
import { Perfil } from "../screens/perfil/Perfil";
import { Agenda } from "../screens/agenda/Agenda";
import { EventoAgenda } from "../components/eventoAgenda/EventoAgenda";

const AuthStack = createStackNavigator();
const AuthStackScreen = () => (
  <AuthStack.Navigator
    screenOptions={{
      headerShown: true // TODO Cambiar por false cuando se sepa como poder volver atras sin el header
    }}
  >
    <AuthStack.Screen 
        name="login" 
        component={ Login }
        options={{ title: "Inicio de sesión" }}
    />

    <AuthStack.Screen
        name="consult" 
        component={ Consult }
        options={{ title: "Consúltanos" }}
    />

  </AuthStack.Navigator>
);

/* const AgendaStack = createStackNavigator();
const AgendaStackScreen = () => (
  <AgendaStack.Navigator
    screenOptions={{
      headerShown: true // TODO Cambiar por false cuando se sepa como poder volver atras sin el header
    }}
  >
    <AuthStack.Screen 
        name="Agenda" 
        component={ Agenda }
        options={{ title: "Agenda" }}
    />

    <AuthStack.Screen
        name="Evento" 
        component={ EventoAgenda }
        options={{ title: "Evento" }}
    />

  </AgendaStack.Navigator>
); */

/* const Tabs = createBottomTabNavigator();
const TabsScreen = () => (
  <Tabs.Navigator>

    <Tabs.Screen
      name="AgendaPrueba"
      component={ AgendaPrueba }
    />

    <Tabs.Screen
      name="CalendarScreen"
      component={ CalendarScreen }
    />

  </Tabs.Navigator>
); */

const Drawer = createDrawerNavigator();
const DrawerScreen = () => (
<Drawer.Navigator>

  <Drawer.Screen
      name="Agenda" component={ Agenda } />

  <Drawer.Screen
    name="Perfil" component={ Perfil } />

</Drawer.Navigator>
);

const RootStack = createStackNavigator();
const RootStackScreen = ({ userToken }) => (
  <RootStack.Navigator headerMode="none">

    {userToken ? (
      <RootStack.Screen
        name="App"
        component={DrawerScreen}
        options={{
          animationEnabled: false
        }}
      />

    ) : (

      <RootStack.Screen
        name="Auth"
        component={AuthStackScreen}
        option={{
          animationEnabled: false
        }}
      />

    )}

  </RootStack.Navigator>
)

export default () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [userToken, setUserToken] = React.useState(null)

  const authContext = React.useMemo(() => {
    return {
      signIn: () => {
        setIsLoading(false);
        setUserToken("dawsd");
      },
      signOut: () => {
        setIsLoading(false);
        setUserToken("null");
      }
    };
  }, []); //Como segundo argumento pasamos un array vacio para que no se repita

  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  /* if (isLoading) {
    return <Splash />;
  } */

  return (
    <AuthContext.Provider value={authContext}>

      <NavigationContainer>
        
        <RootStackScreen userToken={userToken} />
        
      </NavigationContainer>

    </AuthContext.Provider>
  );
}
  