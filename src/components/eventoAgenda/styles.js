import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

// ! Default para COCHE

const styles = StyleSheet.create({
    contenedor_Principal: {
        flex: 1,
        marginRight: "5%",
    },

    contenedor_Evento: {
        flex: 1,
        backgroundColor: "white",
        height: hp("20%"),
        marginTop: "4%",
        padding: "2%",
        borderRadius: 10,
        
        elevation: 10,
    },

    contenedor_Evento_Titulo: {
        flex: 1/3,
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: "2%"
    },

    texto_Evento_Titulo: {
        fontSize: hp("3%"),
        marginRight: "4%",
        fontFamily: "latobold"
    },

    icono_Evento: {
        color: "#2299E8",
    },

    contenedor_Evento_Descripcion: {
        flex: 1/3,
        justifyContent: "space-around",
        paddingLeft: "2%"
    },

    texto_Evento_Descripcion: {
        fontSize: hp("2%"),
        fontFamily: "latoregular",
        color: "grey"
    },

    contenedor_Evento_Ubicacion: {
        flex: 1/3,
        flexDirection: "row",
        justifyContent: "center",
    },

    contenedor_Evento_Icono_y_texto: {
        flex: 0.5, 
        flexDirection: "row",
        justifyContent: "center", 
        alignItems: "center"
    },

    contenedor_Overlay: {
        flex: 1,
    },

    contenedor_IdaVuelta: {
        flex: 0.8,
    },

    logo: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",

        marginTop: "-2%",
    },

    imagen: {
        flex: 1,
        resizeMode: "contain",
        padding: "13%",
    },

    ida_Vuelta: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-around",
    },


    ida: {
        flex: 1,
        alignItems: "center",

    },

    vuelta: {
        flex: 1,
        alignItems: "center",
    },

    contenedor_Icono_y_texto: {
        flexDirection: "row"
    },

    texto_Titulo: {
        fontSize: hp("3.3%"),
        fontFamily: "latoregular"
    },

    texto_Titulo_Descripcion: {
        fontSize: hp("2.3%"),
        fontFamily: "latoregular",
        
    },

    hairline: {
        width: "80%",
        height: 2,

        marginVertical: "2%",        

        backgroundColor: "rgba(0, 0, 0, 0.2)"
    },

    contenedor_Descripcion: {
        flex: 1,
        marginTop: "-2%",
        marginHorizontal: "2%"
    },

    descripcion: {
        flex: 1,
        justifyContent: "space-around",
        marginHorizontal: "3%",
    },

    label_Descripcion: {
        fontSize: hp("3.5%"),
        fontFamily: "latoregular"
    },

    texto_Descripcion: {
        fontSize: hp("1.95%"),
    },

    nota: {
        fontSize: hp("1.85%"),
        fontFamily: "latoitalic",
        opacity: 0.7,
        marginTop: "3%",
    },
    
    contenedor_Botones: {
        flex: 0.5,
        marginBottom: "5%",
    },

    contenedor_LabelInfo: {
        flex: 0.5,
        alignItems: 'center',
    },

    label_Info: {
        fontSize: hp("3.5%"),
        fontFamily: "latoregular"
    },

    botones_Principales: {
        flex: 1,
        alignItems: "center",
        marginTop: "8%",
    },

    boton_Principal: {
        backgroundColor: "#2299E8",
        width: wp("60%"),
        height: hp("4%"),
        borderRadius: 5
    },

    margen: {
        marginTop: "4%"
    },

    texto_Boton: {
        fontSize: hp("2.3%"),
        color: "white",
        fontFamily: "latoregular"
    },

    // * METEOROLOGOIA

    contenedor_FlatlistMeteorologia: {
        flex: 1,
    },

    iconos: {
        color: "#2299E8",
        marginTop: "1%",
        marginRight: "3%",
    }

})

export default styles;