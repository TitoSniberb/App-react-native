import React, { PureComponent } from 'react';
import { Platform, View, Text } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import SliderEntry from "./sliderentry";
import { sliderWidth, itemWidth } from './SliderEntry.style';
import styles from './index.style';
import LinearGradient from "react-native-linear-gradient"

const IS_ANDROID = Platform.OS === 'android';
const SLIDER_1_FIRST_ITEM = 0;

export class Meteorologia extends PureComponent {
    constructor(props){
        super(props)

        this.state = {
            ubicacion: this.props.ubicacion,
            previsiones: this.props.previsiones,
            slider1ActiveSlide: SLIDER_1_FIRST_ITEM,

            data: undefined,
        }
    }

    async componentDidMount(){
        await this.addToObject();

        console.log("Datos meteo: ", this.state.data)
    }

    addToObject() {
        let previsiones = this.state.previsiones;

        previsiones.forEach(elem => {
            elem.ubicacion = this.state.ubicacion;
        });

        this.setState({ data: previsiones})
    };

    _renderItem ({item}) {
        return <SliderEntry data={item} />;
    }

    render() {
        const { slider1ActiveSlide } = this.state;

        return (
            <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 1}} colors={['#cd7f32', '#DB5079']} style={styles.linearGradient}>

            
            <View style={styles.contenedor_Principal}>

                <View style={styles.contenedor_Titulo}>
                    <Text style={styles.titulo}> Previsiones meteorologicas </Text>
                </View>
                
                <View style={styles.contenedor_Carousel}>

                    <Carousel
                        ref={c => this._slider1Ref = c}
                        data={this.state.data}
                        removeClippedSubviews={true}
                        renderItem={this._renderItem}
                        sliderWidth={sliderWidth}
                        itemWidth={itemWidth}
                        hasParallaxImages={false}
                        firstItem={SLIDER_1_FIRST_ITEM}
                        activeSlideAlignment="start"
                        inactiveSlideScale={0.8}
                        inactiveSlideOpacity={0.7}
                        //inactiveSlideShift={20}
                        containerCustomStyle={styles.slider}
                        contentContainerCustomStyle={styles.sliderContentContainer}
                        loop={false}
                        loopClonesPerSide={2}
                        autoplay={false}
                        //autoplayDelay={500}
                        //autoplayInterval={3000}
                        onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index }) }

                        //decelerationRate="fast"
                    />

                </View>

                {/* <Pagination
                    dotsLength={this.state.previsiones.length}
                    activeDotIndex={slider1ActiveSlide}
                    containerStyle={styles.paginationContainer}
                    dotColor={'red'}
                    dotStyle={styles.paginationDot}
                    inactiveDotColor={"black"}
                    inactiveDotOpacity={0.4}
                    inactiveDotScale={0.6}
                    carouselRef={this._slider1Ref}
                    tappableDots={!!this._slider1Ref}
                /> */}

            </View>
            </LinearGradient>
            
        );
    }
}