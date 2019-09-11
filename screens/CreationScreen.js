import React from 'react'
import {ScrollView, TouchableOpacity, View, Picker} from 'react-native'
import StyleSheet from 'react-native-rem-stylesheet'
import {ListItem, Text, Input, ButtonGroup} from 'react-native-elements'
import ExpandCollapse from '../components/animation/ExpandCollapse'
import PlacesMap from '../components/main/PlacesMap'

import CommonStyles from '../constants/Styles'

export default class LinksScreen extends React.Component {

  static navigationOptions =({ navigation }) => {
    return {
      title: 'Создание события',
    }
  };

  state = {
    fields: [
      {
        id: 'name',
        name: 'Как назовем?',
        empty: true,
        correct: false,
        active: false,
        placeholder: 'Введите название события',
        error: ''
      },
      {
        id: 'category',
        name: 'Категория',
        correct: false,
        active: false,
        empty: true,
        error: ''
      },
      {
        id: 'description',
        name: 'Описание',
        empty: true,
        correct: false,
        active: false,
        error: ''
      },
      {
        id: 'price',
        name: 'Цены',
        empty: true,
        correct: false,
        active: false
      },
      {
        id: 'images',
        name: 'Фотографии и изображения',
        empty: true,
        correct: false,
        active: false
      },
      {
        id: 'startlocation',
        name: 'Где всё будет?',
        empty: true,
        correct: false,
        active: false
      }
    ],
    geofields: [
      {
        id: 'startlocation',
        name: 'Откуда заберем людей?',
        empty: true,
        correct: false,
        active: false,
      },
      {
        id: 'place',
        name: 'Куда направляемся?',
        empty: true,
        correct: false,
        active: false,
      },
      {
        id: 'route',
        name: 'Маршрут путешествия',
        empty: true,
        correct: false,
        active: false
      }
    ],
    mapMode: 'startlocation',
    selectedGeoDialogIndex: 0,
    data: {
      name: null,
      description: null,
      category: null,
      location: null,
      route: null,
      price: null,
      images: null
    }
  }

  render() {

    const getHeaderStyle = (index) => {
      const fields = this.state.fields
      if (fields[index].empty) return styles.emptyHeader
      return fields[index].correct ? styles.corretHeader : styles.wrongHeader
    }

    const getChevron = (index) => {
      return this.state.fields[index].active ? 'chevron-down' : 'chevron-right'
    }

    const getField = (index) => {
      const fn = this[`_get${this.state.fields[index].id}Field`]
      return fn ? fn.call(this, index) : null

    }

    return (
      <ScrollView style={styles.container}>
          <Text>{'Постарайтесь заполнить все поля. Так вы избавите себя от многих вопросов пользователей.'}</Text>
        {this.state.fields.map((el, index) => (<View key={index}>
            <ListItem
              Component={TouchableOpacity}
              leftElement={(<Text>{`${index + 1})`}</Text>)}
              title={(<Text style={{...getHeaderStyle(index), ...styles.headerStyle}}>{el.name}</Text>)}
              onPress={(e) => { this._onItemPress(index) }}
              rightIcon={{name: getChevron(index), type: 'material-community'}}
              />
            <ExpandCollapse
              expanded={el.active}
              style={{ backgroundColor: '#ffffff' }}>
              <View style={{ flexDirection: 'row', paddingLeft: 10, paddingRight: 20 }}>
                <View style={{flex: 1}}>
                  { getField(index) }
                </View>
              </View>
            </ExpandCollapse>
          </View>))}
      </ScrollView>
    );
  }

  _onItemPress (index) {
    let newFields = this.state.fields .slice()
    newFields[index].active = !newFields[index].active
    this.setState({ fields: newFields })
  }

  _getnameField (index) {
    return (
      <Input
        label={this.state.fields[index].placeholder}
        labelStyle={CommonStyles.helpTextLight}
      />
    )
  }

  _getcategoryField (index) {
    return (
      <Picker>
        <Picker.Item label={'Пешие походы'} value={1} />
        <Picker.Item label={'Конные походы'} value={1} />
      </Picker>
    )
  }

  _getpriceField (index) {
    return (
      <Picker>
        <Picker.Item label={'Пешие походы'} value={1} />
        <Picker.Item label={'Конные походы'} value={1} />
      </Picker>
    )
  }

  _getimagesField (index) {
    return (
      <Picker>
        <Picker.Item label={'Пешие походы'} value={1} />
        <Picker.Item label={'Конные походы'} value={1} />
      </Picker>
    )
  }

  _getstartlocationField () {
    const markerPosChange = (e) => {
      console.log('POSITION CHANGE')
    }

    const getGeoDialogButtons = () => {
      if (this.state.mapMode === this.state.geofields[0].id) {
        return ['Далее']
      }
      return ['Назад', 'Далее']
    }

    const changeGeoMode = (index) => {
      this.setState({ selectedGeoDialogIndex: index })
    }

    const geoModes = {
      startlocation: {
        text: 'Удерживайте красный маркер, чтобы переместить его в нужное место на карте'
      },
      place: {
        text: 'Выберите из доступных или создайте новую достопримечательность. Пользователи могут искать по ним Ваше предложение'
      },
      route: {
        text: 'Создайте маршрут, по которому можно будет идти. Позже к точкам маршрута можно будет добавить описания или фото'
      }
    }

    const { selectedGeoDialogIndex } = this.state

    return (
      <View style={styles.mapWrapper}>
        <Text style={CommonStyles.helpTextLight}>{geoModes[this.state.mapMode].text}</Text>
        <PlacesMap mode={ 'setmarker' } onMarkerPositionChange={markerPosChange} />
        <ButtonGroup buttons={getGeoDialogButtons()} onPress={changeGeoMode}></ButtonGroup>
      </View>
    )
  }

  _getdescriptionField (index) {
    return (
      <Picker>
        <Picker.Item label={'Пешие походы'} value={1} />
        <Picker.Item label={'Конные походы'} value={1} />
      </Picker>
    )
  }

  _getrouteField (index) {
    return (
      <Picker>
        <Picker.Item label={'Пешие походы'} value={1} />
        <Picker.Item label={'Конные походы'} value={1} />
      </Picker>
    )
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff'
  },
  headerStyle: {
    fontSize: 14
  },
  emptyHeader: {
    color: 'grey'
  },
  correctHeader: {
    color: 'green'
  },
  wrongHeader: {
    color: 'red'
  },
  mapWrapper: {
    height: 300,
    width: 300
  }
});
