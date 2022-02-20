import './App.css';
import { useFilePicker } from 'use-file-picker';
import axios from 'axios';
import { useState } from 'react';

function App() {
  const [isButtonDisabled, changeButtonState] = useState(true);
  const [buttonText, setButtonText] = useState('Processing...');
  const [uploadFile, { filesContent, plainFiles, loading }] = useFilePicker({accept: '.mp3', multiple: false});
  const assembly = axios.create({
    baseURL: "https://api.assemblyai.com/v2",
    headers: {
      authorization: process.env.REACT_APP_API_KEY,
      "content-type": "application/json",
    },
  });
  const timer = ms => new Promise(res => setTimeout(res, ms))

  if (loading) {
    return (<div>Loading...</div>)
  }

  return (
    <div className="App">
      <h1 className='title'>Sum up the key details.</h1>
      <p className='text'>Upload an audio or video file to quickly summarize recordings into auto generated notes.</p>
      <button className="button" onClick={() => uploadFile()}>Upload File</button>
      {filesContent.map((file, index) => (
        <div>
          <br />
          <div key={index}>{file.name}</div>
          <br />
          <button disabled={isButtonDisabled}>{buttonText}</button>
        </div>
      ))}
      {plainFiles.forEach(async (file) => {
        const data = await file.arrayBuffer();
        assembly.post("/upload", data)
                .then((res) => assembly.post("/transcript", {audio_url: res.data["upload_url"]})
                                       .then(async (res) => {
                                         var completed = false;
                                         while (!completed) {
                                           assembly.get("/transcript/" + res.data["id"])
                                                   .then((res) => {if (res.data["status"] === "completed") {
                                                     console.log(res.data["text"]);
                                                     changeButtonState(false);
                                                     setButtonText('Download');
                                                     completed = true;
                                                   }});
                                            await timer(5000);
                                         }
                                       })
                )
        })
      }
    </div>
  );
}

export default App;
