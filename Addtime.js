import {useState,useEffect} from 'react'
import {View,Text,FlatList, StyleSheet,TouchableOpacity,TextInput,Dimensions} from 'react-native'
import { openDatabase } from 'react-native-sqlite-storage'
import DateTimePickerModal from "react-native-modal-datetime-picker";

var db = openDatabase({ name: 'SetOffb1.db' });

const Addtime=()=>{
    const [Hope,setHope] = useState([{}]);
    const [Visible,setVisible]=useState(false)
    const showTimePicker = () => {
        setVisible(true);
        console.log('shown');
      };
    
      const hideTimePicker = () => {
        setVisible(false);
      };

    const handleConfirm = date => {
        const dt= new Date(date);
        const x=dt.toLocaleTimeString().split(' ');
        const y=x[0].split(':')
        db.transaction(function(tx){
                console.log('Hii');
                    tx.executeSql('INSERT INTO timings (hour,min,ampm) VALUES(?,?,?)',[y[0],y[1],x[1]],
                    function(tx,res){
                        tx.executeSql('SELECT * FROM timings',[],
                        function(txn,rx){
                            var t=[];
                            for(let i=0;i<rx.rows.length;i++){
                                console.log(rx.rows.item(i));
                                t.push(rx.rows.item(i));
                            }
                            setHope(t);
                        })
                    });
                }
            )

        hideTimePicker();
      };
    const handleRemove=(id)=>{
        console.log(id);
        db.transaction(function(tx){
            tx.executeSql('DELETE FROM timings where sno=?',[id])
            tx.executeSql('SELECT * FROM timings',[],
                function(txn,rx){
                    var t=[];
                    for(let i=0;i<rx.rows.length;i++){
                        console.log(rx.rows.item(i));
                        t.push(rx.rows.item(i));
                    }
                    setHope(t);
                })
        })

    }  
    const width=Dimensions.get('window')
    useEffect(()=>{
        db.transaction(function(txn){
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='timings'",
                [],
                function (tx, res) {
                  console.log('item:', res);
                  if (res.rows.length == 0) {
                    txn.executeSql('DROP TABLE IF EXISTS timings', []);
                    txn.executeSql(
                      'CREATE TABLE IF NOT EXISTS timings(sno INTEGER PRIMARY KEY AUTOINCREMENT, hour INTEGER , min INTEGER , ampm VARCHAR(20))',
                      []
                    );
                    }
                    else{
                        txn.executeSql('SELECT * FROM timings',[],
                        function(tx,rx){
                            var t=[];
                            for(let i=0;i<rx.rows.length;i++){
                                console.log(rx.rows.item(i));
                                t.push(rx.rows.item(i));
                            }
                            setHope(t)
                        })
                    }
                })
        })
    },[])
    
    return (
        <View style={styles.container}>
            <View style={styles.timecontainer}>
                <View style={{marginBottom:'5%',flex:1,alignItems:'center'}}>
                    <Text style={styles.timeslotheading}>Set all time slots of your schedule</Text>
                </View>
                <View style={{flex:10,width:'100%'}}>



                    <FlatList data={Hope} renderItem={({item})=>
                    <View style={styles.timewrapper}>
                        <View style={{flex:1}}>
                                <Text style={styles.time}>{item.hour}:{item.min} {item.ampm}</Text>
                                    <TextInput placeholder="Enter Duration in hour" style={styles.textinput}></TextInput>     
 
                        </View>
                        <View style={{flex:1,justifyContent:'center',alignItems:'flex-end'}}>
                        <TouchableOpacity onPress={()=>handleRemove(item.sno)}>
                            <View style={styles.removewrapper}>
                                <Text style={{color:'white',fontSize:16}}>Remove</Text>
                            </View>
                        </TouchableOpacity>
                        </View>
                    </View> 
                    }></FlatList>     




                </View>
            </View>    
            <View style={styles.addnewtime}>
                <TouchableOpacity onPress={showTimePicker}>
                    <View style={styles.addbtn}>
                        <Text style={styles.addbtnfont}>+</Text>
                    </View>

                </TouchableOpacity>
            </View>
            <DateTimePickerModal
                    isVisible={Visible}
                    mode="time"
                    onConfirm={handleConfirm}
                    onCancel={hideTimePicker}
                />
        </View>
    )
}
const styles=StyleSheet.create({
    timeslotheading:{
        fontSize:24,
        fontWeight:'bold',
        color:'purple',
        opacity:0.5
    },
    container:{
        flex:1,
    },
    timecontainer:{
        flex:10,
    },
    addnewtime:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    addbtn:{
        justifyContent:'center',
        alignItems:'center'
    },
    addbtnfont:{
        fontSize:30,
        color:'purple'
    },
    timewrapper:{
        flexDirection:'row',
        borderWidth:1,
        borderBottomColor:'purple',
        borderColor:'white',
        padding:10,
        marginBottom:10
    },
    time:{
        fontSize:24,
        marginLeft:50,
        color:'purple',
        fontWeight:'bold'
    },
    removewrapper:{
        borderWidth:3,
        borderRadius:10,
        alignItems:'center',
        textAlignVertical:'center',
        borderColor:'purple',
        backgroundColor:'purple',
        width:80,
        height:35,
        marginLeft:40,
    },
    textinput:{
        color:'purple',
        fontSize:14,
        backgroundColor:'white',
        borderRadius:20,
        elevation:10,
        shadowColor:'purple'
    }
})
export default Addtime