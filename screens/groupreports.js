import React from 'react';
import {
    StyleSheet, View, Text, FlatList, TouchableWithoutFeedback, Dimensions,
    SafeAreaView
} from 'react-native';

const ipv4 = require('../serverip.json').serverIp;
const screenWidth = Math.round(Dimensions.get('window').width);

export default class groupReportsComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            grupo: this.props.navigation.state.params.fk_grupo,
            reportes: '',
            navigation: this.props.navigation,
        }
    }
    getReportsData = () => {
        const options = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        };
        fetch(ipv4 + '/reportes/grupo/' + this.state.grupo, options).then(response => {
            if (response.status == 200) {
                response.json().then(jsonObj => {
                    this.setState({ reportes: jsonObj });
                }) 
            } else if (response.status == 204) {
                alert('error interno, intente mas tarde');
            }
        }).catch(err => console.log(err));
    }

    reportPressHAndler = (reporte) =>{
        this.state.navigation.navigate('reportDetailScreen', {reporte});
    }

    reportListComponent = () => {
        if (this.state.reportes != '' && this.state.reportes.length != 0) {
            return (
                <FlatList data={this.state.reportes}
                    keyExtractor={item => item.pk_reporte.toString( )} renderItem={({ item }) => {
                        return (
                            <TouchableWithoutFeedback onPress={() => this.reportPressHAndler(item)}>
                                <Text style={{ fontSize: 20, paddingBottom: 2, textDecorationLine: 'underline', marginBottom: 20 }}>{item.fecha}  -  {item.hora}:{item.minuto}{item.meridiem}</Text>
                            </TouchableWithoutFeedback>
                        )
                    }
                    } />
            )

        } else {
            return (
                <View style={{display: 'flex', width: screenWidth}}>
                    <Text style={{ fontSize: 25, color: '#D82C2C', display:'flex', textAlign: 'center' }} >El grupo no tiene reportes cargados por el momento</Text>
                </View>
            )
        }
    }
    
    componentDidMount() {
        this.getReportsData();
       
        this.subs = [
            this.props.navigation.addListener("didFocus", () => {
                this.setState({ isFocused: true }); 
                this.getReportsData();
            }),
            this.props.navigation.addListener("willBlur", () => {this.setState({ isFocused: false })})
        ];
    }
    
        
    componentWillUnmount(){
        this.subs.forEach(sub => sub.remove());
    }


    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={{ fontSize: 35, marginBottom: 50, fontWeight: 'bold' }}>Reportes del grupo</Text>
                <View>
                    {this.reportListComponent()}
                </View>
            </SafeAreaView>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 30

    }
})