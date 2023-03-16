
import {Text,View,StyleSheet,TouchableOpacity,FlatList,ScrollView} from 'react-native'
const DayScreen=()=>{
    const days = [
        {day:"Monday"},{day:"Tuesday"},{day:"Wednesday"},{day:"Thursday"},{day:"Friday"},{day:"Saturday"},{day:"Sunday"}
    ]
    return(
        <View>
            <FlatList data={days} renderItem={({item})=>
            <View style={styles.container}>
                <View style={styles.daywrap}>
                <Text style={styles.day}>{item.day}</Text>
                </View>
                <View style={styles.daybtnwrapper}>
                    <TouchableOpacity>
                        <Text style={styles.daybtntext}>Set Timings</Text>
                </TouchableOpacity>
                </View>
            </View>
        }/>
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
    }
})
export default DayScreen
