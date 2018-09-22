import React, { Component } from 'react'
import { Text, View, TouchableOpacity, StyleSheet, Button, CameraRoll, Image } from 'react-native'
import { Camera, Permissions } from 'expo'
import { Constants, takePictureAsync } from 'expo'
import { Ionicons } from '@expo/vector-icons'

export default class CameraExample extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    // takenPhotoUri: null,
    takenPhotoUri: 'https://facebook.github.io/react-native/docs/assets/favicon.png',
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
          style={[StyleSheet.absoluteFill, styles.mainFrame]}
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
                <Image source={{ uri: this.state.takenPhotoUri }} style={styles.imagePreview} />
              )}

              <TouchableOpacity
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons
                  style={styles.actionButton}
                  name="md-refresh-circle"
                  size={32}
                  onPress={() => {
                    this.setState({
                      type:
                        this.state.type === Camera.Constants.Type.back
                          ? Camera.Constants.Type.front
                          : Camera.Constants.Type.back,
                    })
                  }}
                />
                <Ionicons style={styles.actionButton} name="md-camera" size={32} onPress={this.takePhoto} />
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
      //   await CameraRoll.saveToCameraRoll(photo.uri, 'photo')
      this.setState({ takenPhotoUri: photo.uri })
      //   console.warn('fjtfthg', this.state.takenPhotoUri)
    }
  }
}

const styles = StyleSheet.create({
  actionButton: {
    padding: 10,
    fontSize: 50,
    color: '#fff',
  },
  imagePreview: {
    position: 'absolute',
    width: 100,
    height: 100,
    backgroundColor: 'black',
  },
  mainFrame: {
    paddingTop: 20,
  },
})
