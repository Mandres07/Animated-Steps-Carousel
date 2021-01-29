import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Animated, Image, Dimensions, SafeAreaView, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import DATA from './data';

const { width, height } = Dimensions.get('window');
const IMAGE_SIZE = width * 0.8;
const DOT_SIZE = 7;
const CIRCLE_INITIAL = 70;

const BackImage = ({ scrollX }) => {

   return (
      <View style={{ zIndex: 3, position: 'absolute', top: 0, alignItems: 'center' }}>
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
   const index = Animated.modulo(Animated.divide(scrollX, width), width);
   const inputRange = [0, 1, 2];

   const dotWidth = index.interpolate({
      inputRange,
      outputRange: [DOT_SIZE, DOT_SIZE * 3, DOT_SIZE * 5],
   });

   const translateX = index.interpolate({
      inputRange,
      outputRange: [-DOT_SIZE * 2, -DOT_SIZE, 0],
   });

   return (
      <View style={{ zIndex: 2, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
         <View style={{ flexDirection: 'row' }}>
            {DATA.map((item, index) => {
               return (
                  <View key={item.id} style={{ backgroundColor: '#cccccf', marginHorizontal: DOT_SIZE / 2, width: DOT_SIZE, height: DOT_SIZE, borderRadius: DOT_SIZE }} />
               );
            })}
         </View>
         <Animated.View style={{ position: 'absolute', backgroundColor: 'black', width: dotWidth, height: DOT_SIZE, borderRadius: DOT_SIZE, transform: [{ translateX }] }} />
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

export default App = () => {
   const scrollX = useRef(new Animated.Value(0)).current;
   const [index, setIndex] = useState(0);
   const ref = useRef();

   const onBackward = () => {
      ref?.current?.scrollToOffset({
         offset: (index - 1) * width,
         animated: true
      });
   };
   const onForward = () => {
      ref?.current?.scrollToOffset({
         offset: (index + 1) * width,
         animated: true
      });
   };

   return (
      <View style={{ ...styles.container }}>
         <StatusBar style="auto" />
         <BackImage scrollX={scrollX} />
         <View style={{ alignItems: 'center', position: 'absolute', top: height / 2, height: height / 2 }}>
            <Pagination scrollX={scrollX} />
            <View style={{ flex: 1, zIndex: 5 }}>
               <Animated.FlatList ref={ref} style={{ marginTop: 30, }} keyExtractor={item => item.id} data={DATA} pagingEnabled horizontal bounces={false} showsHorizontalScrollIndicator={false}
                  onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
                  onMomentumScrollEnd={ev => {
                     const newIndex = Math.floor(ev.nativeEvent.contentOffset.x / width);
                     setIndex(newIndex);
                  }}
                  renderItem={({ item, index }) => {
                     return (
                        <Item key={item.id} item={item} scrollX={scrollX} index={index} />
                     );
                  }} />
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
               <View style={{ flexDirection: 'row', justifyContent: 'space-between', position: 'absolute', bottom: 80, width, paddingHorizontal: 50 }}>
                  <View style={{ zIndex: 4 }}>
                     <TouchableOpacity disabled={index === 0} style={{ opacity: index === 0 ? 0 : 1 }} onPress={onBackward}>
                        <AntDesign name="arrowleft" size={30} color="black" />
                     </TouchableOpacity>
                  </View>
                  <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                     {DATA.map((item, activeIndex) => {
                        const inputRange = [(activeIndex - 2) * width, (activeIndex - 1) * width, activeIndex * width, (activeIndex + 1) * width, (activeIndex + 2) * width];
                        const scale = scrollX.interpolate({
                           inputRange,
                           outputRange: [1, 1, 1, 25, 25]
                        });
                        const opacity = scrollX.interpolate({
                           inputRange,
                           outputRange: [0, 0, 1, 1, 0]
                        });

                        return (
                           <Animated.View key={activeIndex + 'circle'}
                              style={{
                                 transform: [{ scale }], position: 'absolute', backgroundColor: activeIndex % 2 === 0 ? 'gold' : 'white', opacity,
                                 width: CIRCLE_INITIAL, height: CIRCLE_INITIAL, borderRadius: CIRCLE_INITIAL / 2
                              }}
                           />
                        );
                     })}
                     <TouchableOpacity onPress={onForward}>
                        <AntDesign name="arrowright" size={30} color="black" />
                     </TouchableOpacity>
                  </View>
               </View>
            </View>
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
