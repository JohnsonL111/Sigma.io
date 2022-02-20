import './App.css';
import { useFilePicker } from 'use-file-picker';
import axios from 'axios';
import { useEffect, useState } from 'react';

var hasUploaded = false;

function downloadTxt(text) {
  const element = document.createElement("a");
  const file = new Blob([text], { type: 'text/plain' });
  element.href = URL.createObjectURL(file);
  element.download = "summary.txt";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

function App() {
  const [isDownloadDisabled, changeDownloadState] = useState(true);
  const [isUploadDisabled, changeUploadState] = useState(false);
  const [buttonText, setDownloadText] = useState('Processing...');
  const [summary, setSummary] = useState('');
  const [uploadFile, { filesContent, plainFiles, loading }] = useFilePicker({ accept: ['.mp3', '.ogg', '.wav', '.webm', '.mov', '.mp4'], multiple: false });
  const assembly = axios.create({
    baseURL: "https://api.assemblyai.com/v2",
    headers: {
      authorization: process.env.REACT_APP_API_KEY,
      "content-type": "application/json",
    },
  });
  const timer = ms => new Promise(res => setTimeout(res, ms))

  const getAllSummaries = (data) => {
    var temp = ''
    for (var chapter of data) {
      temp += chapter.summary
      temp += '\n\n'
    }
    return temp
  }

  useEffect(function () {
    {
      plainFiles.forEach(async (file) => {
        if (!hasUploaded) {
          hasUploaded = true;
          changeDownloadState(true);
          changeUploadState(true);
          setDownloadText('Processing...')
          const data = await file.arrayBuffer();
          assembly.post("/upload", data)
            .then((res) => assembly.post("/transcript", { audio_url: res.data["upload_url"], auto_chapters: true})
              .then(async (res) => {
                var completed = false;
                while (!completed) {
                  assembly.get("/transcript/" + res.data["id"])
                    .then((res) => {
                      if (res.data["status"] === "completed") {   
                        console.log(res.data)
                        console.log(res.data.chapters)
 
                        changeDownloadState(false);
                        changeUploadState(false);
                        setDownloadText('Download');
                        setSummary(getAllSummaries(res.data.chapters));
                        completed = true;
                        hasUploaded = false;
                      }
                    });
                  await timer(5000);
                }
              })
            )
        }
      })
    }
  }, [uploadFile]);

  if (loading) {
    return (
      <div className="App">
        <h1 className='title'>Sum up the key details.</h1>
        <p className='text'>Upload an audio or video file to easily summarize recordings into auto generated notes.</p>
        <button className="button" disabled={isUploadDisabled} onClick={() => uploadFile()}>Upload File</button>
        <br />
        <div>Uploading...</div>
      </div>
    );
  }

  return (
    <div className="App">
      <h1 className='title'>Sum up the key details.</h1>
      <p className='text'>Upload an audio or video file to easily summarize recordings into auto generated notes.</p>
      <button className="upload_btn" disabled={isUploadDisabled} onClick={() => uploadFile()}>Upload File</button>
      {filesContent.map((file, index) => (
        <div>
          <br />
          <div key={index}>{file.name}</div>
          <br />
          <button disabled={isDownloadDisabled} onClick={() => downloadTxt(summary)} className="download_btn">{buttonText}</button>
        </div>
      ))}
    </div>
  );
}

export default App;
