import { StyleSheet } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

export const colors = {
    black: '#1a1917',
    gray: '#888888',
    background1: 'red',
    background2: '#21D4FD'
};

export default StyleSheet.create({
    linearGradient: {
        flex: 1,
        borderRadius: 5
    },

    contenedor_Principal: {
        flex: 1,
    },

    contenedor_Titulo: {
        flex: 0.05,
        justifyContent: "center"
    },

    titulo: {
        fontSize: hp("3.5%"),
        fontFamily: "latoregular",
        textAlign: "center",
        marginTop: "2%"
    },

    contenedor_Carousel: {
        flex: 0.9,
        marginTop: "2%",
    },

    contenedor_Paginacion: {
        flex: 0.1,
    },
    
    slider: {
        overflow: 'hidden' // for custom animations
    },

    sliderContentContainer: {
        marginLeft: "12%",
        paddingVertical: 10 // for custom animation
    },

    paginationContainer: {
        borderWidth: 1,
        alignItems: "flex-end"
    },

    paginationDot: {
        width: 10,
        height: 10,
        borderRadius: 4,
        marginHorizontal: 8
    }
});