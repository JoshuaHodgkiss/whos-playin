import { StyleSheet } from 'react-native';

import { MatchBox } from '@/components/match-box';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <FontAwesome6 size={310} name="trophy" color="#808080" style={styles.headerImage}/>
      }>
      <MatchBox/>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
