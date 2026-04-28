require("dotenv").config();

import { useState } from "react";
import axios from "axios";

function App() {
  const [notes, setnotes] = useState([
    {
      title: "Test Title 01",
      description: "Test Description",
    },
    {
      title: "Test Title 02",
      description: "Test Description",
    },
    {
      title: "Test Title 03",
      description: "Test Description",
    },
    {
      title: "Test Title 04",
      description: "Test Description",
    },
  ]);

  axios.get("https://nx5kyy-3001.csb.app").then((res) => {
    console.log(res.data);
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
