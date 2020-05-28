import { TouchableOpacity, FlatList } from 'react-native-gesture-handler';
import React, { Component } from 'react';

import {
  View,
  Text,
  Image,
} from 'react-native';
import styles from "./styles";
import coches from "../../assets/json/coches";
import proveedores from "../../assets/images/proveedores";
import info_meteoro from "../../assets/json/info_meteoro"

import { Overlay, Button } from 'react-native-elements';
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { 
    faCalendarAlt, 
    faMale, 
    faBed,

    faTrain, 
    faShip, 
    faHSquare, 
    faCar, 
    faPlaneDeparture,

    faGasPump,
    faClock, 
    faMapMarkerAlt, 
    faSearchLocation,
    faCloud, 
    faInfoCircle, 
    faUserFriends, 
    faArrowCircleRight,
    faHotel
} from '@fortawesome/free-solid-svg-icons';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Meteorologia } from '../meteorologia/meteorologia';


export class EventoAgenda extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state={
        url: "http://localhost:3000/DiccionarioLogos",

        api: {
            key: "68e00232337d8636e3cb77c1eb7aadbe",
            url: "https://api.openweathermap.org/data/2.5/forecast?"
        },

        dataClima: [],

        isVisible: false,
        isVisibleMete: false,
        isVisibleInfo: false,

        diccionarioLogos: [],
        logoAero: "",

