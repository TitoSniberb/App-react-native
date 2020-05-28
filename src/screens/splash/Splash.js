import React from 'react';
import { 
    Text,
    View
} from 'react-native';

import { ScreenContainer } from 'react-native-screens';
import styles from './styles';

export const Splash = ({ navigation }) => (
    <ScreenContainer>
        <View style={styles.contenedor_Principal}>

        </View>
        <Text>Esto es la futura pantalla de carga</Text>
    </ScreenContainer>
)