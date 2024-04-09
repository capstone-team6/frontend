import React from 'react';
import { View } from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps'

const MapSearch:React.FC = () => {
    return (
        <View>
                <MapView
                    style={{ flex: 1 }}
                    provider={PROVIDER_GOOGLE}
                    initialRegion={{
                    latitude: 37.78825,
                    longitude: -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
            }}    
        />

        </View>
    );
};

export default MapSearch;