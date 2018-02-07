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


export default class Screen1 extends Component
{
    render()
    {
        return(
            <Container>
              <Grid>
                  <Col >
                     <Row size={8} style={styles.container}>   
                        <Text style={{fontSize:55,fontWeight:'bold',color:'#154360'}}> IPLBox </Text>
                        <Image source={require('./imgs/AlexaIPL.png')} style={{width:200,height:200}}/>
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
                        onPress={() => this.props.navigation.navigate("ScreenTwo")}
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
                         <Icon name="circle"     color='#5DADE2' size={8} style={{paddingRight:10}}/> 
                         <Icon name="circle-o"   color='#5DADE2' size={8} style={{paddingRight:10}}/>
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