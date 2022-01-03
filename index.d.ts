declare module "react-native-audio" {

  export type AudioEncodingAndroidType = 'aac_eld' | 'amr_nb' | 'amr_wb' | 'he_aac' | 'vorbis';

  export type AudioEncodingIOSType = 'lpcm' | 'ima4' | 'MAC3' | 'MAC6' | 'ulaw' | 'alaw' | 'mp1' | 'mp2' | 'alac' | 'amr';

  export type AudioEncodingType = 'aac' | AudioEncodingIOSType | AudioEncodingAndroidType;


  export interface IRecordingOptions {
    SampleRate?: number;
    Channels?: number;
    AudioQuality?: 'Low' | 'Medium' | 'High';
    AudioEncoding?: AudioEncodingType;
    OutputFormat?: string;
    MeteringEnabled?: boolean;
    MeasurementMode?: boolean;
    AudioEncodingBitRate?: number;
    IncludeBase64?: boolean;
    AudioSource?: number;
  }

  export const AudioRecorder: {
    requestAuthorization(): Promise<boolean>;
    prepareRecordingAtPath(path: string, options: IRecordingOptions): Promise<string>;
    startRecording(): Promise<string>;
    stopRecording(): Promise<string>;
    resumeRecording(): Promise<string>;
    pauseRecording(): Promise<string>;
    checkAuthorizationStatus(): Promise<boolean>;
    onProgress(res: { currentTime: number }): void;
    onFinished(res: { audioFileURL: string, base64: string, status: string }): void;
  }
  
  export const AudioUtils: {
    CachesDirectoryPath: () => string;
    DocumentDirectoryPath: () => string;
    LibraryDirectoryPathIOS: () => string;
    MainBundlePathIOS: () => string;
    DownloadsDirectoryPathAndroid: () => string;
    MusicDirectoryPathAndroid: () => string;
    PicturesDirectoryPathAndroid: () => string;
  };

  export enum AudioSource {
    DEFAULT = 0,
    MIC = 1,
    VOICE_UPLINK = 2,
    VOICE_DOWNLINK = 3,
    VOICE_CALL = 4,
    CAMCORDER = 5,
    VOICE_RECOGNITION = 6,
    VOICE_COMMUNICATION = 7,
    REMOTE_SUBMIX = 8, // added in API 19
    UNPROCESSED = 9, // added in API 24
  };

}