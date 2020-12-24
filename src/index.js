/**
 * @class Recorder
 */

import React, { useState, useEffect } from 'react'

import vmsg from './vmsg'

import micIcon from './mic-icon-white.svg'

import wasmURL from './vmsg.wasm'

const shimURL = 'https://unpkg.com/wasm-polyfill.js@0.2.0/wasm-polyfill.js'

export default function Recorder({onRecordingStarted, onRecordingComplete, onRecordingError}) { // ...recorderParams) {

  const [isRecording, setIsRecording] = useState(false);
  const [audio, setAudio] = useState(null);
  const [recorder, setRecorder] = useState(null);

  const cleanup = () => {
    if(recorder) {
      recorder.stopRecording();
      recorder.close();
      setRecorder(null)
    }
  }

  useEffect(() => {
    if(isRecording === true) {
      if (onRecordingStarted) {
        onRecordingStarted();
      }
    }
  }, [isRecording])

  useEffect(() => {
    if(recorder && recorder !== null) {

      recorder.init()
      .then(() => {
        recorder.startRecording();
        setIsRecording(true);
      })
      .catch((err) => {
        onRecordingError(err);
      });

    }
  }, [recorder])

  const updateRecording = () => {
    if(isRecording == false) {
      setIsRecording(true);
      cleanup();

      setRecorder(new vmsg.Recorder({
        wasmURL,
        shimURL,
       //...recorderParams
      }));

    } else {
      setIsRecording(false);
      recorder.stopRecording()
      .then((blob) => onRecordingComplete(blob))
      .catch((err) => onRecordingError(err));

    }
  }

  const buildInterface = () => {
    if(isRecording == false) {
      return (
        <div style={{padding: 10, width: 50, height: 50, borderRadius: 100, display: 'flex', alignItems: 'center', justifyContents: 'center', backgroundColor: 'blue'}}>
          <img style={{transform: 'rotate(180deg)'}} src={micIcon} width={24} height={24} />
        </div>
      );
    } else {
      return (
        <div style={{padding: 10, width: 50, height: 50, borderRadius: 100, display: 'flex', alignItems: 'center', justifyContents: 'center', backgroundColor: 'blue'}}>
          <img src={micIcon} width={24} height={24} />
        </div>
      );
    }
  }

  return (
    <div
      onClick={updateRecording}
    >
      {buildInterface()}
    </div>
  )
}
