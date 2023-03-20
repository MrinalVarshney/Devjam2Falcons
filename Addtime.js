import {useState,useEffect} from 'react'
import {View,Text,FlatList, StyleSheet,TouchableOpacity,TextInput,Dimensions, Alert,Button} from 'react-native'
import { openDatabase } from 'react-native-sqlite-storage'
import DateTimePickerModal from "react-native-modal-datetime-picker";


var db = openDatabase({ name: 'SetOffb1.db' });

const Addtime=({navigation})=>{
    
    const [Hope,setHope] = useState([{}]);
    const [Visible,setVisible]=useState(false);
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    var day=today.split(",")[0]

    const showTimePicker = () => {
            setVisible(true);
    };
    
      const hideTimePicker = () => {
        setVisible(false);
      };

    const handleConfirm = date => {
        const dt= new Date(date);
        const x=dt.toLocaleTimeString().split(' ');
        const y=x[0].split(':')
        {(parseInt(y[1])<=9)?
            y[1]='0'+y[1]:null
        }
        console.log(parseInt(y[1]))
        db.transaction(function(tx){
                    tx.executeSql('INSERT INTO Timings (hour,min,ampm,Duration) VALUES(?,?,?,?)',[y[0],y[1],x[1],1],
                    function(tx,res){
                        tx.executeSql('SELECT * FROM Timings',[],
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
    const handleRemove=(id,items)=>{
        db.transaction(function(tx){
            tx.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='"+day+"'",[],
                        function (tex, res) {
                            tex.executeSql('SELECT * FROM '+day+' WHERE status=?',[1],
                                function(tx,rx){
                                    console.log(rx.rows.length)
                                    var t3=[{}]
                                    for(let i=0;i<rx.rows.length;i++){
                                        t3.push(rx.rows.item(i))
                                    }
                                    t3.map((itm,ind)=>{
                                        if(items.hour == itm.hour && items.min==itm.min && items.ampm==itm.ampm){
                                            tx.executeSql('DELETE FROM '+day+' where sno=?',[itm.sno])
                                        }
                                    })        
                                }

                        )})
            tx.executeSql('DELETE FROM Timings where sno=?',[id])
            tx.executeSql('SELECT * FROM Timings',[],
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
    const handleDuration=(id,num)=>{
            db.transaction(function(tx){
                tx.executeSql('UPDATE Timings set Duration=? where sno=?',[num,id]);
                tx.executeSql('SELECT * FROM Timings WHERE sno=?',[id],
                function(tx,res){
                    console.log(res.rows.item(0))
                })
            })

    }
    
    const width=Dimensions.get('window')
    useEffect(()=>{
        db.transaction(function(txn){
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='Timings'",
                [],
                function (tx, res) {
                  console.log('item:', res);
                  if (res.rows.length == 0) {
                    txn.executeSql('DROP TABLE IF EXISTS Timings', []);
                    txn.executeSql(
                      'CREATE TABLE IF NOT EXISTS Timings(sno INTEGER PRIMARY KEY AUTOINCREMENT, hour INTEGER , min INTEGER , ampm VARCHAR(20),Duration INTEGER)',
                      []
                    );
                    }
                    else{
                        txn.executeSql('SELECT * FROM Timings',[],
                        function(tx,rx){
                            var t=[];
                            for(let i=0;i<rx.rows.length;i++){
                                console.log(rx.rows.item(i));
                                t.push(rx.rows.item(i));
                            }
                            setHope(t)
                        })
                        txn.executeSql('SELECT Duration FROM Timings',[],
                        function(tx,rx){
                            var t=[];
                            for(let i=0;i<rx.rows.length;i++){
                                console.log(rx.rows.item(i));
                                t.push(rx.rows.item(i));
                            }
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
                                    {item.min<=9?
                                    <Text style={styles.time}>{item.hour}:0{item.min} {item.ampm}</Text>:
                                    <Text style={styles.time}>{item.hour}:{item.min} {item.ampm}</Text>
                                    }
                                <View style={{flexDirection:'row'}}>
                                    <View style={{flex:1}}>
                                        <View style={{flex:1 , flexDirection:'row'}}>
                                            <View style={{flex:1}}>
                                            
                                                <TouchableOpacity onPress={()=>(handleDuration(item.sno,1))}>
                                                {item.Duration==1?
                                                        <Text style={styles.onpresshoursbtn}></Text>:
                                                        <Text style={styles.hoursbtn}></Text>
                                                }           
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{flex:2}}>
                                                <Text style={styles.hourtext}>1hr</Text>
                                            </View>
                                            <View style={{flex:1}}>
                                            <TouchableOpacity onPress={()=>(handleDuration(item.sno,2))}>
                                                {item.Duration==2?
                                                        <Text style={styles.onpresshoursbtn}></Text>:
                                                        <Text style={styles.hoursbtn}></Text>
                                                }
                                                </TouchableOpacity>
                                            </View><View style={{flex:2}}>
                                                <Text style={styles.hourtext}>2hr</Text>
                                            </View>
                                            <View style={{flex:1}}>
                                            <TouchableOpacity onPress={()=>(handleDuration(item.sno,3))}>
                                                {item.Duration==3?
                                                        <Text style={styles.onpresshoursbtn}></Text>:
                                                        <Text style={styles.hoursbtn}></Text>
                                                }
                                                </TouchableOpacity>
                                            </View><View style={{flex:2}}>
                                                <Text style={styles.hourtext}>3hr</Text>
                                            </View>
                                            <View style={{flex:1}}>
                                            <TouchableOpacity onPress={()=>(handleDuration(item.sno,4))}>
                                                {item.Duration==4?
                                                        <Text style={styles.onpresshoursbtn}></Text>:
                                                        <Text style={styles.hoursbtn}></Text>
                                                }
                                                </TouchableOpacity>
                                            </View><View style={{flex:2}}>
                                                <Text style={styles.hourtext}>4hr</Text>
                                            </View>
                                            </View>
                                            
                                    </View>
                                </View>    
 
                        </View>
                        <View style={{flex:1,justifyContent:'center',alignItems:'flex-end'}}>
                        <TouchableOpacity onPress={()=>handleRemove(item.sno,item)}>
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
                <View style={{flex:1}}>
                <TouchableOpacity onPress={showTimePicker}>
                    <View style={styles.addbtn}>
                        <Text style={styles.addbtnfont}>+</Text>
                    </View>
                </TouchableOpacity>
                </View>
                <View style={{flex:1}}>
                <TouchableOpacity onPress={()=>{navigation.navigate("DayScreen")}}>
                    <View style={styles.addbtn}>
                        <Text style={styles.next}>Next</Text>
                    </View>
                </TouchableOpacity>
                </View>
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
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    },
    addbtn:{
        alignContent:'flex-end',
        alignItems:'center'
    },
    addbtnfont:{
        fontSize:30,
        color:'purple'
    },
    next:{
        fontSize:20,
        color:'purple',
        borderWidth:3,
        padding:3,
        borderColor:'purple',
        borderRadius:15
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
        marginLeft:'10%',
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
        fontSize:13,
        backgroundColor:'white',
        borderRadius:20,
        elevation:10,
        shadowColor:'purple'
    },
    onpresshoursbtn:{
        backgroundColor:'purple',
        borderRadius:25
    },
    hoursbtn:{
        borderWidth:2,
        borderColor:'purple',
        borderRadius:10
    },
    hourtext:{
        fontSize:16,
        fontWeight:'bold',
        color:'purple'
    }
})
export default Addtime