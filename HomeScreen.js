import {useState,useEffect} from 'react'
import {Text ,View,StyleSheet,TouchableOpacity,StatusBar} from 'react-native'
import { openDatabase } from 'react-native-sqlite-storage'
import DayScreen from './DayScreen';
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import Addtime from './Addtime';

var db = openDatabase({ name: 'SetOffb1.db' });

function HomeScreen({navigation}){
    const [Switchdata,setSwitchdata]=useState({})
    const [Scheduledata,setScheduledata]=useState({})
    const handleSwitchState=()=>{
        db.transaction(function(tx){
            
        if(!Switchdata.state){
            tx.executeSql('UPDATE schedule_switch set task=?, state=?  where sno=?',
            ["Switch",1,1]);
            tx.executeSql('SELECT * FROM schedule_switch WHERE sno=?',[1],
            function(tx,res){
                console.log(res.rows.item(0));
                setSwitchdata(res.rows.item(0));
            });
        }
        else{
            tx.executeSql('UPDATE schedule_switch set task=?, state=?  where sno=?',
            ["Switch",0,1]);
            tx.executeSql('SELECT * FROM schedule_switch WHERE sno=?',[1],
            function(tx,res){
                console.log(res.rows.item(0));
                setSwitchdata(res.rows.item(0));
            });
        }
        })
    }
    const handleSchedule=()=>{
        db.transaction(function(tx){
            if(!Scheduledata.state){
                tx.executeSql('UPDATE schedule_switch set task=?, state=?  where sno=?',
                ["Schedule",1,2]);
                tx.executeSql('SELECT * FROM schedule_switch WHERE sno=?',[2],
                function(tx,res){
                    console.log(res.rows.item(0));
                    setScheduledata(res.rows.item(0));
                });
            }
            else{
                tx.executeSql('UPDATE schedule_switch set task=?, state=?  where sno=?',
                ["Switch",0,2]);
                tx.executeSql('SELECT * FROM schedule_switch WHERE sno=?',[2],
                function(tx,res){
                    console.log(res.rows.item(0));
                    setScheduledata(res.rows.item(0));
                });
            }
            })
            console.log(Scheduledata.state)
    }

    useEffect(()=>{
        db.transaction(function (txn){
            txn.executeSql(
              "SELECT name FROM sqlite_master WHERE type='table' AND name='schedule_switch'",
              [],
              function (tx, res) {
                console.log('item:', res);
                if (res.rows.length == 0) {
                  txn.executeSql('DROP TABLE IF EXISTS schedule_switch', []);
                  txn.executeSql(
                    'CREATE TABLE IF NOT EXISTS schedule_switch(sno INTEGER PRIMARY KEY AUTOINCREMENT, task VARCHAR(20) , state INTEGER)',
                    []
                  );
                  tx.executeSql('INSERT INTO schedule_switch (task , state) VALUES(?,?)',["Switch",0],
                  function(tx,res){
                      if(res.rowsAffected>0){
                          console.log('Success',res.rowsAffected);
                      }
                      else {
                          console.log('Failure');
                      }
                  })
                  tx.executeSql('INSERT INTO schedule_switch (task , state) VALUES(?,?)',["Schedule",0],
                  function(tx,res){
                      if(res.rowsAffected>0){
                          console.log('Success',res.rowsAffected);
                      }
                      else {
                          console.log('Failure');
                      }
                  })
                }
                else{
                    console.log("Already created")
                }
                tx.executeSql('SELECT * FROM schedule_switch WHERE sno=?',[1],
                function(tx,res){
                    console.log(res.rows.item(0));
                    setSwitchdata(res.rows.item(0));
                });
                tx.executeSql('SELECT * FROM schedule_switch WHERE sno=?',[2],
                function(tx,res){
                    console.log(res.rows.item(0));
                    setScheduledata(res.rows.item(0));
                });
              }
            );
          });
        }, []);
    return(
        <>
        <StatusBar backgroundColor='purple' barStyle={'light-content'}/>
        <View style={styles.container}>
            <View style={styles.silentcontainer}>
                <Text style={styles.silentText}>Silent-Mode</Text>
                <TouchableOpacity onPress={handleSwitchState}>
                    <View style={styles.switchWrapper}>
                        {
                            Switchdata.state ?
                                <Text style={styles.switch}>On</Text>:
                               <Text style={styles.switch}>Off</Text>
                        }
                    </View>
                </TouchableOpacity>
            </View>
            <View style={styles.scheduleContainer}>
                <View>
                    <TouchableOpacity onPress={(handleSchedule)}>
                        <View style={styles.scheduleButtonwrapper}>
                            <Text style={styles.scheduleButton}>Schedule Time-Table</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>            
        </View>
        </>
    )
}
const styles=StyleSheet.create({
    silentText:{
        fontSize:24,
        fontWeight:'bold',
        color:'black'
    },
    container:{
        flex:1,
        backgroundColor:'#87CEFA'
    },
    silentcontainer:{
        margin:'10%',
        flexDirection:'row',
        
        padding:10,
        justifyContent:'center'
    },
    switch:{
        fontSize:24,
        textAlignVertical:'center',
        textAlign:'center',
        color:'white'
    },
    switchWrapper:{
        backgroundColor:'purple',
        width:60,
        height:40,
        borderWidth:2,
        borderRadius:15,
        borderColor:'purple',
        shadowColor:'black',
        elevation:15,
        marginLeft:10
    },
    scheduleContainer:{
        flex:1,
        justifyContent:'flex-end',
        alignItems:'flex-end'
    },
    scheduleButtonwrapper:{
        backgroundColor:'white',
        width:200,
        height:40,
        boderWidth:3,
        borderRadius:10,
        margin:20,
        borderColor:'black',
        shadowColor:'black',
        elevation:20,
        justifyContent:'center',
        alignItems:'center'
    },
    scheduleButton:{
        fontSize:20,
        color:'purple'
    }
})
export default HomeScreen