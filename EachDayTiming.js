import React, { useState,useEffect } from 'react';
import { Button, Text, View, TextInput, ScrollView, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { openDatabase } from 'react-native-sqlite-storage';


var db = openDatabase({ name: 'SetOffb1.db' });
const EachDayTiming = ({route,navigation}) => {
  const {day} = route.params;
  const [data, setData] = useState([]);
  const [timings,settimings]=useState([{}]);
  const x=JSON.stringify(day)
  const y=x.split('"');
  const dayname=y[1] 
  const data1=timings.map((item,index)=>({key:index.toString(),item,status:data[index]}))

  const onSelect = ind => {
    const tempData = [];
      data.map((item, index) => {
        if (index == ind) {
          if(item==true){
            tempData.push(false)
          }
          else{
            tempData.push(true)
          }
        }
        else {
          if(item==true){
            tempData.push(true)
          }
          else{
            tempData.push(false)
          }
        }
    });

    setData(tempData);
  };
var t3=[{}]
var t4=[{}]
const handleSave=()=>{

  console.log(dayname)
  db.transaction(function(txn){
    txn.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='"+dayname+"'",[],
      function(tx,res){
          tx.executeSql('DELETE FROM '+dayname,[]);

          data.map((item,index)=>{
            if(item==true){
              console.log(item);
              timings.map((itm,ind)=>{

                if(index == ind){
                  console.log('Matched')
                  tx.executeSql('INSERT INTO '+dayname+ '(hour,min,ampm,Duration,status) VALUES(?,?,?,?,?)',[itm.hour,itm.min,itm.ampm,itm.Duration,true],
                  function(tex,rex){
                    console.log(rex)
                    tex.executeSql('SELECT * FROM '+dayname,[],
                    function(tx,res){
                      console.log(res.rows.length)
                      for(let i=0;i<res.rows.length;i++){
                        console.log(res.rows.item(i))
                        t3.push(res.rows.item(i))
                      }
                    })
                      
                  })
                }

              })
          }
          else{
            tx.executeSql('INSERT INTO '+dayname+ '(hour,min,ampm,Duration,status) VALUES(?,?,?,?,?)',[0,0,0,0,false],
            );}})
        
        })
      })
      navigation.navigate("DayScreen")
  
}  

useEffect(()=>{

  db.transaction(function(txn){
    var len1;
    var len2;
    txn.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='Timings'",
      [],function(tx,res){
        tx.executeSql('SELECT * FROM Timings',[],
        function(tex,rx){
          var t1=[];
          var t2=[];
          len1=rx.rows.length
            for(let i=0;i<rx.rows.length;i++){
              t2.push(rx.rows.item(i))
              t1.push(false)
              t4.push(rx.rows.item(i))
            }
            setData(t1);
            settimings(t2);
        })
      }
    )
    txn.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='"+dayname+"'",[],
      function(tx,res){
        tx.executeSql('SELECT * FROM '+dayname,[],
        function(tx,res){
          len2=res.rows.length
          console.log('Hii',res.rows.length)
        if(res.rows.length>0){ 
          for(let i=0;i<res.rows.length;i++){
            t3.push(res.rows.item(i))
            console.log(res.rows.item(i))
          }
          var t1=[]
          
          t3.map((items,index)=>{
            if(index>0){
              var count=0
              t4.map((itm,ind)=>{
                ind>0?
                console.log('t4',itm.hour):null
                if(items.hour == itm.hour && items.min==itm.min && items.ampm==itm.ampm){
                  count=1
                  console.log('yy',count)
                  if(items.status==0){t1.push(false)}
                  else{t1.push(true)}
                }
              })
              if(count==0 && index<=len1){
                t1.push(false)
                console.log('false','len1',len1)
              }
            }
          })
          for(let i=len2;i<len1;i++){
            t1.push(false)
          }

          setData(t1)
       } })  
      })
  })
},[])



  return (

    <View style={{ flex: 1 ,flexDirection:'column'}}>
      <View style={{flex:1}}>
      <Text style={{fontSize:30,color:'purple',textAlign:'center'}}>Select Your Time Slot For {JSON.stringify(day)} </Text>
      </View>
      <View style={{ marginTop: 20,marginBottom:40,padding:10 ,flex:6}}>
        <View style={{flexDirection:'row'}}>
          <View style={{flex:3,padding:3}}>
          <FlatList
          data={timings}
          renderItem={({item,index}) => {
            return (
              <TouchableOpacity
                style={{
                  width: '100%',
                  height: 70, 
                  borderColor: 'purple',
                  borderWidth: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom:20,
                  borderRadius:100,
                  backgroundColor: item == true ? 'purple' : 'white',
                  shadowColor:'purple',
                  elevation:20
                }}
                onPress={() => {
                  onSelect(index)
                }}>
                  {
                  item.min<=9?
                    <Text style={{fontSize: 24,color : item == true ? 'white':'purple'}}>
                      {item.hour}:0{item.min} {item.Duration}:{item.min} {item.ampm}</Text>:
                    <Text style={{fontSize: 24,color : item == true ? 'white':'purple'}}>
                      {item.hour}:{item.min}-{item.hour+item.Duration}:{item.min} {item.ampm}</Text>
                }
              </TouchableOpacity>
            )
          }}
        />
          </View>
          
        <FlatList
          data={data}
          renderItem={({item,index}) => {
            return (
              <TouchableOpacity
                style={{
                  width: '100%',
                  height: 70, 
                  borderColor: 'purple',
                  borderWidth: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom:20,
                  borderRadius:100,
                  backgroundColor: item == true ? 'purple' : 'white',
                  shadowColor:'purple',
                  elevation:20
                }}
                onPress={() => {
                  onSelect(index)
                }}>
                  {
                  item?
                    <Text style={{fontSize: 23,color : item == true ? 'white':'purple'}}>
                      Selected</Text>:
                    <Text style={{fontSize: 23,color : item == true ? 'white':'purple'}}>
                      Select</Text>
                }
              </TouchableOpacity>
            )
          }}
        />
        </View>
      </View>
      <View style={{flex:0.7,flexDirection:'row',justifyContent:'flex-end'}}>
        <TouchableOpacity onPress={handleSave}>
          <View>
          <Text style={styles.donebtn}>Done</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}
const styles=StyleSheet.create({
  donebtn:{
    color:'purple',
    borderWidth:3,
    borderBottomColor:'purple',
    borderColor:'purple',
    borderRadius:20,
    padding:5,
    fontSize:20,

  }
})
export default EachDayTiming