import React, { useState } from 'react';
import { Button, Text, View, TextInput, ScrollView, StyleSheet, FlatList, TouchableOpacity } from 'react-native'

const App = () => {
  const [data, setData] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false
  ]);
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
 

  return (

    <View style={{ flex: 1 }}>
      <Text style={{fontSize:30,color:'purple',textAlign:'center'}}>Select Your Time Slot </Text>
      <View style={{ marginTop: 20,marginBottom:40,padding:10 }}>
        <FlatList
          data={data}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                style={{
                  width: '100%',
                  height: 70,
                  borderColor: 'purple',
                  borderWidth: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom:10,
                  borderRadius:100,
                  backgroundColor: item == true ? 'purple' : 'white',
                  shadowColor:'purple',
                  elevation:20
                }}
                onPress={() => {
                  onSelect(index)
                }}>
                <Text style={{
                   fontSize: 30, 
                  color : item == true ? 'white':'purple'
                  }}>{'item ' + (index + 1)}</Text>
              </TouchableOpacity>
            )
          }}
        />
      </View>
    </View>
  )
}

export default App;
