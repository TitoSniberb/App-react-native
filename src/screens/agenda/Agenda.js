import React, {PureComponent} from 'react';
import {Text, View} from 'react-native';
import {Agenda as AgendaCalendar} from 'react-native-calendars';
import moment from 'moment';
import styles from "./styles";

import { EventoAgenda } from "../../components/eventoAgenda/EventoAgenda"
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { 
  faCalendarAlt, 
  faClock, 
  faMapMarkerAlt, 
} from '@fortawesome/free-solid-svg-icons';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { TouchableOpacity } from 'react-native-gesture-handler';

export class Agenda extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      url: "http://localhost:3000/Pedidos",
      items: {},
      dataPedidos: [],

      fechas: [{
        FechaInicio: undefined,
        FechaFin: undefined
      }],

      viajeros: [{
        idViajero: "",
        nombre: "",
        email: "",
        titular: false,
      }],

      minDate: "",
      maxDate: ""
    };
  }

  async componentDidMount(){
    await this.getData();

  }

  getData = () => {
    return fetch(this.state.url)
    .then(res => res.json())
    .then(res => {

      const fechasEvento = [];
      res.forEach(elem => {
        let evento = {
          FechaInicio: moment(elem.FechaInicio).format("YYYY-MM-DD"),
          FechaFin: moment(elem.FechaFin).format("YYYY-MM-DD")
        }
        fechasEvento.push(evento)
      });

      const viajeros = [];
      res.forEach(elem => {
        let viajero = {
          idViajero: elem.Viajeros[0].idViajero,
          nombre: elem.Viajeros[0].Nombre,
          email: elem.Viajeros[0].Email,
          titular: elem.Viajeros[0].Titular
        }
        viajeros.push(viajero)
      })

      this.setState({
        dataPedidos: res,
        fechas: fechasEvento
      });
      console.log("Datos de los pedidos: ", this.state.dataPedidos)
    });
  };

  render() {
    return (
      <AgendaCalendar
        items={this.state.items}
        loadItemsForMonth={this.loadItems.bind(this)}
        selected={moment().startOf("month").format("YYYY-MM-DD")}
        renderItem={this.renderItem.bind(this)}
        //renderDay={this._renderDay}
        renderEmptyDate={this.renderEmptyDate}
        //renderEmptyData={this.renderEmptyDate.bind(this)}
        onDayPres={this.onDayPress}
        onDayChange={this.onDayChange}
        rowHasChanged={this.rowHasChanged.bind(this)}
        futureScrollRange={24}
        pastScrollRange={24}
        theme={{
          textDayFontFamily: "latoregular",
          textMonthFontFamily: "latobold",
          textDayHeaderFontFamily: "latoitalic",
        }}
        // minDate={this.state.minDate}
        // maxDate={this.state.maxDate}
        // markingType={'period'}
        // markedDates={{
        //    '2017-05-08': {textColor: '#43515c'},
        //    '2017-05-09': {textColor: '#43515c'},
        //    '2017-05-14': {startingDay: true, endingDay: true, color: 'blue'},
        //    '2017-05-21': {startingDay: true, color: 'blue'},
        //    '2017-05-22': {endingDay: true, color: 'gray'},
        //    '2017-05-24': {startingDay: true, color: 'gray'},
        //    '2017-05-25': {color: 'gray'},
        //    '2017-05-26': {endingDay: true, color: 'gray'}}}
        //monthFormat={'yyyy'}
        //theme={{calendarBackground: 'red', agendaKnobColor: 'green'}}
        //renderDay={(day, item) => (<Text>{day ? day.day: 'item'}</Text>)}
        //hideExtraDays={true}
      />
    );
  }

  _loadItems(day) {
    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = this.timeToString(time);
        if (!this.state.items[strTime]) {
          this.state.items[strTime] = [];
          const numItems = Math.floor(Math.random() * 3 + 1);
          for (let j = 0; j < numItems; j++) {
            this.state.items[strTime].push({
              name: 'Item for ' + strTime + ' #' + j,
              height: Math.max(50, Math.floor(Math.random() * 150))
            });
          }
        }
      }
      const newItems = {};
      Object.keys(this.state.items).forEach(key => {newItems[key] = this.state.items[key];});
      this.setState({
        items: newItems
      });
    }, 1000);
  }

  _renderItem(item) {
    return (
      <TouchableOpacity
        style={[styles.item, {height: item.height}]} 
        onPress={() => Alert.alert(item.name)}
      >
        <Text>{item.name}</Text>
      </TouchableOpacity>
    );
  }

  _renderEmptyDate() {
    return (
      <View style={styles.emptyDate}>
        <Text>This is empty date!</Text>
      </View>
    );
  }




  loadItems(day){
    setTimeout(() => {
    
      let strTime = "";
      console.log(this.state.fechas)
      for (let i = 0; i < this.state.fechas.length; i++){
        console.log("Ahora estamos a : ", this.state.fechas[i])
        strTime = this.state.fechas[i].FechaInicio;

        if(this.state.dataPedidos[i].Tipo === "Aereo"){
          if (!this.state.items[strTime]) {

            this.state.items[strTime] = [];
      
            this.state.items[strTime].push(
            {
              name: this.state.dataPedidos[i].Asunto,
              tipo: this.state.dataPedidos[i].Tipo,
              duracion: this.state.dataPedidos[i].Detalles.DuracionHoras,
              linea: this.state.dataPedidos[i].Detalles.Aerolinea,
              
              inicio: this.state.dataPedidos[i].FechaInicio,
              fin: this.state.dataPedidos[i].FechaFin,

              aeroSalida: this.state.dataPedidos[i].Detalles.SalidaNombreAeropuerto,
              aeroLlegada: this.state.dataPedidos[i].Detalles.LlegadaNombreAeropuerto,

              ciudadSalida: this.state.dataPedidos[i].Detalles.SalidaCiudad,
              ciudadLlegada: this.state.dataPedidos[i].Detalles.LlegadaCiudad,

              iataLlegada: this.state.dataPedidos[i].Detalles.LlegadaIATA,
              iataSalida: this.state.dataPedidos[i].Detalles.SalidaIATA,

              numVuelo: this.state.dataPedidos[i].Detalles.NVuelo,
              localizador: this.state.dataPedidos[i].Detalles.Localizador,

              latitudDestino: this.state.dataPedidos[i].Detalles.LatitudDestino,
              longitudDestino: this.state.dataPedidos[i].Detalles.LongitudDestino,
            }
            );
          }
        }

        if(this.state.dataPedidos[i].Tipo === "Hotel"){
          if (!this.state.items[strTime]) {

            this.state.items[strTime] = [];
      
            this.state.items[strTime].push(
            {
              name: this.state.dataPedidos[i].Asunto,
              tipo: this.state.dataPedidos[i].Tipo,
              localizador: this.state.dataPedidos[i].Detalles.Localizador,
              inicio: this.state.dataPedidos[i].FechaInicio,
              fin: this.state.dataPedidos[i].FechaFin,

              direccion: this.state.dataPedidos[i].Detalles.Direccion,
              ubicacion: this.state.dataPedidos[i].Ubicacion,
              regimen: this.state.dataPedidos[i].Detalles.Regimen,
              habitacion: this.state.dataPedidos[i].Detalles.TipoHabitacion,
              viajeros: this.state.dataPedidos[i].Viajeros,

              latitudDestino: this.state.dataPedidos[i].Detalles.LatitudDestino,
              longitudDestino: this.state.dataPedidos[i].Detalles.LongitudDestino,
            }
            );
          }
        }

        if(this.state.dataPedidos[i].Tipo === "Tren"){
          if (!this.state.items[strTime]) {

            this.state.items[strTime] = [];
      
            this.state.items[strTime].push(
            {
              name: this.state.dataPedidos[i].Asunto,
              tipo: this.state.dataPedidos[i].Tipo,
              localizador: this.state.dataPedidos[i].Detalles.Localizador,

              inicio: this.state.dataPedidos[i].FechaInicio,
              fin: this.state.dataPedidos[i].FechaFin,

              proveedor: this.state.dataPedidos[i].Detalles.Proveedor,
              tipoTren: this.state.dataPedidos[i].Detalles.TipoTren.split("/")[0],
              clase: this.state.dataPedidos[i].Detalles.Clase,

              estacionOrigen: this.state.dataPedidos[i].Detalles.EstacionOrigen,
              estacionDestino: this.state.dataPedidos[i].Detalles.EstacionDestino,

              direccionOrigen: this.state.dataPedidos[i].DireccionOrigen,
              direccionDestino: this.state.dataPedidos[i].Detalles.DireccionDestino,

              latitudDestino: this.state.dataPedidos[i].Detalles.LatitudDestino,
              longitudDestino: this.state.dataPedidos[i].Detalles.LongitudDestino,
            }
            );
          }
        }

        if(this.state.dataPedidos[i].Tipo === "Coche"){
          if (!this.state.items[strTime]) {

            this.state.items[strTime] = [];
      
            this.state.items[strTime].push(
            {
              name: this.state.dataPedidos[i].Asunto,
              tipo: this.state.dataPedidos[i].Tipo,
              idProveedor: this.state.dataPedidos[i].idProveedor,
              inicio: this.state.dataPedidos[i].FechaInicio,
              fin: this.state.dataPedidos[i].FechaFin,

              localizador: this.state.dataPedidos[i].Detalles.Localizador,
              proveedor: this.state.dataPedidos[i].Detalles.Proveedor,
              categoriaCoche: this.state.dataPedidos[i].Detalles.Categoria,
              transmision: this.state.dataPedidos[i].Detalles.Transmision,
              combustible: this.state.dataPedidos[i].Detalles.Combustible_AC,

              direccionRecogida: this.state.dataPedidos[i].Detalles.DireccionRecogida,
              direccionEntrega: this.state.dataPedidos[i].Detalles.DireccionEntrega,

              viajeros: this.state.dataPedidos[i].Viajeros,

              latitudDestino: this.state.dataPedidos[i].Detalles.LatitudDestino,
              longitudDestino: this.state.dataPedidos[i].Detalles.LongitudDestino,
            }
            );
          }
        }

        if(this.state.dataPedidos[i].Tipo === "Barco"){
          if (!this.state.items[strTime]) {

            this.state.items[strTime] = [];
      
            this.state.items[strTime].push(
            {
              name: this.state.dataPedidos[i].Asunto,
              tipo: this.state.dataPedidos[i].Tipo,

              inicio: this.state.dataPedidos[i].FechaInicio,
              fin: this.state.dataPedidos[i].FechaFin,

              direccionOrigen: this.state.dataPedidos[i].DireccionOrigen,
              direccionDestino: this.state.dataPedidos[i].Detalles.DireccionDestino,

              localizador: this.state.dataPedidos[i].Detalles.Localizador,
              proveedor: this.state.dataPedidos[i].Detalles.Proveedor,
              acomodacion: this.state.dataPedidos[i].Detalles.Acomodacion,

              salida: this.state.dataPedidos[i].Ubicacion,
              llegada: this.state.dataPedidos[i].Detalles.Destino,

              vehiculos: this.state.dataPedidos[i].Detalles.Vehiculos,
              viajeros: this.state.dataPedidos[i].Viajeros,

              latitudDestino: this.state.dataPedidos[i].Detalles.LatitudDestino,
              longitudDestino: this.state.dataPedidos[i].Detalles.LongitudDestino,
            }
            );
          }
        }

      };

      /*Esta libreria necesita crear un objeto con este formato {
          00/00/00: []
      }
      aunque no haya ningun evento programado, se le tiene que pasar un array vacio
      */
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = this.timeToString(time);
        if (!this.state.items[strTime]) {
          this.state.items[strTime] = [];
        }
      }

      const newItems = {};
    
      Object.keys(this.state.items).forEach(key => {newItems[key] = this.state.items[key];});
      this.setState({
        items: newItems
      });
    }, 1000);
  }

  renderItem(item) {
    return (
      <EventoAgenda 
        //SHARED PROPS
        texto={item.name}
        tipo={item.tipo}
        localizador={item.localizador}
        inicio={item.inicio}
        fin={item.fin}
        latitudDestino={item.latitudDestino}
        longitudDestino={item.longitudDestino}
        viajeros={item.viajeros}

        //TREN
        proveedor={item.proveedor}
        tipoTren={item.tipoTren}
        clase={item.clase}
        estacionOrigen={item.estacionOrigen}
        estacionDestino={item.estacionDestino}
        direccionOrigen={item.direccionOrigen}
        direccionDestino={item.direccionDestino}

        //Aereo          
        numVuelo={item.numVuelo}
        linea={item.linea}
        duracion={item.duracion}
        aeroSalida={item.aeroSalida}
        aeroLlegada={item.aeroLlegada}
        ciudadSalida={item.ciudadSalida}
        ciudadLlegada={item.ciudadLlegada}
        iataLlegada={item.iataLlegada}
        iataSalida={item.iataSalida}

        //COCHE
        idProveedor={item.idProveedor}
        proveedor={item.proveedor}
        categoriaCoche={item.categoriaCoche}
        transmision={item.transmision}
        combustible={item.combustible}
        recogida={item.direccionRecogida}
        entrega={item.direccionEntrega}
        iataLlegada={item.iataLlegada}
        iataSalida={item.iataSalida}

        //HOTEL
        direccion={item.direccion}
        ubicacion={item.ubicacion}
        regimen={item.regimen}
        habitacion={item.habitacion}

        //BARCO
        direccionOrigen={item.direccionOrigen}
        direccionDestino={item.direccionDestino}
        proveedor={item.proveedor}
        acomodacion={item.acomodacion}
        salida={item.salida}
        llegada={item.llegada}
        vehiculos={item.vehiculos}
      />
    )
  }

  onDayPress = (date) => {
    this.setState({
      date: new Date(date.year, date.month-1, date.day),
    });
  };

  onDayChange = (date) => {
    this.setState({
      date: new Date(date.year, date.month-1, date.day),
    });
  };

  _renderDay = (day, item) => {
    if (item == undefined) {
      return (<View></View>)
    }
    else {
      return (
        <View>
          <Text>Tus muertos</Text>
        </View>
      )
    }
  }

  renderEmptyDate() {
    return (
      <View style={styles.contenedor_Evento}>
        
        <View style={styles.contenedor_Evento_Titulo}>

            <Text style={styles.texto_Evento_Titulo}>
                No tienes ningun evento programado para este dia.
            </Text> 
          
        </View>

        <View style={styles.contenedor_Evento_Descripcion}>

            <View style={styles.contenedor_Icono_y_texto}>

                <FontAwesomeIcon icon={faMapMarkerAlt} style={{color: "grey", marginRight: "2%"}} size={hp("2.3%")} />
                <Text numberOfLines={1} style={[styles.texto_Evento_Descripcion, {paddingRight: "12%"}]}>
                    "La ubicacion no se encuentra disponible"
                </Text>
            </View>
    
        </View>

        <View style={styles.contenedor_Evento_Ubicacion}>

            <View style={styles.contenedor_Evento_Icono_y_texto}>

                <FontAwesomeIcon icon={faCalendarAlt} style={{color: "grey", marginRight: "4%"}} size={hp("2.5%")} />
                <Text style={styles.texto_Evento_Descripcion}> 
                    00 / 00 / 00
                </Text>

            </View>
            
            <View style={styles.contenedor_Evento_Icono_y_texto}>

                <FontAwesomeIcon icon={faClock} style={{color: "grey", marginRight: "4%"}} size={hp("2.5%")} />
                <Text style={styles.texto_Evento_Descripcion}> 
                    00 : 00
                </Text>
                
            </View>
            
        </View>
        
      </View>
    );
  }

  rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }
}