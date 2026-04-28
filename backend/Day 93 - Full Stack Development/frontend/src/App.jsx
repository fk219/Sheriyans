import { useState } from "react";
import axios from "axios";

function App() {
  const [notes, setNotes] = useState([]);

  axios.get("https://nx5kyy-3001.csb.app/api/notes").then((res) => {
    setNotes(res.data);
  });

  return (
    <>
      <div className="notes">
        {notes.map((note) => {
          return (
            <div className="note">
              <h1 className="title">{note.title}</h1>
              <p className="description">{note.description}</p>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default App;
