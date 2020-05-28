import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const styles = StyleSheet.create({
    contenedor_Principal: {
      flex: 1,
      resizeMode: "cover"
    },

    imagen_Fondo:{
      flex: 1,
      resizeMode: "cover"
    },

    contenedor_Logo: {
        flex: 1,

        justifyContent: "center",
        alignItems: "center",

        marginTop: "10%",
        marginHorizontal: "5%",

        backgroundColor: 'rgba(255, 255, 255, 0.45)',
        borderRadius: 20,
    },

    imagen_Logo: {
        width: "100%",
        resizeMode: "contain",
    },

    contenedor_Login: {
        flex: 2,

        justifyContent: 'center',
        alignItems: "center",

        margin: '5%',

        backgroundColor: "rgba(0, 0, 0, 0.65)",
        borderRadius: 20,
    },

    contenedor_textoLogin: {
      flex: 0.4,

      justifyContent: 'center',
      alignItems: "center",

      marginTop: "-20%",
    },

    texto_InicioSesion: {
      color: "white",
      fontSize: hp("7%"),
      fontFamily: 'Lato-Regular'
    },

    contenedor_Inputs: {
      flex: .3,

      justifyContent: "center",
    },

    input: {
      height: "45%",

      marginBottom: "4%",
      paddingHorizontal: "2%",

      fontSize: hp("2.2%"),
      fontFamily: "Lato-Regular",
      backgroundColor: "white"
    },

    label: {
      color: "white",
      fontSize: hp("2%"),
      fontFamily: "Lato-Regular",

      marginBottom: "1%",
    },

    contenedor_Botones: {
        flex: 0.5,

        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-around',

        marginHorizontal: "5%",
        marginBottom: "10%",
    },
//TODO Centrar boton en el contenedor_Botones

    boton: {
      width: wp("36%"),
      backgroundColor: "#4f4f4f"
    },

});

export default styles;