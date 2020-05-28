import React, { useEffect } from 'react';
import { 
    Text, 
    View, 
    Image,
    ImageBackground,
    TextInput,
} from 'react-native';

import styles from './styles'

import { Button } from 'react-native-elements';
import SplashScreen from 'react-native-splash-screen';

//* Navegación
import { AuthContext } from '../../context';

export const Login = ({ navigation }) => {
  const { signIn } = React.useContext(AuthContext);

  useEffect( () => {
    SplashScreen.hide();
  }, []);

  return(
    <View style={styles.contenedor_Principal}>
      
      <ImageBackground source={require("../../assets/images/login/fondo_login2.jpg")} style={styles.imagen_Fondo}>

        <View style={styles.contenedor_Logo}>
          <Image source={require("../../assets/images/login/logo_consultia.png")} style={styles.imagen_Logo}></Image>
        </View>

        <View style={styles.contenedor_Login}>

          <View style={styles.contenedor_textoLogin}>
            <Text style={styles.texto_InicioSesion}>Inicio de sesión</Text>
          </View>

          <View style={styles.contenedor_Inputs}>

            <Text style={styles.label}>Número de identificacion</Text>
            <TextInput
              placeholder="Introduzca su número de identificación"
              placeholderTextColor="grey"
              style={styles.input}
            ></TextInput>

            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              placeholder="Introduzca su contraseña"
              placeholderTextColor="grey"
              style={styles.input}
            ></TextInput>

          </View>
          
        </View>

        <View style={styles.contenedor_Botones}>
            
          <Button 
            title="Entrar"
            type="solid"
            buttonStyle={styles.boton}

            onPress={() => signIn()} 
          ></Button>

          <Button 
            title="Consultar"
            type="solid"
            buttonStyle={styles.boton}

            onPress={() => navigation.push("consult")}
          ></Button>

        </View>

      </ImageBackground>

    </View>
  )
}
