import React, { Component } from 'react'
import { Text, View, TouchableOpacity, StyleSheet, Button, CameraRoll, Image } from 'react-native'
import { Camera, Permissions } from 'expo'
import { Constants, takePictureAsync } from 'expo'

export default class CameraExample extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    takenPhotoUri: null,
  }

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA)
    this.setState({ hasCameraPermission: status === 'granted' })
  }

  render() {
    const { hasCameraPermission } = this.state
    if (hasCameraPermission === null) {
      Permissions.askAsync(Permissions.CAMERA)
      return <View />
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>
    } else {
      return (
        <View
          ref={view => {
            this._container = view
          }}
          style={StyleSheet.absoluteFill}
        >
          <Camera
            style={{ flex: 1 }}
            type={this.state.type}
            ref={ref => {
              this.camera = ref
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row',
              }}
            >
              {this.state.takenPhotoUri && (
                <Image
                  source={{ uri: this.state.takenPhotoUri }}
                  style={{ width: 200, height: 200, backgroundColor: 'black' }}
                />
              )}
              <TouchableOpacity
                style={{
                  flex: 1,
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                }}
                onPress={() => {
                  this.setState({
                    type:
                      this.state.type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back,
                  })
                }}
              >
                <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> Flip </Text>

                <Button
                  style={{ flex: 1, marginBottom: 50, color: 'white' }}
                  onPress={this.takePhoto}
                  title="Sacar foto"
                  color="#841584"
                />
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      )
    }
  }

  takePhoto = async () => {
    if (this.camera) {
      let photo = await this.camera.takePictureAsync()
      //   console.warn(photo.uri)
      alert('Cargando...')
      await CameraRoll.saveToCameraRoll(photo.uri, 'photo')
      this.setState({ takenPhotoUri: photo.uri })
      //   console.warn('fjtfthg', this.state.takenPhotoUri)
    }
  }
}
