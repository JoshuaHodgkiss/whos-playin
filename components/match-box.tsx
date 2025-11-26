import { useThemeColor } from '@/hooks/use-theme-color';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

export type MatchBoxProps = {
  lightColor?: string;
  darkColor?: string;
  cupName?: string;
  team1Name?: string;
  team1ImageStr?: string;
  team2Name?: string;
  team2ImageStr?: string;
  matchTime?: string;
  matchDate?: string;
};

export function MatchBox({ lightColor, darkColor, ...otherProps }: MatchBoxProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  

  return ( 
    <ThemedView style={styles.container} {...otherProps}>
      <ThemedText style={styles.cupName}>Cup Name</ThemedText>
      <View style={styles.teamsContainer}>
        <View >
          <FontAwesome6 size={40} name="shield" color={'#D0D0D0'} />
          <ThemedText>Team 1</ThemedText>
        </View> 
        <View style={styles.versus}>
          <ThemedText>Time</ThemedText>
          <Entypo size={24} name="new" color={'#D0D0D0'} />
          <ThemedText>Date</ThemedText>
        </View> 
        <View>
          <FontAwesome6 size={40} name="shield" color={'#D0D0D0'} />
          <ThemedText>Team 2</ThemedText>
        </View> 
      </View>
    </ThemedView> 
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#cececeff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  cupName: {
    width: '100%',
    paddingBottom: 8,
  },
  teamsContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  team1: {

  },
  versus: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  team2: {

  },
});
