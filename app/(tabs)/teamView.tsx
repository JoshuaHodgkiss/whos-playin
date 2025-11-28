import { MatchBox } from '@/components/match-box';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import Dropdown from '@/components/ui/dropdown';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';

export default function TabTwoScreen() {
  const [team, setTeam] = useState<string | null>(null);


  const options = [
    { label: 'All teams', value: 'all' },
    { label: 'Team A', value: 'a' },
    { label: 'Team B', value: 'b' },
  ];

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <FontAwesome6 size={280} name="shield" color="#808080" style={styles.headerImage} />
      }
      headerContent={
        <Dropdown
          options={options}
          value={team}
          placeholder="Choose a team"
          onChange={(v) => setTeam(v)}
          style={{ marginHorizontal: 20, marginTop: 60,  backgroundColor: '#353636' }}
        />
      }
    >
      <MatchBox />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -40,
    left: -5,
    position: 'absolute',
    zIndex: -1,
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
