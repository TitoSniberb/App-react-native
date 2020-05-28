import { StyleSheet } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

const styles = StyleSheet.create({
    contenedor_Evento: {
        backgroundColor: "#e0e0e0",
        height: hp("15%"),
        marginTop: "4%",
        marginHorizontal: "5%",
        paddingHorizontal: "4%",
        borderRadius: 5,
        elevation: 5,
        justifyContent: "space-evenly"
    },

    contenedor_Evento_Titulo: {
        flex: 0.5,
        alignItems: "center",
        justifyContent: "center"
    },

    texto_Evento_Titulo: {
      fontSize: hp("2.7%"),
      fontFamily: "latolightitalic",
    },

    contenedor_Evento_Descripcion: {
        flex: 0.25,
        justifyContent: "space-around",
        paddingLeft: "2%",
    },

    contenedor_Icono_y_texto: {
      flexDirection: "row"
    },

    texto_Evento_Descripcion: {
      fontSize: hp("2%"),
      fontFamily: "latoregular",
      color: "grey"
    },
    
    contenedor_Evento_Ubicacion: {
        flex: 0.25,
        flexDirection: "row",
        justifyContent: "center",
    },

    contenedor_Evento_Icono_y_texto: {
        flex: 0.5, 
        flexDirection: "row",
        justifyContent: "center", 
        alignItems: "center"
    }
})

export default styles;