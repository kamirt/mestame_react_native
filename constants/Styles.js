import StyleSheet from 'react-native-rem-stylesheet'
import Colors from './Colors'

const styles = StyleSheet.create({
  headerText: {
    fontSize: 16,
    color: Colors.headerTextColor
  },
  helpTextDark: {
    fontSize: 10,
    color: Colors.helpTextDark
  },
  helpTextLight: {
    fontSize: 10,
    color: Colors.tabIconDefault
  },
  baseText: {
    fontSize: 11,
    color: Colors.baseTextColor
  },
  baseTextBold: {
    fontSize: 11,
    color: Colors.baseTextColor,
    fontWeight: 'bold'
  },
  rowVerticalCenter: {
    flexDirection: 'row',
    alignItems: 'center'
  }
})

export default styles