        diaSemana: [],
        previsiones: [],
        dias: [],
        prevision: {
            icono: undefined,
            descripcion: undefined,
            diaSemana: undefined,
            tempMinima: undefined,
            tempMaxima: undefined,
            humedad: undefined
        },
        noClima: false,
        coches: coches,
        proveedores: proveedores,
        proveedor: ""
    }
  }

  toggleOverlay = () => {
    this.setState({isVisible: !this.state.isVisible});
  };

  toggleMeteorologia = () => {
    this.setState({isVisibleMete: !this.state.isVisibleMete});
  };

  toggleInfo = () => {
    this.setState({isVisibleInfo: !this.state.isVisibleInfo});
  };

  async componentDidMount(){
    // ! DEBUGGING aqui entra y getClima() funciona
    await this.getClima()
    
    await this.getDiccionarioLogos()
  }

  getClima() {
    console.log("FULL URL: " + this.state.api.url + "lat=" + this.props.latitudDestino + "&lon=" + this.props.longitudDestino + "&lang=es&units=metric&APPID="+ this.state.api.key)

    return fetch(this.state.api.url + "lat=" + this.props.latitudDestino + "&lon=" + this.props.longitudDestino + "&lang=es&units=metric&APPID="+ this.state.api.key)
    .then(res => res.json())
    .then(res => this.setState({ dataClima: res }) )
    .catch(e => console.warn(e))
  }

  getViajeros(){
      let viajeros = "";
      this.props.viajeros.forEach(viajero => {
          viajeros += viajero.Nombre + "; ";
      })

      if(viajeros != null && viajeros.length > 0 && viajeros.charAt(viajeros.length - 2) == ";"){
          viajeros = viajeros.substring(0, viajeros.length - 2);
      }
      return viajeros;
  }

  getDiccionarioLogos(){
    return fetch(this.state.url)
    .then(res => res.json())
    .then(res => {
        this.setState({ diccionarioLogos: res })
    })
    .catch(e => console.warn(e))
  }

  // ! DEBUGGING funciona
  transformarImagen(){
    if(this.props.tipo === "Aereo"){
        let codigoV = this.props.numVuelo;
        let compAerea = codigoV.split("-");
        
        if(this.state.diccionarioLogos.length > 0){

            for(let i = 0; i < this.state.diccionarioLogos.length; i++){

                if(compAerea[0] == this.state.diccionarioLogos[i].IATA){
                    this.setState({
                        logoAero: this.state.diccionarioLogos[i].Logo
                    })
                }
            }
        }
    }
  }

  obtenerClima(){
    //Con fechaInicioViaje y hoy calcularemos el rango de dias
    let fechaInicioViaje = this.props.inicio;

    let diasDif = this.diferenciaDiasClima(fechaInicioViaje);

    if( diasDif >= -5 && diasDif < 5 ){

        let listadoMediciones = [];

        this.state.dataClima.list.forEach((medicion) => {
            listadoMediciones.push(medicion.dt_txt.substring(0, 10));
        });

        let fechasUnicas = Array.from(new Set(listadoMediciones))
        let dias = [];
        let velocidadViento = [];
        let array_id_meteo = [];
        let previsiones = [];
        let horas_tiempo = [];

        //para cada grupo de fechas
        for(let i = 0; i < fechasUnicas.length; i++){
            //recorremos la lista de mediciones que devuelve la API
            for( let j = 0; j < this.state.dataClima.list.length; j++){
                //si la medicion corresponde a la fecha en la posicion i del array de fechas
                if(this.state.dataClima.list[j].dt_txt.substring(0, 10) === fechasUnicas[i]) {
                    dias.push(this.state.dataClima.list[j]);
                    velocidadViento.push(this.state.dataClima.list[j].wind.speed)
                }
            }
            console.log("Dias: ", dias)
            let temp_minima = 100
            let temp_maxima = -200
            let humedad = 0;
            let viento = 0;

            //recorremos los datos de las temperaturas máxima y mínima para las mediciones de un día concreto
            for (let k = 0; k < dias.length; k++) {
                if (temp_minima > dias[k].main.temp_min) {
                    temp_minima = dias[k].main.temp_min;
                }
                //comparación con this.la temperatura máxima establecida de referencia obtener finalmente la mayor de las máximas.
                if (temp_maxima < dias[k].main.temp_max) {
                    temp_maxima = dias[k].main.temp_max;
                }
                //sumatorio de las humedades para un día
                humedad += dias[k].main.humidity;
                viento += velocidadViento[k]

                //obtención del código identificador para la descripción del clima y la obtención del icono del diccionario de iconos (info_meteoro.js)
                let codClima = dias[k].weather[0].id; //802
                codClima = codClima.toString();
                let cod = codClima.charAt(0); //8
                
                //si el código comienza por 8 (serie de los 8xx)
                //se cambia por un 1 para que corresponda con los códigos de nuestro diccionario, 
                //para tener en cuenta la gravedad posteriormente (100 es menos grave que 600, p.e.)
                if (cod === '8') {
                    codClima = codClima.replace('8', '1');
                }

                let intId = parseInt(codClima);
                array_id_meteo.push(intId); //construye un array (para cada día) con los id asociados a los iconos/descripción para ese día
            }

            let maximo = Math.max.apply(null, array_id_meteo); //obtencion del máximo en el array de códigos (para cada día)
            //para obtener las condiciones más graves para colocar posteriormente el icono

            let descripcion = "";
            let icono_meteo = "";

            let prevision = {
                icono: undefined,
                descripcion: undefined,
                diaSemana: undefined,
                tempMinima: undefined,
                tempMaxima: undefined,
                humedad: undefined,
                viento: undefined
            }

            //recorrer el diccionario de descripciones de fenómenos metereológicos.
            info_meteoro.forEach((medicion) => {
                //cuando el código de identificación de las condiciones meteo coincida con el máximo obtenido
                if (medicion.id == maximo) {
                    //sacar los datos y la imagen para mostrar en el panel
                    descripcion = medicion.descripcion;
                    icono_meteo = medicion.icono;
                    let dia = new Date(fechasUnicas[i])
                    let diaFormateado = moment(dia).format("YYYY-MM-DD")

                    prevision = {
                        icono: icono_meteo,
                        descripcion: descripcion,
                        diaSemana: diaFormateado,
                        tempMinima: temp_minima.toFixed(1),
                        tempMaxima: temp_maxima.toFixed(1),
                        humedad: (humedad / dias.length).toFixed(2),
                        viento: (viento / velocidadViento.length).toFixed(2),
                    };
                    
                    previsiones.push(prevision);
                }

                if (icono_meteo === null || icono_meteo === "" || icono_meteo === 'undefined') { // Si la previsión corresponde a los grupos sin icono 90x , 9xx
                    icono_meteo = 'Consultia'; //aparecerá el logo de consultia o cualquier otra imagen que se establezca como genérica.
                }
            });
            
        }
        // Para cada objeto del array previsiones, creamos la propiedad horas que sera un array vacio
        previsiones.forEach(elem => {
            elem.horas = []
        })
        
        let contador = 0;
        for (let dia of dias) {
            if (dia.dt_txt.substring(0, 10) != previsiones[contador].diaSemana) {
                contador++;
                if (contador > fechasUnicas.length) {
                    console.log("me rompo")
                    break
                }
            }

            if (dia.dt_txt.substring(0, 10) == previsiones[contador].diaSemana) {
                // Agregamos las horas y las temperaturas del dia "contador"
                previsiones[contador].horas.push({
                    hora: dia.dt_txt,
                    temp: dia.main.temp
                })
            }
        }
        this.setState({ previsiones: previsiones })
        
    } else{
        setTimeout(() => {
            this.setState({
                noClima: false,
            })
        }, 4000);

        this.setState({
            noClima: true,
        })

        console.log("No esta dentro de los 3 dias")
    }
  }

    diferenciaDiasClima(inicioViaje){
        //con esto obtenemos la fecha de hoy en milisegundos
        const hoy = new Date();
        const ms_hoy = hoy.getTime();

        //con esto obtenemos la fecha de inicio del viaje en milisegundos
        const inicio = new Date(inicioViaje);
        const ms_inicio = inicio.getTime();

        const timeDifference = ms_inicio - ms_hoy;
        const timeDifferenceInHours = timeDifference / 3600000;
        const timeDifferenceInDays = timeDifferenceInHours / 24;

        return timeDifferenceInDays;
    }
  
  render() {

    if(this.props.tipo === "Aereo"){
        let asunto = this.props.texto;
        let sinNumeros = asunto.replace(/[0-9]/g, "");
        let sinEspeciales = sinNumeros.replace(/[:]/g, "");
        let sinFlecha = sinEspeciales.replace("-- >", "a")
        let texto = sinFlecha.trim();

        return (
            <View style={styles.contenedor_Principal}>

                <TouchableOpacity style={styles.contenedor_Evento}
                    onPress={() => {
                        this.transformarImagen()
                        this.toggleOverlay()
                    }}
                >
                    <View style={styles.contenedor_Evento_Titulo}>

                        <View style={{flex: 0.85}}>
                            <Text numberOfLines={1} style={styles.texto_Evento_Titulo}>
                                {texto}.
                            </Text> 
                        </View>
                    
                        <View style={{flex: 0.15, alignItems: "center"}}>
                            <FontAwesomeIcon icon={faPlaneDeparture} style={styles.icono_Evento} size={hp("5.5%")} />
                        </View>
                        
                    </View>

                    <View style={styles.contenedor_Evento_Descripcion}>

                        <Text style={styles.texto_Evento_Descripcion}>
                            Viaje en avion
                        </Text>

                        <View style={[styles.contenedor_Icono_y_texto, {marginTop: "1%"}]}>

                            <FontAwesomeIcon icon={faMapMarkerAlt} style={{color: "grey", marginRight: "2%"}} size={hp("2.5%")} />
                            <Text numberOfLines={1} style={[styles.texto_Evento_Descripcion, {paddingRight: "15%"}]}>
                                {this.props.aeroSalida == "" || this.props.aeroSalida == " " ? "La ubicacion no se encuentra disponible" : this.props.aeroSalida}
                            </Text>
                        </View>
                
                    </View>

                    <View style={styles.contenedor_Evento_Ubicacion}>

                        <View style={styles.contenedor_Evento_Icono_y_texto}>

                            <FontAwesomeIcon icon={faCalendarAlt} style={{color: "grey", marginRight: "4%"}} size={hp("2.5%")} />
                            <Text style={styles.texto_Evento_Descripcion}> 
                                {moment(this.props.inicio).format("DD MMMM YYYY")}
                            </Text>

                        </View>
                        
                        <View style={styles.contenedor_Evento_Icono_y_texto}>

                            <FontAwesomeIcon icon={faClock} style={{color: "grey", marginRight: "4%"}} size={hp("2.5%")} />
                            <Text style={styles.texto_Evento_Descripcion}> 
                                {moment(this.props.inicio).format("HH : mm")}
                            </Text>
                            
                        </View>
                        
                    </View>

                </TouchableOpacity>

                <View style={styles.contenedor_Overlay}>

                    <Overlay
                        isVisible={this.state.isVisible}
                        onBackdropPress={this.toggleOverlay}
                        height="82%"
                        width= "95%"
                    >
                        <View style={styles.contenedor_IdaVuelta}>
                            <View style={styles.logo}>
                                <Image style={styles.imagen} source={{uri: this.state.logoAero}}></Image>
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

                                    <Text style={styles.texto_Titulo_Descripcion}>
                                        {this.props.ciudadSalida} ({this.props.iataSalida})
                                    </Text>

                                    <Text style={styles.texto_Titulo_Descripcion}>
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

                                    <Text style={styles.texto_Titulo_Descripcion}>
                                        {this.props.ciudadLlegada} ({this.props.iataLlegada})
                                    </Text>

                                    <Text style={styles.texto_Titulo_Descripcion}>
                                        {moment(this.props.fin).format("DD/MM/YYYY")} {"\n"}
                                        {moment(this.props.fin).format("hh:mm")} aprox
                                    </Text>

                                </View>

                            </View>
                        </View>

                        <View style={styles.contenedor_Descripcion}>

                            <Text style={[styles.label_Descripcion, {marginTop: "5%"}]}>
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

                        <View style={[styles.contenedor_Botones, {marginTop: "2%", marginBottom: "8%"}]}>

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
                                        this.obtenerClima();
                                        this.toggleMeteorologia();
                                    }}
                                >
                                </Button>

                                <Overlay
                                    isVisible={this.state.isVisibleMete}
                                    onBackdropPress={this.toggleMeteorologia}
                                    fullScreen={true}
                                >
                                    <Meteorologia
                                        previsiones={this.state.previsiones}
                                        ubicacion={this.props.ciudadLlegada}
                                    />

                                </Overlay>

                                <View style={styles.margen}/>

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
                                    width= "100%"
                                >
                                    
                                </Overlay>

                            </View>

                        </View>

                    </Overlay>

                </View> 

            </View>
        );
    }

    if(this.props.tipo === "Coche"){

        const proveedores = {
            Avis: require("../../assets/images/proveedores/Avis_logo.png"),
            Atesa: require("../../assets/images/proveedores/atesa_logo.png"),
            Hertz: require("../../assets/images/proveedores/hertz.png"),
            Europcar: require("../../assets/images/proveedores/Europcar.png"),
            SixtRentaCar: require("../../assets/images/proveedores/sixt.png"),
            AutosXoroi: require("../../assets/images/proveedores/alquiler_de_coches.png"),
            Drivania: require("../../assets/images/proveedores/drivania.png"),
            CentauroRentaCar: require("../../assets/images/proveedores/centauro.png"),
            GT1Rent: require("../../assets/images/proveedores/alquiler_de_coches.png"),
            AsionTravel: require("../../assets/images/proveedores/alquiler_de_coches.png"),
            Click: require("../../assets/images/proveedores/alquiler_de_coches.png"),
            LaSavinaCarsMotors: require("../../assets/images/proveedores/alquiler_de_coches.png"),
            OneCarsValencia: require("../../assets/images/proveedores/alquiler_de_coches.png"),
            FlexibleAutos: require("../../assets/images/proveedores/alquiler_de_coches.png"),
            AutoArandino: require("../../assets/images/proveedores/alquiler_de_coches.png"),
            Rentikar: require("../../assets/images/proveedores/alquiler_de_coches.png"),
            Transferextra: require("../../assets/images/proveedores/alquiler_de_coches.png"),
            SCMelaniaRentaCar: require("../../assets/images/proveedores/alquiler_de_coches.png"),
            GoldcarSpain: require("../../assets/images/proveedores/alquiler_de_coches.png"),
            Telefurgo: require("../../assets/images/proveedores/alquiler_de_coches.png") 
        }
    
        const codigoRent = this.props.idProveedor;
        let proveedor = "";
    
        this.state.coches.forEach((agencia) => {
            if(parseInt(agencia.id) == parseInt(codigoRent)) {
                proveedor = agencia.proveedor
            }
        });

        let asunto = this.props.texto;
        let sinNumeros = asunto.replace(/[0-9]/g, "");
        let sinEspeciales = sinNumeros.replace(/[:]/g, "");
        let sinFlecha = sinEspeciales.replace("-->", "a")
        let texto = sinFlecha.trim();

        return(
            <View style={styles.contenedor_Principal}>

                <TouchableOpacity style={styles.contenedor_Evento}
                    onPress={() => this.toggleOverlay()}
                >
                    <View style={styles.contenedor_Evento_Titulo}>
                        <View style={{flex: 0.85}}>
                            <Text numberOfLines={1} style={styles.texto_Evento_Titulo}>
                                {texto}.
                            </Text> 
                        </View>
                    
                        <View style={{flex: 0.15, alignItems: "center"}}>
                            <FontAwesomeIcon icon={faCar} style={styles.icono_Evento} size={hp("5.5%")} />
                        </View>
                        
                    </View>

                    <View style={styles.contenedor_Evento_Descripcion}>

                        <Text style={styles.texto_Evento_Descripcion}>
                            Viaje en coche
                        </Text>

                        <View style={[styles.contenedor_Icono_y_texto, {marginTop: "1%"}]}>

                            <FontAwesomeIcon icon={faMapMarkerAlt} style={{color: "grey", marginRight: "2%"}} size={hp("2.5%")} />
                            <Text numberOfLines={1} style={[styles.texto_Evento_Descripcion, {paddingRight: "15%"}]}>
                                {this.props.recogida == "" || this.props.recogida == " " ? "La ubicacion no se encuentra disponible" : this.props.recogida}
                            </Text>
                        </View>
                
                    </View>

                    <View style={styles.contenedor_Evento_Ubicacion}>

                        <View style={styles.contenedor_Evento_Icono_y_texto}>

                            <FontAwesomeIcon icon={faCalendarAlt} style={{color: "grey", marginRight: "4%"}} size={hp("2.5%")} />
                            <Text style={styles.texto_Evento_Descripcion}> 
                                {moment(this.props.inicio).format("DD MMMM YYYY")}
                            </Text>

                        </View>
                        
                        <View style={styles.contenedor_Evento_Icono_y_texto}>

                            <FontAwesomeIcon icon={faClock} style={{color: "grey", marginRight: "4%"}} size={hp("2.5%")} />
                            <Text style={styles.texto_Evento_Descripcion}> 
                                {moment(this.props.inicio).format("HH : mm")}
                            </Text>
                            
                        </View>
                        
                    </View>

                </TouchableOpacity>

                <View style={styles.contenedor_Overlay}>

                    <Overlay
                        isVisible={this.state.isVisible}
                        onBackdropPress={this.toggleOverlay}
                        height="82%"
                        width= "95%"
                    >
                        <View style={styles.contenedor_IdaVuelta}>
                            <View style={styles.logo}>
                                <Image style={styles.imagen} source={proveedores[proveedor]} />
                            </View>

                            <View style={styles.ida_Vuelta}>

                                <View style={styles.ida}>

                                    <View style={styles.contenedor_Icono_y_texto}>
                                        
                                        <FontAwesomeIcon icon={faCar} style={styles.iconos} size={hp("3.5%")} />
                                        <Text style={styles.texto_Titulo}>
                                            RECOGIDA
                                        </Text>

                                    </View>
                                    <View style={styles.hairline}></View>

                                    <Text style={styles.texto_Titulo_Descripcion}>
                                        {moment(this.props.inicio).format("DD/MM/YYYY")} {"\n"}
                                        {moment(this.props.inicio).format("hh:mm")} aprox.
                                    </Text>

                                </View>

                                <View style={styles.vuelta}>

                                    <View style={styles.contenedor_Icono_y_texto}>
                                        
                                        <FontAwesomeIcon icon={faCar} style={styles.iconos} size={hp("3.5%")} />
                                        <Text style={styles.texto_Titulo}>
                                            ENTREGA
                                        </Text>

                                    </View>
                                    <View style={styles.hairline}></View>

                                    <Text style={styles.texto_Titulo_Descripcion}>
                                        {moment(this.props.fin).format("DD/MM/YYYY")} {"\n"}
                                        {moment(this.props.fin).format("hh:mm")} aprox.
                                    </Text>

                                </View>

                            </View>
                        </View>

                        <View style={styles.contenedor_Descripcion}>

                            <Text style={styles.label_Descripcion}>
                                Descripción
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
                                        Proveedor: {this.props.proveedor}
                                    </Text>

                                </View>
                                

                                <View style={styles.contenedor_Icono_y_texto}>
                                        
                                    <FontAwesomeIcon icon={faArrowCircleRight} style={styles.iconos} size={hp("2.4%")} />
                                    <Text style={styles.texto_Descripcion}>
                                        Categoría: {this.props.categoriaCoche}
                                    </Text>

                                </View>
                                

                                <View style={styles.contenedor_Icono_y_texto}>
                                        
                                    <FontAwesomeIcon icon={faArrowCircleRight} style={styles.iconos} size={hp("2.4%")} />
                                    <Text style={styles.texto_Descripcion}>
                                        Transmisión: {this.props.transmision}
                                    </Text>

                                </View>
                                

                                <View style={styles.contenedor_Icono_y_texto}>
                                        
                                    <FontAwesomeIcon icon={faGasPump} style={styles.iconos} size={hp("2.4%")} />
                                    <Text style={styles.texto_Descripcion}>
                                        Combustible: {this.props.combustible}
                                    </Text>

                                </View>
                                

                                <View style={styles.contenedor_Icono_y_texto}>
                                        
                                    <FontAwesomeIcon icon={faSearchLocation} style={styles.iconos} size={hp("2.4%")} />
                                    <Text style={styles.texto_Descripcion}>
                                        Dirección recogida: {this.props.recogida}
                                    </Text>

                                </View>
                                

                                <View style={styles.contenedor_Icono_y_texto}>
                                        
                                    <FontAwesomeIcon icon={faSearchLocation} style={styles.iconos} size={hp("2.4%")} />
                                    <Text style={styles.texto_Descripcion}>
                                        Dirección entrega: {this.props.entrega}
                                    </Text>

                                </View>
                                
                                
                                <View style={styles.contenedor_Icono_y_texto}>
                                        
                                    <FontAwesomeIcon icon={faUserFriends} style={styles.iconos} size={hp("2.4%")} />          
                                    <Text style={styles.texto_Descripcion}>
                                        Acompañantes: { this.getViajeros() }
                                    </Text>

                                </View>     
                                  
                                <Text style={[styles.nota, {marginBottom: "2%"}]}>
                                    NOTA: La hora mostrada corresponde a la hora local en cada país.
                                </Text>

                            </View>

                        </View>

                        <View style={styles.contenedor_Botones}>

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
                                        this.obtenerClima();
                                        this.toggleMeteorologia();
                                    }}
                                >
                                </Button>

                                <Overlay
                                    isVisible={this.state.isVisibleMete}
                                    onBackdropPress={this.toggleMeteorologia}
                                    fullScreen={true}
                                >
                                    <View style={styles.contenedor_FlatlistMeteorologia}>

                                        <Meteorologia 
                                            ubicacion={this.props.direccionDestino}
                                            previsiones={this.state.previsiones}
                                        />

                                    </View>

                                </Overlay>

                                <View style={styles.margen}/>

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
                                    width= "100%"
                                >
                                    
                                </Overlay>

                            </View>

                        </View>

                    </Overlay>

                </View> 

            </View>
        );
    }

    if(this.props.tipo === "Hotel"){
        return (
        <View style={styles.contenedor_Principal}>

            <TouchableOpacity style={styles.contenedor_Evento}
                onPress={() => this.toggleOverlay()}
            >
                <View style={styles.contenedor_Evento_Titulo}>

                    <View style={{flex: 0.85}}>
                        <Text numberOfLines={1} style={styles.texto_Evento_Titulo}>
                            {this.props.texto}.
                        </Text> 
                    </View>
                    
                    <View style={{flex: 0.15, alignItems: "center"}}>
                        <FontAwesomeIcon icon={faHotel} style={styles.icono_Evento} size={hp("5.5%")} />
                    </View>
                    
                </View>

                <View style={styles.contenedor_Evento_Descripcion}>

                    <Text style={styles.texto_Evento_Descripcion}>
                        Reserva de hotel
                    </Text>

                    <View style={[styles.contenedor_Icono_y_texto, {marginTop: "1%"}]}>

                        <FontAwesomeIcon icon={faMapMarkerAlt} style={{color: "grey", marginRight: "2%"}} size={hp("2.5%")} />
                        <Text style={styles.texto_Evento_Descripcion}>
                            {this.props.ubicacion}
                        </Text>
                    </View>
                
                </View>

                <View style={styles.contenedor_Evento_Ubicacion}>

                    <View style={styles.contenedor_Evento_Icono_y_texto}>

                        <FontAwesomeIcon icon={faCalendarAlt} style={{color: "grey", marginRight: "4%"}} size={hp("2.5%")} />
                        <Text style={styles.texto_Evento_Descripcion}> 
                            {moment(this.props.inicio).format("DD MMMM YYYY")}
                        </Text>

                    </View>
                    
                    <View style={styles.contenedor_Evento_Icono_y_texto}>

                        <FontAwesomeIcon icon={faClock} style={{color: "grey", marginRight: "4%"}} size={hp("2.5%")} />
                        <Text style={styles.texto_Evento_Descripcion}> 
                            {moment(this.props.inicio).format("HH : mm")}
                        </Text>
                        
                    </View>
                    
                </View>

            </TouchableOpacity>

            <View>

                <Overlay 
                    isVisible={this.state.isVisible}
                    onBackdropPress={this.toggleOverlay}
                    height="82%"
                    width= "95%"
                >

                    <View style={[styles.contenedor_IdaVuelta, {flex: 0.5, flexDirection: "row", alignItems: "center", justifyContent: "space-around"}]}>

                        <View style={styles.ida}>

                            <View style={styles.contenedor_Icono_y_texto}>
                                <FontAwesomeIcon icon={faCalendarAlt} style={styles.iconos} size={hp("3.5%")} />
                                <Text style={styles.texto_Titulo}>
                                    ENTRADA
                                </Text>
                            </View>
                            
                            <View style={[styles.hairline, {marginVertical: "5%"}]}></View>

                            <Text style={styles.texto_Titulo_Descripcion}>
                                {moment(this.props.inicio).format("DD/MM/YYYY")} {"\n"}
                                {moment(this.props.inicio).format("hh:mm")} aprox.
                            </Text>

                        </View>

                        <View style={styles.vuelta}>

                            <View style={styles.contenedor_Icono_y_texto}>
                                <FontAwesomeIcon icon={faCalendarAlt} style={styles.iconos} size={hp("3.5%")} />
                                <Text style={styles.texto_Titulo}>
                                    SALIDA
                                </Text>
                            </View>
                            
                            <View style={[styles.hairline, {marginVertical: "5%"}]}></View>

                            <Text style={styles.texto_Titulo_Descripcion}>
                                {moment(this.props.fin).format("DD/MM/YYYY")} {"\n"}
                                {moment(this.props.fin).format("hh:mm")} aprox.
                            </Text>

                        </View>

                    </View>

                    <View style={styles.contenedor_Descripcion}>

                        <Text style={styles.label_Descripcion}>
                            Descripción
                        </Text>
                        <View style={styles.hairline}></View>
                        
                        <View style={styles.descripcion}>

                            <View style={styles.contenedor_Icono_y_texto}>
                                <FontAwesomeIcon icon={faSearchLocation} size={17} style={[styles.iconos, {marginRight: "1%", marginTop: "0%"}]} />
                                <Text style={styles.texto_Descripcion}>
                                    LOCALIZADOR RESERVA: {this.props.localizador}
                                </Text>
                            </View>
                            
                            <View style={styles.contenedor_Icono_y_texto}>
                                <FontAwesomeIcon icon={faHSquare} size={17} style={[styles.iconos, {marginRight: "1%", marginTop: "0%"}]} />
                                <Text style={styles.texto_Descripcion}>
                                    Hotel: {this.props.hotel}
                                </Text>
                            </View>

                            <View style={styles.contenedor_Icono_y_texto}>
                                <FontAwesomeIcon icon={faMapMarkerAlt} size={17} style={[styles.iconos, {marginRight: "1%", marginTop: "0%"}]} />
                                <Text style={styles.texto_Descripcion}>
                                    Dirección: {this.props.direccion}
                                </Text>
                            </View>

                            <View style={styles.contenedor_Icono_y_texto}>

                                <FontAwesomeIcon icon={faBed} size={17} style={[styles.iconos, {marginRight: "1%", marginTop: "0%"}]} />
                                <Text style={styles.texto_Descripcion}>
                                    Régimen: {this.props.regimen}
                                </Text>

                            </View>
                            
                            <View style={styles.contenedor_Icono_y_texto}>
                                <FontAwesomeIcon icon={faMale} size={17} style={[styles.iconos, {marginRight: "1%", marginTop: "0%"}]} />
                                <Text style={styles.texto_Descripcion}>
                                    Tipo habitación: {this.props.habitacion}
                                </Text>
                            </View>

                            <View style={styles.contenedor_Icono_y_texto}>

                                <FontAwesomeIcon icon={faUserFriends} size={17} style={[styles.iconos, {marginRight: "1%", marginTop: "0%"}]} />
                                <Text style={styles.texto_Descripcion}>
                                    {this.props.viajeros.length > 1 ? <Text>Acompañantes({this.props.viajeros.length}): {this.getViajeros()}</Text> : <Text>Acompañante(1): {this.getViajeros()}</Text> }
                                </Text>

                            </View>
                                
                            <Text style={[styles.nota, {marginBottom: "4%"}]}>
                                NOTA: La hora mostrada corresponde a la hora local en cada país.
                            </Text>

                        </View>

                    </View>

                    <View style={[styles.contenedor_Botones, {marginBottom: "5%"}]}>

                        <View style={styles.contenedor_LabelInfo}>

                            <Text style={styles.label_Info}>
                                Información de interés
                            </Text>
                            <View style={[styles.hairline, {marginVertical: "2%"}]}></View>

                        </View>
                        
                        <View style={styles.botones_Principales}>

                            <View style={[styles.contenedor_Icono_y_texto, {marginTop: "-2%"}]}>
                                {/* <FontAwesomeIcon icon={faCloud} color={ 'red' } /> */}
                                <Button
                                    title="METEOROLOGÍA"
                                    titleStyle={styles.texto_Boton}
                                    buttonStyle={styles.boton_Principal}
                                    type="solid"
                                    onPress={() => {
                                        this.obtenerClima();
                                        this.toggleMeteorologia();
                                    }}
                                />
                            </View>

                            <Overlay
                                isVisible={this.state.isVisibleMete}
                                onBackdropPress={this.toggleMeteorologia}
                                fullScreen={true}
                            >

                                <Meteorologia 
                                    ubicacion={this.props.direccion}
                                    previsiones={this.state.previsiones}
                                />

                            </Overlay>

                            <View style={styles.margen}/>
                            <View style={styles.contenedor_Icono_y_texto}>

                                {/* <FontAwesomeIcon icon={faCloud} color={ 'red' } /> */}
                                <Button
                                    title="INFORMACION ADICIONAL"
                                    titleStyle={styles.texto_Boton}
                                    buttonStyle={styles.boton_Principal}
                                    type="solid"
                                    onPress={() => this.toggleInfo()}
                                />

                            </View>

                            <Overlay
                                isVisible={this.state.isVisibleInfo}
                                onBackdropPress={this.toggleInfo}
                                height="50%"
                                width= "100%"
                            >
                                
                            </Overlay>

                        </View>

                    </View>

                </Overlay>

            </View>

        </View>
        )
    }

    if(this.props.tipo === "Barco"){

        let proveedor;

        switch(this.props.proveedor){
            case "Balearia":
                proveedor = require("../../assets/images/proveedores/balearia.png")
                break;

            case 'Transmediterranea':
                proveedor = require("../../assets/images/proveedores/trasmediterranea.png");
                break;

            default:
                proveedor = require('../../assets/images/proveedores/logo_crucero_generico.png');
                break;
        }

        let asunto = this.props.texto;
        let sinNumeros = asunto.replace(/[0-9]/g, "");
        let sinEspeciales = sinNumeros.replace(/[:]/g, "");
        let sinFlecha = sinEspeciales.replace("-->", "a")
        let texto = sinFlecha.trim();

        return (
        <View style={styles.contenedor_Principal}>

            <TouchableOpacity style={styles.contenedor_Evento}
                onPress={() => this.toggleOverlay()}
            >
                <View style={styles.contenedor_Evento_Titulo}>

                    <View style={{flex: 0.85}}>
                        <Text numberOfLines={1} style={styles.texto_Evento_Titulo}>
                            {texto}.
                        </Text> 

                    </View>
                
                    <View style={{flex: 0.15, alignItems: "center"}}>
                        <FontAwesomeIcon icon={faShip} style={styles.icono_Evento} size={hp("5.5%")} />
                    </View>
                    
                </View>

                <View style={styles.contenedor_Evento_Descripcion}>

                    <Text style={styles.texto_Evento_Descripcion}>
                        Viaje en barco
                    </Text>

                    <View style={[styles.contenedor_Icono_y_texto, {marginTop: "1%"}]}>

                        <FontAwesomeIcon icon={faMapMarkerAlt} style={{color: "grey", marginRight: "2%"}} size={hp("2.5%")} />
                        <Text numberOfLines={1} style={[styles.texto_Evento_Descripcion, {paddingRight: "15%"}]}>
                            {this.props.direccionOrigen == "" || this.props.direccionOrigen == " " ? "La ubicacion no se encuentra disponible" : this.props.direccionOrigen}
                        </Text>

                    </View>
            
                </View>

                <View style={styles.contenedor_Evento_Ubicacion}>

                    <View style={styles.contenedor_Evento_Icono_y_texto}>

                        <FontAwesomeIcon icon={faCalendarAlt} style={{color: "grey", marginRight: "4%"}} size={hp("2.5%")} />
                        <Text style={styles.texto_Evento_Descripcion}> 
                            {moment(this.props.inicio).format("DD MMMM YYYY")}
                        </Text>

                    </View>
                    
                    <View style={styles.contenedor_Evento_Icono_y_texto}>

                        <FontAwesomeIcon icon={faClock} style={{color: "grey", marginRight: "4%"}} size={hp("2.5%")} />
                        <Text style={styles.texto_Evento_Descripcion}> 
                            {moment(this.props.inicio).format("HH : mm")}
                        </Text>
                        
                    </View>
                    
                </View>

            </TouchableOpacity>

            <View style={styles.contenedor_Overlay}>

                <Overlay 
                    isVisible={this.state.isVisible}
                    onBackdropPress={this.toggleOverlay}
                    height="82%"
                    width= "95%"
                >

                    <View style={styles.contenedor_IdaVuelta}>
                        <View style={styles.logo}>
                            <Image style={[styles.imagen, {width: "50%"}]} source={proveedor} />
                        </View>

                        <View style={styles.ida_Vuelta}>

                            <View style={styles.ida}>

                                <View style={styles.contenedor_Icono_y_texto}>

                                    <FontAwesomeIcon icon={faShip} style={styles.iconos} size={hp("3.5%")} />
                                    <Text style={styles.texto_Titulo}>
                                        SALIDA
                                    </Text>

                                </View>
                                <View style={styles.hairline}></View>

                                <Text style={[styles.texto_Titulo_Descripcion, {textAlign: "center"}]}>
                                    {this.props.salida} {"\n"}
                                    {moment(this.props.inicio).format("DD/MM/YYYY")} {"\n"}
                                    {moment(this.props.inicio).format("hh:mm")} aprox.
                                </Text>

                            </View>

                            <View style={styles.vuelta}>

                                <View style={styles.contenedor_Icono_y_texto}>

                                    <FontAwesomeIcon icon={faShip} style={styles.iconos} size={hp("3.5%")} />
                                    <Text style={styles.texto_Titulo}>
                                        LLEGADA
                                    </Text>

                                </View>
                                <View style={styles.hairline}></View>

                                <Text style={[styles.texto_Titulo_Descripcion, {textAlign: "center"}]}>
                                    {this.props.llegada} {"\n"}
                                    {moment(this.props.fin).format("DD/MM/YYYY")} {"\n"}
                                    {moment(this.props.fin).format("hh:mm")} aprox.
                                </Text>

                            </View>

                        </View>
                    </View>

                    <View style={[styles.contenedor_Descripcion, {marginTop: "4%"}]}>

                        <Text style={styles.label_Descripcion}>
                            Descripción
                        </Text>
                        <View style={styles.hairline}></View>
                        
                        <View style={styles.descripcion}>

                            <View style={styles.contenedor_Icono_y_texto}>

                                <FontAwesomeIcon icon={faSearchLocation} size={17} style={[styles.iconos, {marginRight: "1%", marginTop: "0%"}]} />
                                <Text style={styles.texto_Descripcion}>
                                    LOCALIZADOR RESERVA: {this.props.localizador}
                                </Text>

                            </View>
                            
                            <View style={styles.contenedor_Icono_y_texto}>

                                <FontAwesomeIcon icon={faArrowCircleRight} size={17} style={[styles.iconos, {marginRight: "1%", marginTop: "0%"}]} />
                                <Text style={styles.texto_Descripcion}>
                                    Acomodación: {this.props.acomodacion}
                                </Text>

                            </View>

                            <View style={styles.contenedor_Icono_y_texto}>

                                <FontAwesomeIcon icon={faArrowCircleRight} size={17} style={[styles.iconos, {marginRight: "1%", marginTop: "0%"}]} />
                                <Text style={styles.texto_Descripcion}>
                                    Proveedor de coches: {this.props.proveedor}
                                </Text>

                            </View>

                            <View style={styles.contenedor_Icono_y_texto}>

                                <FontAwesomeIcon icon={faMapMarkerAlt} size={17} style={[styles.iconos, {marginRight: "1%", marginTop: "0%"}]} />
                                <Text style={styles.texto_Descripcion}>
                                    Dirección origen: {this.props.salida}
                                </Text>

                            </View>
                            
                            <View style={styles.contenedor_Icono_y_texto}>

                                <FontAwesomeIcon icon={faMapMarkerAlt} size={17} style={[styles.iconos, {marginRight: "1%", marginTop: "0%"}]} />
                                <Text style={styles.texto_Descripcion}>
                                    Dirección destino: {this.props.llegada}
                                </Text>

                            </View>
                            
                            <View style={styles.contenedor_Icono_y_texto}>

                                <FontAwesomeIcon icon={faArrowCircleRight} size={17} style={[styles.iconos, {marginRight: "1%", marginTop: "0%"}]} />
                                <Text style={styles.texto_Descripcion}>
                                    {this.props.vehiculos == null ? <Text>Vehículos(0): Sin Vehículos</Text> : <Text>Vehículos({this.props.vehiculos.length})</Text>}
                                </Text>

                            </View>

                            <View style={styles.contenedor_Icono_y_texto}>

                                <FontAwesomeIcon icon={faUserFriends} size={17} style={[styles.iconos, {marginRight: "1%", marginTop: "0%"}]} />
                                <Text style={styles.texto_Descripcion}>
                                    Acompañantes: {this.getViajeros()}
                                </Text>

                            </View>

                            <Text style={[styles.nota, {marginBottom: "2%"}]}>
                                NOTA: La hora mostrada corresponde a la hora local en cada país.
                            </Text>

                        </View>

                    </View>

                    <View style={[styles.contenedor_Botones, {marginBottom: "7%"}]}>

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
                                    this.obtenerClima();
                                    this.toggleMeteorologia();
                                }}
                            >
                            </Button>

                            <Overlay
                                isVisible={this.state.isVisibleMete}
                                onBackdropPress={this.toggleMeteorologia}
                                fullScreen={true}
                            >
                                <View style={styles.contenedor_FlatlistMeteorologia}>

                                    <Meteorologia 
                                        ubicacion={this.props.llegada}
                                        previsiones={this.state.previsiones}
                                    />

                                </View>

                            </Overlay>

                            <View style={styles.margen}/>

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
                                width= "100%"
                            >
                                
                            </Overlay>

                        </View>

                    </View>

                </Overlay>

            </View>

        </View>
        )
    }

    if(this.props.tipo === "Tren"){
        let asunto = this.props.texto;
        let sinNumeros = asunto.replace(/[0-9]/g, "");
        let sinEspeciales = sinNumeros.replace(/[:]/g, "");
        let sinFlecha = sinEspeciales.replace("-->", "a")
        let texto = sinFlecha.trim();

        return (
            <View style={styles.contenedor_Principal}>

                <TouchableOpacity style={styles.contenedor_Evento}
                    onPress={() => this.toggleOverlay()}
                >
                    <View style={styles.contenedor_Evento_Titulo}>
                        <View style={{flex: 0.85}}>
                            <Text numberOfLines={1} style={styles.texto_Evento_Titulo}>
                                {texto}.
                            </Text> 
                        </View>
                    
                        <View style={{flex: 0.15, alignItems: "center"}}>
                            <FontAwesomeIcon icon={faTrain} style={styles.icono_Evento} size={hp("5.5%")} />
                        </View>
                        
                    </View>

                    <View style={styles.contenedor_Evento_Descripcion}>

                        <Text style={styles.texto_Evento_Descripcion}>
                            Viaje en tren
                        </Text>

                        <View style={[styles.contenedor_Icono_y_texto, {marginTop: "1%"}]}>

                            <FontAwesomeIcon icon={faMapMarkerAlt} style={{color: "grey", marginRight: "2%"}} size={hp("2.5%")} />
                            <Text numberOfLines={1} style={[styles.texto_Evento_Descripcion, {paddingRight: "15%"}]}>
                                {this.props.direccionOrigen}
                            </Text>
                        </View>
                
                    </View>

                    <View style={styles.contenedor_Evento_Ubicacion}>

                        <View style={styles.contenedor_Evento_Icono_y_texto}>

                            <FontAwesomeIcon icon={faCalendarAlt} style={{color: "grey", marginRight: "4%"}} size={hp("2.5%")} />
                            <Text style={styles.texto_Evento_Descripcion}> 
                                {moment(this.props.inicio).format("DD MMMM YYYY")}
                            </Text>

                        </View>
                        
                        <View style={styles.contenedor_Evento_Icono_y_texto}>

                            <FontAwesomeIcon icon={faClock} style={{color: "grey", marginRight: "4%"}} size={hp("2.5%")} />
                            <Text style={styles.texto_Evento_Descripcion}> 
                                {moment(this.props.inicio).format("HH : mm")}
                            </Text>
                            
                        </View>
                        
                    </View>

                </TouchableOpacity>

                <View style={styles.contenedor_Overlay}>

                    <Overlay
                        isVisible={this.state.isVisible}
                        onBackdropPress={this.toggleOverlay}
                        height="86%"
                        width= "95%"
                    >
                        <View style={styles.contenedor_IdaVuelta}>
                            <View style={styles.logo}>
                                <Image style={[styles.imagen, {width: "40%", marginTop: "-9%"}]} source={require("../../assets/images/proveedores/Renfe.png")} />
                            </View>

                            <View style={[styles.ida_Vuelta, {marginTop: "-15%"}]}>

                                <View style={styles.ida}>

                                    <FontAwesomeIcon icon={faTrain} style={styles.iconos} size={hp("3.5%")} />
                                    <Text style={styles.texto_Titulo}>
                                        RECOGIDA
                                    </Text>
                                    <View style={styles.hairline}></View>

                                    <Text style={styles.texto_Titulo_Descripcion}>
                                        {moment(this.props.inicio).format("DD/MM/YYYY")} {"\n"}
                                        {moment(this.props.inicio).format("hh:mm")} aprox.
                                    </Text>

                                </View>

                                <View style={styles.vuelta}>
                                
                                    <FontAwesomeIcon icon={faTrain} style={styles.iconos} size={hp("3.5%")} />
                                    <Text style={styles.texto_Titulo}>
                                        ENTREGA
                                    </Text>
                                    <View style={styles.hairline}></View>

                                    <Text style={styles.texto_Titulo_Descripcion}>
                                        {moment(this.props.fin).format("DD/MM/YYYY")} {"\n"}
                                        {moment(this.props.fin).format("hh:mm")} aprox.
                                    </Text>

                                </View>

                            </View>
                        </View>

                        <View style={[styles.contenedor_Descripcion, {marginTop: "-9%"}]}>

                            <Text style={styles.label_Descripcion}>
                                Descripción
                            </Text>
                            <View style={styles.hairline}></View>
                            
                            <View style={[styles.descripcion, {justifyContent: "space-around"}]}>

                                <View style={styles.contenedor_Icono_y_texto}>

                                    <FontAwesomeIcon icon={faSearchLocation} size={17} style={[styles.iconos, {marginRight: "1%", marginTop: "0%"}]} />
                                    <Text style={styles.texto_Descripcion}>
                                        LOCALIZADOR RESERVA: {this.props.localizador}
                                    </Text>

                                </View>

                                <View style={styles.contenedor_Icono_y_texto}>

                                    <FontAwesomeIcon icon={faArrowCircleRight} size={17} style={[styles.iconos, {marginRight: "1%", marginTop: "0%"}]} />
                                    <Text style={styles.texto_Descripcion}>
                                        Proveedor: {this.props.proveedor}
                                    </Text>

                                </View>

                                <View style={styles.contenedor_Icono_y_texto}>

                                    <FontAwesomeIcon icon={faArrowCircleRight} size={17} style={[styles.iconos, {marginRight: "1%", marginTop: "0%"}]} />
                                    <Text style={styles.texto_Descripcion}>
                                        Tipo de tren: {this.props.tipoTren}
                                    </Text>

                                </View>

                                <View style={styles.contenedor_Icono_y_texto}>

                                    <FontAwesomeIcon icon={faArrowCircleRight} size={17} style={[styles.iconos, {marginRight: "1%", marginTop: "0%"}]} />
                                    <Text style={styles.texto_Descripcion}>
                                        Clase: {this.props.clase}
                                    </Text>

                                </View>

                                <View style={styles.contenedor_Icono_y_texto}>

                                    <FontAwesomeIcon icon={faMapMarkerAlt} size={17} style={[styles.iconos, {marginRight: "1%", marginTop: "0%"}]} />
                                    <Text style={styles.texto_Descripcion}>
                                        Estación salida: {this.props.estacionOrigen}
                                    </Text>

                                </View>

                                <View style={styles.contenedor_Icono_y_texto}>

                                    <FontAwesomeIcon icon={faMapMarkerAlt} size={17} style={[styles.iconos, {marginRight: "1%", marginTop: "0%"}]} />
                                    <Text style={styles.texto_Descripcion}>
                                        Dirección: {this.props.direccionOrigen}
                                    </Text>

                                </View>
                                
                                <View style={styles.contenedor_Icono_y_texto}>

                                    <FontAwesomeIcon icon={faMapMarkerAlt} size={17} style={[styles.iconos, {marginRight: "1%", marginTop: "0%"}]} />
                                    <Text style={styles.texto_Descripcion}>
                                        Estación llegada: {this.props.estacionDestino}
                                    </Text>

                                </View>

                                <View style={styles.contenedor_Icono_y_texto}>

                                    <FontAwesomeIcon icon={faMapMarkerAlt} size={17} style={[styles.iconos, {marginRight: "1%", marginTop: "0%"}]} />
                                    <Text style={styles.texto_Descripcion}>
                                        Dirección: {this.props.direccionDestino}
                                    </Text>

                                </View>
                                  
                                <Text style={[styles.nota, {marginBottom: "3%"}]}>
                                    NOTA: La hora mostrada corresponde a la hora local en cada país.
                                </Text>

                            </View>

                        </View>

                        <View style={[styles.contenedor_Botones, {flex: 0.3, marginBottom: "9%"}]}>

                            <View style={styles.contenedor_LabelInfo}>

                                <Text style={styles.label_Info}>
                                    Información de interés
                                </Text>
                                <View style={[styles.hairline, {marginVertical: "-0.05%"}]}></View>

                            </View>
                            
                            <View style={[styles.botones_Principales, {marginTop: "5.5%"}]}>

                                <Button
                                    title="METEOROLOGÍA"
                                    titleStyle={styles.texto_Boton}
                                    buttonStyle={styles.boton_Principal}
                                    type="solid"
                                    onPress={() => {
                                        this.obtenerClima();
                                        this.toggleMeteorologia();
                                    }}
                                >
                                </Button>

                                <Overlay
                                    isVisible={this.state.isVisibleMete}
                                    onBackdropPress={this.toggleMeteorologia}
                                    fullScreen={true}
                                >
                                    
                                    <Meteorologia 
                                        ubicacion={this.props.estacionDestino}
                                        previsiones={this.state.previsiones}
                                    />

                                </Overlay>

                                <View style={styles.margen}/>

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
                                    width= "100%"
                                >
                                    
                                </Overlay>

                            </View>

                        </View>

                    </Overlay>

                </View> 

            </View>)
    }
  }
}