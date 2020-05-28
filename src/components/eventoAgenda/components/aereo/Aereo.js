import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
  } from 'react-native';

import { Meteorologia } from '../meteorologia/meteorologia';
import styles from "../../styles"

import { Overlay, Button } from 'react-native-elements';

export class Aereo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            url: "http://localhost:3000/DiccionarioLogos",
            dataClima: this.props.dataClima,
            diccionarioLogos: undefined,
            logoAero: "",
            isVisible: false
        }
    }

    async componentDidMount() {
        await this.getDiccionarioLogos()
    }

    getDiccionarioLogos(){
        return fetch(this.state.url)
        .then(res => res.json())
        .then(res => {
            this.setState({ diccionarioLogos: res })
            this.transformarImagen()
        })
        .catch(e => console.warn(e))
    }

    transformarImagen(){
        let codigoV = this.props.numVuelo;
        let compAerea = codigoV.split("-");
        console.log("Diccionario logos de transformar imagen: ", this.state.diccionarioLogos)
        
        if(this.state.diccionarioLogos.length > 0){
            for(let i = 0; i <= this.state.diccionarioLogos.length; i++){
                
                if(compAerea[0] == this.state.diccionarioLogos[i].iata){
                    
                    this.setState({
                        logoAero: this.state.diccionarioLogos[i].Logo
                    })
                }
            }
        }
    }

    toggleOverlay = () => {
        this.setState({isVisible: !this.state.isVisible});
    };

    render() {
        return (
            <View>

                <View style={styles.contenedor_Overlay}>

                    <View style={styles.contenedor_IdaVuelta}>
                        <View style={styles.logo}>
                            <Image style={styles.imagen} source={{ uri: this.state.logoAero }}></Image>
                        </View>

                        <View style={styles.ida_Vuelta}>

                            <View style={styles.ida}>

                                <View style={styles.contenedor_Icono_y_texto}>

                                    <FontAwesomeIcon icon={faPlaneDeparture} style={styles.iconos} size={hp("3.5%")} />
                                    <Text style={styles.texto_Titulo}>
                                        SALIDA
                                    </Text>

                                </View>
                                <View style={styles.hairline}></View>

                                <Text>
                                    {this.props.ciudadSalida} ({this.props.iataSalida})
                                </Text>

                                <Text>
                                    {moment(this.props.inicio).format("DD/MM/YYYY")} {"\n"}
                                    {moment(this.props.inicio).format("hh:mm")} aprox
                                </Text>

                            </View>

                            <View style={styles.vuelta}>

                                <View style={styles.contenedor_Icono_y_texto}>

                                    <FontAwesomeIcon icon={faPlaneDeparture} style={styles.iconos} size={hp("3.5%")} />
                                    <Text style={styles.texto_Titulo}>
                                        LLEGADA
                                    </Text>

                                </View>
                                <View style={styles.hairline}></View>

                                <Text>
                                    {this.props.ciudadLlegada} ({this.props.iataLlegada})
                                </Text>

                                <Text>
                                    {moment(this.props.fin).format("DD/MM/YYYY")} {"\n"}
                                    {moment(this.props.fin).format("hh:mm")} aprox
                                </Text>

                            </View>

                        </View>

                    </View>

                    <View style={styles.contenedor_Descripcion}>

                        <Text style={[styles.label_Descripcion, { marginTop: "5%" }]}>
                            Descripción del vuelo
                        </Text>
                        <View style={styles.hairline}></View>

                        <View style={styles.descripcion}>

                            <View style={styles.contenedor_Icono_y_texto}>

                                <FontAwesomeIcon icon={faSearchLocation} style={styles.iconos} size={hp("2.4%")} />
                                <Text style={styles.texto_Descripcion}>
                                    LOCALIZADOR RESERVA: {this.props.localizador}
                                </Text>

                            </View>

                            <View style={styles.contenedor_Icono_y_texto}>

                                <FontAwesomeIcon icon={faArrowCircleRight} style={styles.iconos} size={hp("2.4%")} />
                                <Text style={styles.texto_Descripcion}>
                                    Aerolínea: {this.props.linea}
                                </Text>

                            </View>

                            <View style={styles.contenedor_Icono_y_texto}>

                                <FontAwesomeIcon icon={faArrowCircleRight} style={styles.iconos} size={hp("2.4%")} />
                                <Text style={styles.texto_Descripcion}>
                                    Aeropuerto salida: {this.props.aeroSalida}
                                </Text>

                            </View>

                            <View style={styles.contenedor_Icono_y_texto}>

                                <FontAwesomeIcon icon={faArrowCircleRight} style={styles.iconos} size={hp("2.4%")} />
                                <Text style={styles.texto_Descripcion}>
                                    Aeropuerto llegada: {this.props.aeroLlegada}
                                </Text>

                            </View>

                            <View style={styles.contenedor_Icono_y_texto}>

                                <FontAwesomeIcon icon={faClock} style={styles.iconos} size={hp("2.4%")} />
                                <Text style={styles.texto_Descripcion}>
                                    Duración vuelo: {this.props.duracion}
                                </Text>

                            </View>

                            <Text style={styles.nota}>
                                NOTA: La hora mostrada corresponde a la hora local en cada país.
                            </Text>

                        </View>

                    </View>

                    <View style={[styles.contenedor_Botones, { marginTop: "-4%", marginBottom: "8%" }]}>

                        <View style={styles.contenedor_LabelInfo}>

                            <Text style={styles.label_Info}>
                                Información de interés
                            </Text>
                            <View style={styles.hairline}></View>

                        </View>

                        <View style={styles.botones_Principales}>

                            <Button
                                title="METEOROLOGÍA"
                                titleStyle={styles.texto_Boton}
                                buttonStyle={styles.boton_Principal}
                                type="solid"
                                onPress={() => {
                                    this.toggleMeteorologia();
                                }}
                            >
                            </Button>

                            <Overlay
                                isVisible={this.state.isVisibleMete}
                                onBackdropPress={this.toggleMeteorologia}
                                height="50%"
                                width="100%"
                            >
                                <Meteorologia
                                    dataClima={this.state.dataClima}
                                />

                            </Overlay>

                            <View style={styles.margen} />

                            <Button
                                title="INFORMACION ADICIONAL"
                                titleStyle={styles.texto_Boton}
                                buttonStyle={styles.boton_Principal}
                                type="solid"
                                onPress={() => this.toggleInfo()}
                            >
                            </Button>

                            <Overlay
                                isVisible={this.state.isVisibleInfo}
                                onBackdropPress={this.toggleInfo}
                                height="50%"
                                width="100%"
                            >

                            </Overlay>

                        </View>

                    </View>

                </View> 
                
            </View>
        );
    }
}