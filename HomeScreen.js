import {useState,useEffect} from 'react'
import {Text ,View,StyleSheet,TouchableOpacity,StatusBar,Button} from 'react-native'
import { openDatabase } from 'react-native-sqlite-storage'
import { useIsFocused } from '@react-navigation/native';
import BackgroundService from 'react-native-background-actions';

var db = openDatabase({ name: 'SetOffb1.db' });

import {
    useRingerMode,
    RINGER_MODE,
    checkDndAccess,
    requestDndAccess,
    RingerModeType,
  } from 'react-native-ringer-mode';

const HomeScreen=({navigation})=>{
    const isFocused = useIsFocused();
    const [Switchdata,setSwitchdata]=useState({})
    const [Scheduledata,setScheduledata]=useState({})
    const [time, setTime] = useState(new Date().toLocaleTimeString());
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    var day=today.split(",")[0]
    const [classes,setclasses]=useState(0)
    const { mode, setMode } = useRingerMode();
    const [Timings,setTimings] = useState([{}])
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes
    const [durationchk,setdurationchk]=useState(0)

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

    const changeMode = async (RingerModeType) => {
        if (RingerModeType === RINGER_MODE.silent || RingerModeType === RINGER_MODE.silent) {
          const hasDndAccess = await checkDndAccess();
          if (hasDndAccess === false) {
            requestDndAccess();
            return;
          }
        }
        setMode(RingerModeType);
    }
    const handleSchedule=()=>{
            navigation.navigate("Addtime")
            console.log(Scheduledata.state);
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

    useEffect(() => {
        const interval = setInterval(() => {
        setTime(new Date().toLocaleTimeString());
        }, 1000);
        
        return () => clearInterval(interval);
        }, []);  

    useEffect(()=>{
        db.transaction(function (txn){
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='"+day+"'",
                [],
                function (tex, res) {
                    console.log('hii',res.rows.length)
                    var t=[{}]
                    tex.executeSql('SELECT * FROM '+day+' WHERE status=?',[1],
                        function(tx,rx){
                            console.log(rx.rows.length)
                            setclasses(rx.rows.length)
                            for(let i=0;i<rx.rows.length;i++){
                                t.push(rx.rows.item(i))
                                console.log('len',rx.rows.length)
                            }
                            setTimings(t)
                        }
                )})
        })
    },[isFocused])

    
    useEffect(()=>{
        console.log(hours,min,Switchdata.state)
        if(Switchdata.state==1){
            console.log('yy')
            Timings.map((itm,ind)=>{
                if(ind>0 ){
                    if(hours>12){
                        console.log(itm.hour,itm.min)
                        if(itm.hour==hours-12 && itm.min==min && itm.ampm=="PM"){
                            changeMode(RINGER_MODE.silent)
                            setdurationchk(1)
                        }
                        else if((hours-12)-itm.hour==itm.Duration && durationchk==1){
                            changeMode(RINGER_MODE.normal)
                            setdurationchk(0)
                        }
                    }
                    else if(hours<=12){
                        if(itm.hour==hours && itm.min==min && itm.ampm=="AM"){
                            changeMode(RINGER_MODE.silent)
                            setdurationchk(1)
                        }
                        else if(hours-itm.hour==itm.Duration && durationchk==1){
                            changeMode(RINGER_MODE.normal)
                            setdurationchk(0)
                        }
                    }
                }
            })
        }
        else{
            changeMode(RINGER_MODE.normal)
        }
    })
    
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
            <View style={styles.statuscontainer}>
                <View style={{borderWidth:2,borderLeftColor:'purple',borderBottomColor:'white',borderRightColor:'white',borderTopColor:'white',padding:5}}>
                    <Text style={{color:'purple',fontSize:20,opacity:0.8,fontWeight:'bold'}}>{day} {time}</Text>
                    {parseInt(classes)>0?
                        <Text style={{color:'purple',fontSize:24}}>You have {classes} {classes==1?<Text>class</Text>:<Text>classes</Text>} today</Text>:
                        <Text style={{color:'purple',fontSize:24}}>No classes scheduled for today </Text>
                    }
                </View>
            </View>
            <View style={styles.scheduleContainer}>
                <View>
                    <TouchableOpacity onPress={(handleSchedule)}>
                        <View style={styles.scheduleButtonwrapper}>
                            {Scheduledata==0?
                                <Text style={styles.scheduleButton}>Schedule Time-Table</Text>:
                                <Text style={styles.scheduleButton}>Update Time-Table</Text>
                            }
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
        //backgroundColor:'#87CEFA',
        borderWidth:3,
        borderColor:'purple',
        borderRadius:10,
        elevation:10,
        shadowColor:'purple'
    },
    silentcontainer:{
        margin:'10%',
        flexDirection:'row',
        padding:10,
        justifyContent:'center',
        borderWidth:3,
        borderColor:'white',
        borderBottomColor:'purple',
        borderRadius:10
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
    },
    statuscontainer:{
        flex:1,
        alignItems:'center',
        paddingTop:'30%'
    }
})
export default HomeScreen