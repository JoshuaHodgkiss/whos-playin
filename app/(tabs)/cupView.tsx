import { MatchBox } from '@/components/match-box';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { MatchData, useGetLeagueData } from '@/services/getData';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { ActivityIndicator, StyleSheet } from 'react-native';

export default function TabTwoScreen() {

  const { premData, loading } = useGetLeagueData();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <FontAwesome6 style={styles.headerImage} size={310} name="trophy" color="#808080" />
      }>
      {
        loading ? <ActivityIndicator /> :
        premData?.map((match: MatchData, index: number) => (
          <MatchBox
            team1Name={match.team1}
            team2Name={match.team2}
            matchTime={match.time}
            matchDate={match.date}
            cupName={match.league}
            key={index} 
          />
        )
      )}
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
