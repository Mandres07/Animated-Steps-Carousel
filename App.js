import { StatusBar } from 'expo-status-bar';
import React, { useRef } from 'react';
import { StyleSheet, Text, View, FlatList, Animated, Image, Dimensions, SafeAreaView, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import DATA from './data';

const { width, height } = Dimensions.get('window');
const IMAGE_SIZE = width * 0.8;
const DOT_SIZE = 7;
const CIRCLE_INITIAL = 70;

const BackImage = ({ scrollX }) => {

   return (
      <View style={{ position: 'absolute', top: 0, alignItems: 'center' }}>
         {DATA.map((item, index) => {
            const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
            const scale = scrollX.interpolate({
               inputRange,
               outputRange: [1.4, 1, 0.6]
            });
            const opacity = scrollX.interpolate({
               inputRange,
               outputRange: [0.5, 1, 0.5]
            });
            const translateX = scrollX.interpolate({
               inputRange,
               outputRange: [width * 1.3, 0, -width * 1.3]
            });
            const translateY = scrollX.interpolate({
               inputRange,
               outputRange: [height, 0, -height]
            });
            return (
               <Animated.View key={item.id} style={{ position: 'absolute', top: 100, opacity, transform: [{ scale }, { translateX }, { translateY }] }}>
                  <Image source={item.image} style={{ width: IMAGE_SIZE, height: IMAGE_SIZE }} />
               </Animated.View>
            );
         })}
      </View>
   );
};

const Pagination = ({ scrollX }) => {
   return (
      <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
         <View style={{ flexDirection: 'row' }}>
            {DATA.map((item, index) => {
               return (
                  <View key={item.id} style={{ backgroundColor: '#cccccf', marginHorizontal: DOT_SIZE / 2, width: DOT_SIZE, height: DOT_SIZE, borderRadius: DOT_SIZE }} />
               );
            })}
         </View>
         <View style={{ position: 'absolute', backgroundColor: 'black', width: DOT_SIZE, height: DOT_SIZE, borderRadius: DOT_SIZE }} />
      </View>
   );
};

const Item = ({ item, scrollX, index }) => {
   const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

   const translateX = scrollX.interpolate({
      inputRange,
      outputRange: [width * 0.3, 0, -width * 0.3]
   });
   const translateXDesc = scrollX.interpolate({
      inputRange,
      outputRange: [width * 0.8, 0, -width * 0.8]
   });

   return (
      <View style={{ width, alignItems: 'center' }}>
         <Animated.View style={{ marginHorizontal: 30, transform: [{ translateX }] }}>
            <Text style={{ fontSize: 28, fontWeight: 'bold' }}>{item.title}</Text>
         </Animated.View>
         <Animated.View style={{ marginTop: 15, marginHorizontal: 60, transform: [{ translateX: translateXDesc }] }}>
            <Text style={{ fontSize: 15, fontWeight: '300', textAlign: 'center', lineHeight: 22 }}>{item.description}</Text>
         </Animated.View>
      </View>
   );
};

const Arrows = ({ scrollX, index }) => {
   return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', position: 'absolute', bottom: 80, width, paddingHorizontal: 50 }}>
         <View>
            <TouchableOpacity>
               <AntDesign name="arrowleft" size={30} color="black" />
            </TouchableOpacity>
         </View>
         <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ position: 'absolute', backgroundColor: 'gold', width: CIRCLE_INITIAL, height: CIRCLE_INITIAL, borderRadius: CIRCLE_INITIAL / 2 }} />
            <TouchableOpacity>
               <AntDesign name="arrowright" size={30} color="black" />
            </TouchableOpacity>
         </View>
      </View>
   );
};

export default App = () => {
   const scrollX = useRef(new Animated.Value(0)).current;
   return (
      <View style={styles.container}>
         <StatusBar style="auto" />
         <BackImage scrollX={scrollX} />
         <View style={{ alignItems: 'center', justifyContent: 'flex-start', position: 'absolute', top: height / 2, height: height / 2 }}>
            <Pagination />
            <Animated.FlatList keyExtractor={item => item.id} data={DATA} pagingEnabled horizontal bounces={false} showsHorizontalScrollIndicator={false} style={{ marginTop: 30 }}
               onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: true })} scrollEventThrottle={16}
               renderItem={({ item, index }) => {
                  return (
                     <Item key={item.id} item={item} scrollX={scrollX} index={index} />
                  );
               }} />
            <Arrows />
         </View>
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
   },
});
