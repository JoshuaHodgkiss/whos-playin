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

export function MatchBox({
  team1Name = 'Team 1', 
  team2Name = 'Team 2', 
  matchTime = 'Time',
  matchDate = 'Date',
  cupName = 'Cup Name',
  lightColor, 
  darkColor, 
  ...otherProps }: MatchBoxProps) {

  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');  

  return ( 
    <ThemedView style={styles.container} {...otherProps}>
      <ThemedText style={styles.cupName}>{cupName}</ThemedText>
      <View style={styles.teamsContainer}>
        <View style={styles.team}>
          <FontAwesome6 size={40} name="shield" color={'#D0D0D0'} />
          <ThemedText>{team1Name}</ThemedText>
        </View> 
        <View style={styles.versus}>          
          <Entypo size={24} name="new" color={'#D0D0D0'} />          
        </View> 
        <View style={[styles.team, styles.team2]}>
          <FontAwesome6 size={40} name="shield" color={'#D0D0D0'} />
          <ThemedText>{team2Name}</ThemedText>
        </View> 
      </View>
      <View style={{display:'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
        <ThemedText>{matchDate}</ThemedText>
        <ThemedText>{matchTime}</ThemedText>
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
  team: {
    width: '45%'
  },
  versus: {
    width: '10%',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  team2: {
    alignItems: 'flex-end'
  },
});
