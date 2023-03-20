
import React,{useState,useEffect} from 'react'
import {Text,View,StyleSheet,TouchableOpacity,FlatList,ScrollView} from 'react-native'
import { openDatabase } from 'react-native-sqlite-storage'

var db = openDatabase({ name: 'SetOffb1.db' });

const DayScreen=({navigation})=>{
    const days = [
        {day:"Monday"},{day:"Tuesday"},{day:"Wednesday"},{day:"Thursday"},{day:"Friday"},{day:"Saturday"},{day:"Sunday"}
    ]
    const handleDays=(item)=>{
        db.transaction(function(txn){
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='"+item+"'",
                [],
                function (tx, res) {
                if(res.rows.length==0){
                    txn.executeSql('DROP TABLE IF EXISTS '+item, [],function(res){console.log('Deleted')});
                    txn.executeSql('CREATE TABLE IF NOT EXISTS '+item+'(sno INTEGER PRIMARY KEY AUTOINCREMENT, hour INTEGER , min INTEGER , ampm VARCHAR(20),Duration INTEGER,status VARCHAR(20))',[],
                        function(tx,res){
                            console.log('hii');
                        })
                    }
                })
        })
        return(
            navigation.navigate('EachDayTiming',{day:item})
            
        )
    }
    return(
        <View style={{flex:1,flexDirection:'column'}}>
            <View style={{flex:10}}>
            <FlatList data={days} renderItem={({item})=>
            <View style={styles.container}>
                <View style={styles.daywrap}>
                <Text style={styles.day}>{item.day}</Text>
                </View>
                <View style={styles.daybtnwrapper}>
                    <TouchableOpacity onPress={()=>{handleDays(item.day)}}>
                        <Text style={styles.daybtntext}>Set Timings</Text>
                </TouchableOpacity>
                </View>
            </View>
            }/>
            </View>
            <View style={{flex:1,justifyContent:'center',flexDirection:'row'}}>
                <TouchableOpacity onPress={()=>{navigation.navigate('HomeScreen')}}>
                    <Text style={styles.donebtn}>Home</Text>
                </TouchableOpacity>
            </View>
        
        </View>
    )
}
const styles=StyleSheet.create({
    container:{
        flexDirection:'row',
        borderWidth:2,
        borderColor:'purple',
        borderBottomColor:'black',
        borderRadius:10,
        margin:'6%',
        padding:'3%',
        shadowColor:'purple',
        elevation:5
    },
    day:{
        color:'purple',
        fontSize:25,
        opacity:0.5
    },
    daywrap:{
        flex:1
    },
    daybtnwrapper:{
        flex:1,
        backgroundColor:'purple',
        borderWidth:3,
        borderRadius:10,
        borderColor:"purple",
        justifyContent:'center',
        alignItems:'center'
    },
    daybtntext:{
        color:'white',
        fontSize:18
    },
        donebtn:{
          color:'purple',
          borderWidth:3,
          borderBottomColor:'purple',
          borderColor:'purple',
          borderRadius:20,
          padding:5,
          fontSize:20,
          marginTop:10
        }
})
export default DayScreen
