import { Image, View, StatusBar } from "react-native";
import React from "react";
import StyleSheet from 'react-native-rem-stylesheet'

const headerHeight = 50

class PageHeader extends React.Component {

  constructor (props) {
    super(props)
  }

  static getHeight () {
    return  {
      fullHeight: headerHeight + StatusBar.currentHeight,
      statisBarHeight: StatusBar.currentHeight
    }
  }

  render () {
    return (
      <View style={styles.headerContainer}>
        <Image
        source={
          __DEV__
              ? require('../../assets/images/logo.png')
              : require('../../assets/images/logo.png')
        }
        style={styles.welcomeImage}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingTop: StatusBar.currentHeight,
    //paddingBottom: 1,
    backgroundColor: '#f8f6eb',
    width: 320,
    //height: headerHeight, //+ StatusBar.currentHeight,
    elevation: 2
  },
  welcomeImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginLeft: 10,
  },
})

export default PageHeader