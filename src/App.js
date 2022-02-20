import './App.css';
import { useFilePicker } from 'use-file-picker';
import axios from 'axios';

// function pingAPI(transID) {
//   const response = await fetch("https://api.assemblyai.com/v2/transcript/" + transID, {"headers": {"authorization": process.env.REACT_APP_API_KEY}});

//   if (response["status"] === "completed") {
//     return true;
//   } else {
//     return false;
//   }
// }

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
      <p>Quickly summarize your lectures into auto generated notes</p>
      <p>Upload File Below</p>
      <button onClick={() => uploadFile()}>Upload</button>
      {filesContent.map((file, index) => (
        <div key={index}>{file.name}</div>
      ))}
      {plainFiles.forEach(async (file) => {
        const data = await file.arrayBuffer();
        assembly.post("/upload", data)
                .then((res) => assembly.post("/transcript", {audio_url: res.data["upload_url"]})
<<<<<<< HEAD
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
                                       }))})}
      <Footer />
      
=======
                                       .then((res) => console.log(res.data)))})}
>>>>>>> de5f8d2b246d826f39fa3b9569fbf725c812b7b9
    </div>
  );
}

export default App;
