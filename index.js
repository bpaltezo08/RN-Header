import * as React from 'react';
import {useState, useEffect} from 'react';
import { Text, View, SafeAreaView, Image, TouchableOpacity, ImageBackground, Platform } from 'react-native';
import { StackActions } from '@react-navigation/native';
import Icon from './icons.js';
import Theme from './theme.style.js';
import Assets from './assets.manager.js';
import DB from './storage/';

const styles = {
  borderedButton: {
    padding: 5,
    borderColor: '#fff',
    borderRadius: 5,
    borderWidth: 2,
    height: 45,
    width: 130,
    margin: 5,
    justifyContent: 'center'
  },
  textBig: {

  }
}

export default function CustomHeader(props){

  const navigation = props.navigation.navigation || props.navigation;
  const btnstyle = {marginLeft: 10};
  const [profile, setprofile] = useState({})
  const init = async () => {
    let stored = await DB.get("userProfile")
    setprofile(JSON.parse(stored))
  }
  useEffect(() => {
    init()
  }, [])

  const openDrawer = () => { navigation.openDrawer();}
  const BackToHome = () => { navigation.navigate(props.backscreen || "MenuTab");}

  const navigate = (screen, onBackPress) => {
    // navigation.navigate("MyProfile", {screen: screen == "mycard" ? "ProfileCardTab" : "ProfileTransactionsTab", params: "card"})
    navigation.navigate('MyProfile', {
      tab: screen == "mycard" ? "ProfileCardTab" : "ProfileTransactionsTab",
      onBackPress: onBackPress
    });
  }

  const getName = (p) => {
    let data = p?.data || profile?.data
    return data ? data : {firstname: '', middlename: '', lastname: ''}
  }

  const getCard = (p) => {
    let data = p?.data || profile?.data
    return data ? data.card_number : ""
  }

  const getPoints = (p) => {
    let data = p?.data || profile?.data
    return data ? data.points : "0.00"
  }

  const getPhoto = (p) => {
    let data = p?.data || profile?.data
    return data ? {uri: data.photo} : Assets.logo.profileHolder
  }

  const getCardBackground = (p) => {
    let data = p?.data || profile?.data
    return data ? {uri: data.card_bg_image} : Assets.cards.classic
  }

  const ButtonLeft = props.menu ? 
        <TouchableOpacity style={btnstyle} onPress={openDrawer}>
          <Icon.Feather name="menu" size={20} style={{color: '#fff'}} />
        </TouchableOpacity>
       : 
        <TouchableOpacity style={btnstyle} onPress={props.onBackPress ? props.onBackPress : BackToHome}>
          <Icon.AntDesign name={props.back ? "arrowleft" : "close"} size={20} style={{color: '#fff'}} />
        </TouchableOpacity>;

  if(!props.banner){
    return (
      <View>
        <View style={{flexDirection: 'row', height: 55, padding: 5, backgroundColor: Theme.colors.primary, top: Platform.OS =='ios' && props.top ? props.top : 0}}>
          <View style={{flex:1, justifyContent: 'center'}}>
            {ButtonLeft}
          </View>
          <View style={{flex:3, justifyContent: 'center'}}>
            <Text style={{textAlign:'center', fontSize: 17, color: '#fff'}}>{props.title}</Text>
          </View>
          <View style={{flex:1, justifyContent: 'center'}}>
            {props.rightMenu || null}
          </View>
        </View>
      </View>
    )
  }

  return (
    <View>
      <View style={{flexDirection: 'row', height: (Theme.screen.h / 3) + 15, padding: 0, backgroundColor: Theme.colors.primary}}>
        <ImageBackground
          source={getCardBackground(props.profile ? props.profile : {})} 
          style={{flex: 1,
            resizeMode: "cover",
            justifyContent: "center"}
          }>
          <View style={{flex:1, justifyContent: 'center', borderColor: '#fff', borderWeight: 3}}>
            {ButtonLeft}
          </View>
          <View style={{flex:3, justifyContent: 'flex-start', alignItems: 'center', width: '100%'}}>
            <View style={{position: 'absolute', width: 78, height: 78, borderRadius: 40, marginTop: -35, borderColor: '#fff', zIndex: 1, borderWidth: 3}}>
              <Image source={getPhoto(props.profile ? props.profile : {})} style={{ flex: 1, borderRadius: 40, resizeMode: "cover", alignSelf: "center", width: '100%', height: '100%', borderColor: '#fff'}} />
            </View>
            <View style={{flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontSize: 15, fontWeight: 'bold', color: '#fff', marginTop: 35}}>
                {Theme.formatter.NAME(getName(props.profile ? props.profile : {}))}
              </Text>
              <Text style={{fontSize: 25, fontWeight: 'bold', color: '#fff'}}>
                {Theme.formatter.CN(getCard(props.profile ? props.profile : {}))}
              </Text>
              <Text style={{fontSize: 15, color: '#fff', marginBottom: 10}}>
                Points: <Text style={{fontWeight: 'bold'}}>{Theme.formatter.CRNCY(getPoints(props.profile ? props.profile : {}))}</Text>
              </Text>
            </View>
          </View>
          <View style={{flex:1, justifyContent: 'center', alignItems: 'center', bottom: 15, borderColor: '#fff', borderWeight: 3}}>
            <View style={{flex: 1, flexDirection: 'row', marginBottom: 20}}>
                <TouchableOpacity onPress={() => navigate("transactions", props.reload || null)} style={styles.borderedButton}>
                  <Text style={{color: '#fff', alignSelf:'center'}}>My Transactions</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigate("mycard", props.reload || null)} style={styles.borderedButton}>
                  <Text style={{color: '#fff', alignSelf:'center'}}>My Card</Text>
                </TouchableOpacity>
              </View>
          </View>
        </ImageBackground>

      </View>
    </View>
  );
}
