import './App.css';
import { useFilePicker } from 'use-file-picker';
import axios from 'axios';

function App() {
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
      <p className="upload_text_1">Quickly summarize your lectures into auto generated notes</p>
      <p className="upload_text_2">Upload File Below</p>
      <button onClick={() => uploadFile()}>Upload</button>
      {filesContent.map((file, index) => (
        <div key={index}>{file.name}</div>
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
