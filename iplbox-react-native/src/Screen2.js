import React,{Component} from 'react';
import {AppRegistry,StyleSheet,Image} from 'react-native';
import {
Text,
View,
Container,
Button,
Header,
Footer,
Content,
Body,
Left,
Right,
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Icon from 'react-native-vector-icons/FontAwesome';


export default class Screen2 extends Component
{
    render()
    {
        return(
            <Container>
              <Grid>
                  <Col >
                     <Row size={8} style={styles.container}>   
                        <Image source={require('./imgs/cricket.png')} style={{width:200,height:200}}/>
                        <Text style={{color:'#154360',fontSize:22,textAlign:'center',padding:10}}>
                        IPLBrainz is an application that  
                        answers any queries related to 
                        IPL matches with the help of your 
                        voice assistant Alexa
                        </Text>
                    </Row>
                    <Row size={1} style={{backgroundColor:'#FFFFFF'}}>
                    <Left>
                    <Button transparent style={{alignItems:'flex-end'}}
                    onPress={() => this.props.navigation.navigate("ScreenMain")}
                    >
                            <Text style={{color:'#154360'}} >Skip</Text>
                        </Button>
                    </Left>
                    <Right>
                        <Button transparent style={{alignItems:'flex-end'}}
                        onPress={() => this.props.navigation.navigate("ScreenThree")}
                        >
                            <Text style={{color:'#154360'}}>Next</Text>
                        </Button>
                    </Right>
                    </Row>
                </Col>
                </Grid>
                <Footer  style={{backgroundColor:'#FFFFFF'}}  >
                    <Row style={{ justifyContent:'center' ,
                         alignItems:'center',
                         flexDirection:'row' , }}> 
                         <Icon name="circle-o"     color='#5DADE2' size={8} style={{paddingRight:10}}/> 
                         <Icon name="circle"   color='#5DADE2' size={8} style={{paddingRight:10}}/>
                         <Icon name="circle-o"   color='#5DADE2' size={8}/>
                    </Row>
                    
                </Footer>
            </Container>
        );
    }
}
const styles = StyleSheet.create({
    container: {
    justifyContent:'center' ,
    alignItems:'center',
      flexDirection:'column' ,
      backgroundColor: '#FFFFFF',
      
    },
    
  });