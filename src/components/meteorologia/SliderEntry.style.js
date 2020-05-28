import { StyleSheet, Dimensions, Platform } from 'react-native';
import { widthPercentageToDP as wpF, heightPercentageToDP as hpF } from 'react-native-responsive-screen';
import { colors } from './index.style';

const IS_IOS = Platform.OS === 'ios';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp (percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}

export const sliderHeight = viewportHeight * 0.8;
const slideWidth = wp(70);
const itemHorizontalMargin = wp(2);

export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

export default StyleSheet.create({

    contenedor_Principal: {
        width: itemWidth,
        height: sliderHeight,
        
    },

    imagen_Fondo:{
        flex: 1,
        resizeMode: "contain"
    },

    contenedor_Ubicacion: {
        flex: 0.25,
        flexDirection: "row",
    },

    ubicacion: {
        flex: 1,
        justifyContent: "center",
        marginLeft: "7%",
        paddingRight: "25%",
    },

    texto_Ubicacion: {
        fontSize: hpF("3.5%"),
        fontFamily: "latoregular",
        color: "white"
    },

    fecha: {
        position: "absolute",
        right: "-2%",
        top: "-7%",

        width: "25%",
        height: "80%",

        justifyContent: "center",
        alignItems: "center",
        elevation: 10,
        backgroundColor: "white",
    },

    texto_Fecha: {
        color: "grey",
        fontSize: hpF("2.25%"),
        fontFamily: "latoregular"
    },

    contenedor_Informacion: {
        flex: 0.40,
        flexDirection: "row",
    },

    contenedor_Icono: {
        flex: 0.5,

        justifyContent: 'center',
        alignItems: "center",
        marginLeft: "8%"
    },
    
    icono: {
        flex: 0.5,
        resizeMode: "contain",
        padding: "35%"
    },

    contenedor_Temperatura: {
        flex: 0.5,
        justifyContent: "space-around",
        alignItems: "center",
    },

    temperatura_Maxima: {
        width: "55%",
        height: "45%",
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: "center",
        backgroundColor: "rgba(255, 145, 0, 0.2)",
        borderRightWidth: 3,
        borderRightColor: "rgba(255, 145, 0, 0.5)",
    },

    temperatura_Minima: {
        width: "55%",
        height: "45%",
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: "center",
        backgroundColor: "rgba(0, 187, 255, 0.2)",
        borderRightWidth: 3,
        borderRightColor: "rgba(0, 187, 255, 0.5)",
    },

    texto_Temperatura: {
        fontSize: hpF("4%"),
        color: "white",
        fontFamily: "latoregular"
    },

    contenedor_Descripcion_Extra: {
        flex: 0.15,
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: "2%",
    },

    descripcion: {
        flex: 0.5,
        flexDirection: "row"
    },

    icono_Peque: {
        flex: 1,
        resizeMode: "contain",
        width: "40%",
    },

    texto_Descripcion: {
        fontSize: hpF("3.5%"),
        fontFamily: "latolightitalic",
        color: "white",
        textAlign: "center",
        textAlignVertical: "center",
        marginLeft: "-10%"
    },

    contenedor_Grafica: {
        flex: 0.35,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "3%"
    },

    grafica: {
        fontFamily: "latoregular",
        color: "white",
        fontSize: hpF("2.5%")
    },

    imagen_Fondo:{
        flex: 1,
        resizeMode: "stretch"
    },

    hairline: {
        width: "10%",
        height: 1,
        backgroundColor: "white"
    },
});