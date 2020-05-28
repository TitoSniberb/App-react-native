import React, { PureComponent } from 'react';
import { View, Text, Image, ImageBackground } from 'react-native';
import PropTypes from 'prop-types';
import { ParallaxImage } from 'react-native-snap-carousel';
import { widthPercentageToDP as wpF, heightPercentageToDP as hpF } from 'react-native-responsive-screen';
import styles, { sliderWidth, sliderHeight, itemWidth } from './SliderEntry.style';
import moment from "moment";
import {BoxShadow} from 'react-native-shadow';
import ImageResizeMode from "react-native/Libraries/Image/ImageResizeMode";
import { VictoryBar, VictoryChart, VictoryTheme, VictoryAxis, VictoryLine, VictoryLabel, VictoryZoomContainer } from "victory-native"

export default class SliderEntry extends PureComponent {

    static propTypes = {
        data: PropTypes.object.isRequired,
    };

    get image () {
        const { data: { icono } } = this.props;

        const images = {
            "01d": require("../../assets/images/meteo/01d.png"),
            "01n": require("../../assets/images/meteo/01n.png"),
            "02d": require("../../assets/images/meteo/02d.png"),
            "02n": require("../../assets/images/meteo/02n.png"),
            "03d": require("../../assets/images/meteo/03d.png"),
            "03n": require("../../assets/images/meteo/03n.png"),
            "04d": require("../../assets/images/meteo/04d.png"),
            "04n": require("../../assets/images/meteo/04n.png"),
            "09d": require("../../assets/images/meteo/09d.png"),
            "09n": require("../../assets/images/meteo/09n.png"),
            "10d": require("../../assets/images/meteo/10d.png"),
            "10n": require("../../assets/images/meteo/10n.png"),
            "11d": require("../../assets/images/meteo/11d.png"),
            "11n": require("../../assets/images/meteo/11n.png"),
            "13d": require("../../assets/images/meteo/13d.png"),
            "13n": require("../../assets/images/meteo/13n.png"),
            "50d": require("../../assets/images/meteo/50d.png"),
            "50n": require("../../assets/images/meteo/50n.png"),
        }

        return (
            <Image
                source={images[icono]}
                style={styles.icono}
            />
        );
    }

    render () {
        console.log("SI QUE HAY PROPIEDADES!: ", this.props.data)
        const shadowOpt = {
            width: itemWidth,
            height: sliderHeight,
            color:"#000",
            border:10,
            radius:3,
            opacity:0.15,
            x:0,
            y:15,
        }

        const { data: { descripcion, diaSemana, ubicacion, horas, tempMinima, tempMaxima, humedad, viento} } = this.props;

        let graficos = []
        let grafico = {}

        this.props.data.horas.forEach(elem => {
            grafico = {
                x: moment(elem.hora).format("HH:mm"),
                y: elem.temp
            }
            graficos.push(grafico)
        })

        return (
            <BoxShadow setting={shadowOpt}>

                <View style={styles.contenedor_Principal}>

                    <ImageBackground source={require("../../assets/images/meteo/nubes.jpg")} style={styles.imagen_Fondo}>

                        <View style={styles.contenedor_Ubicacion}>

                            <View style={styles.ubicacion}>
                                <Text style={styles.texto_Ubicacion}> 
                                    {ubicacion}
                                </Text>
                                <View style={[styles.hairline, {marginTop: "2%"}]} />
                            </View>
                            
                            <View style={styles.fecha}>
                
                                <Text style={styles.texto_Fecha}>
                                    {moment(diaSemana).format("ddd").toUpperCase()}
                                </Text>

                                <Text style={{fontSize: hpF("3%"), fontFamily: "latobold", color: "black"}}>
                                    {moment(diaSemana).format("DD")}
                                </Text>

                                <Text style={styles.texto_Fecha}>
                                    {moment(diaSemana).format("MMM").toUpperCase()}.
                                </Text>

                            </View>

                        </View>

                        <View style={styles.contenedor_Informacion}>

                            <View style={styles.contenedor_Icono}>
                                { this.image }
                            </View>

                            <View style={styles.contenedor_Temperatura}>

                                <View style={styles.temperatura_Maxima}>

                                    <Text style={styles.texto_Temperatura}>
                                        { tempMaxima }º
                                    </Text>

                                </View>
                                
                                <View style={styles.temperatura_Minima}>

                                    <Text style={styles.texto_Temperatura}>
                                        { tempMinima }º
                                    </Text>

                                </View>
                            
                            </View>

                        </View>

                        <View style={styles.contenedor_Descripcion_Extra}>

                            <View style={[styles.descripcion, {flex: 0.6, justifyContent: "center"}]}>
                                <Text style={styles.texto_Descripcion}>
                                        { descripcion }
                                </Text>
                            </View>

                            <View style={{flex: 0.4}}>

                                <View style={[styles.descripcion, {justifyContent: "space-around"}]}>

                                    <View style={{flex: 0.4, justifyContent: 'center', alignItems: "flex-end"}}>

                                        <Image source={require("../../assets/images/meteo/humedad.png")} style={styles.icono_Peque} />

                                    </View>

                                    <View style={{flex: 0.6, justifyContent: 'center', alignItems: "center", marginLeft: "-5%"}}>

                                        <Text style={[styles.texto_Descripcion, {fontSize: hpF("2.4%")}]}> 
                                            {humedad} 
                                        </Text>

                                    </View>

                                </View>

                                <View style={[styles.descripcion]}>

                                    <View style={{flex: 0.4, justifyContent: 'center', alignItems: "flex-end"}}>

                                        <Image source={require("../../assets/images/meteo/viento.png")} style={styles.icono_Peque} />

                                    </View>

                                    <View style={{flex: 0.6, justifyContent: 'center', alignItems: "center", marginLeft: "-5%"}}>

                                        <Text style={[styles.texto_Descripcion, {fontSize: hpF("2.4%")}]}> 
                                            {viento} 
                                        </Text>

                                    </View>

                                </View>

                            </View>
                            
                        </View>
                        <View style={[styles.hairline, {width: "7%", marginLeft: "9%"}]} />

                        <View style={styles.contenedor_Grafica}>

                            <VictoryChart 
                                width={wpF("95%")} 
                                height={hpF("33%")} 
                                maxDomain={{x: 5.3, y: 30}} 
                                minDomain={{x: 0.7, y: 0}} 
                                containerComponent={ 
                                    <VictoryZoomContainer 
                                        allowZoom={false}
                                        zoomDomain={{ x: [2, 7] }}
                                    /> 
                                }
                            >
                                <VictoryAxis
                                    style={{
                                        axis: {stroke: "white"},
                                        tickLabels: {
                                            stroke: "white", 
                                            fill: "white",
                                            fontSize: hpF("2.3%"), 
                                            fontFamily: "latoregular", 
                                            padding: 5
                                        }
                                    }}
                                />
                                <VictoryLine
                                    data={graficos}
                                    style={{
                                        data: { stroke: "white" },
                                        labels: { fontSize: hpF("2.2%"), fontFamily: "latoregular", fill: "white" }
                                    }}
                                    /* animate={{
                                        duration: 2000,
                                        onLoad: { duration: 1000 }
                                    }} */
                                    /* labels={({ datum }) => datum.y}
                                    labelComponent={ <Image source={require("../../assets/images/meteo/humedad.png")} /> }  */
                                    labels={({ datum }) => datum.y}
                                    labelComponent={ <VictoryLabel renderInPortal dy={-20}/> }
                                />
                            </VictoryChart>

                        </View>

                </ImageBackground>

                </View>

            </BoxShadow>
        
        );
    }
}