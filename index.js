'use strict';

import {
  NativeModules,
  NativeAppEventEmitter,
  PermissionsAndroid,
  Platform
} from "react-native";

var AudioRecorderManager = NativeModules.AudioRecorderManager;

var AudioRecorder = {
  prepareRecordingAtPath: function(path, options) {
    if (this.progressSubscription) this.progressSubscription.remove();
    this.progressSubscription = NativeAppEventEmitter.addListener('recordingProgress',
      (data) => {
        if (this.onProgress) {
          this.onProgress(data);
        }
      }
    );

    if (this.finishedSubscription) this.finishedSubscription.remove();
    this.finishedSubscription = NativeAppEventEmitter.addListener('recordingFinished',
      (data) => {
        if (this.onFinished) {
          this.onFinished(data);
        }
      }
    );

    var defaultOptions = {
      SampleRate: 44100.0,
      Channels: 2,
      AudioQuality: 'High',
      AudioEncoding: 'ima4',
      OutputFormat: 'mpeg_4',
      MeteringEnabled: false,
      MeasurementMode: false,
      AudioEncodingBitRate: 32000,
      IncludeBase64: false,
      AudioSource: 0
    };

    var recordingOptions = {...defaultOptions, ...options};

    if (Platform.OS === 'ios') {
      AudioRecorderManager.prepareRecordingAtPath(
        path,
        recordingOptions.SampleRate,
        recordingOptions.Channels,
        recordingOptions.AudioQuality,
        recordingOptions.AudioEncoding,
        recordingOptions.MeteringEnabled,
        recordingOptions.MeasurementMode,
        recordingOptions.IncludeBase64
      );
    } else {
      return AudioRecorderManager.prepareRecordingAtPath(path, recordingOptions);
    }
  },
  startRecording: function() {
    return AudioRecorderManager.startRecording();
  },
  pauseRecording: function() {
    return AudioRecorderManager.pauseRecording();
  },
  resumeRecording: function() {
    return AudioRecorderManager.resumeRecording();
  },
  stopRecording: function() {
    return AudioRecorderManager.stopRecording();
  },
  checkAuthorizationStatus: function() {
    return AudioRecorderManager.checkAuthorizationStatus();
  },
  requestAuthorization: () => {
    if (Platform.OS === 'ios')
      return AudioRecorderManager.requestAuthorization();
    else
      return new Promise((resolve, reject) => {
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
        ).then(result => {
          if (result == PermissionsAndroid.RESULTS.GRANTED || result == true)
            resolve(true);
          else
            resolve(false)
        })
      });
  },
  removeListeners: function() {
    if (this.progressSubscription) this.progressSubscription.remove();
    if (this.finishedSubscription) this.finishedSubscription.remove();
  },
};

let AudioUtils = {};

if (Platform.OS === 'ios') {
  AudioUtils = {
    MainBundlePathIOS: () => AudioRecorderManager.MainBundlePath,
    CachesDirectoryPath: () => AudioRecorderManager.NSCachesDirectoryPath,
    DocumentDirectoryPath: () => AudioRecorderManager.NSDocumentDirectoryPath,
    LibraryDirectoryPathIOS: () => AudioRecorderManager.NSLibraryDirectoryPath,
  };
} else if (Platform.OS === 'android') {
  AudioUtils = {
    CachesDirectoryPath: () => AudioRecorderManager.CachesDirectoryPath,
    DocumentDirectoryPath: () => AudioRecorderManager.DocumentDirectoryPath,
    PicturesDirectoryPathAndroid: () => AudioRecorderManager.PicturesDirectoryPath,
    MusicDirectoryPathAndroid: () => AudioRecorderManager.MusicDirectoryPath,
    DownloadsDirectoryPathAndroid: () => AudioRecorderManager.DownloadsDirectoryPath
  };
}

var AudioSource;
(function (AudioSource) {
  AudioSource["DEFAULT"] = 0;
  AudioSource["MIC"] = 1;
  AudioSource["VOICE_UPLINK"] = 2;
  AudioSource["VOICE_DOWNLINK"] = 3;
  AudioSource["VOICE_CALL"] = 4;
  AudioSource["CAMCORDER"] = 5;
  AudioSource["VOICE_RECOGNITION"] = 6;
  AudioSource["VOICE_COMMUNICATION"] = 7;
  AudioSource["REMOTE_SUBMIX"] = 8;
  AudioSource["UNPROCESSED"] = 9;
})(AudioSource || (AudioSource = {}));

module.exports = {AudioRecorder, AudioUtils, AudioSource};
