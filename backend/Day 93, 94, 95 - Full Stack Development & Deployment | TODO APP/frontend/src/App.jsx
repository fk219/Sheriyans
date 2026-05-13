import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [notes, setNotes] = useState([]);

  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const fetchNotes = () => {
    axios.get("https://nx5kyy-3001.csb.app/api/notes").then((res) => {
      setNotes(res.data.notes);
    });
  };

  // CREATING NOTES
  const handleSubmit = (e) => {
    e.preventDefault();

    const { title, description } = e.target.elements;
    console.log(title.value, description.value);

    axios
      .post("https://nx5kyy-3001.csb.app/api/notes", {
        title: title.value,
        description: description.value,
      })
      .then((res) => {
        console.log(res.data);
        fetchNotes();
        e.target.reset();
      });
  };

  // DELETEING NOTES
  const handleDelete = (notesId) => {
    axios
      .delete("https://nx5kyy-3001.csb.app/api/notes/" + notesId)
      .then((res) => {
        console.log(res.data);
        fetchNotes();
      });
  };

  // UPDATING NOTES
  const handleEditClick = (note) => {
    setEditId(note._id);
    setEditValue(note.description);
  };

  const saveUpdate = (id) => {
    axios
      .patch(`https://nx5kyy-3001.csb.app/api/notes/${id}`, {
        description: editValue,
      })
      .then((res) => {
        console.log(res.data);
        setEditId(null);
        fetchNotes();
      });
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <>
      <form className="createNotes" onSubmit={handleSubmit}>
        <input
          className="input"
          name="title"
          placeholder="Enter Title"
          type="text"
        />
        <input
          className="input"
          name="description"
          placeholder="Enter Description"
          type="text"
        />
        <button>Create Notes</button>
      </form>

      {/* DISPLAY ALL NOTES  */}
      <div className="notes">
        {notes.map((note) => {
          return (
            <div className="note">
              <h1 className="title">{note.title}</h1>

              {editId === note._id ? (
                <input
                  className="input"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                />
              ) : (
                <p className="description">{note.description}</p>
              )}

              <div className="buttons">
                <button
                  className="delete"
                  onClick={() => handleDelete(note._id)}
                >
                  Delete
                </button>

                {editId === note._id ? (
                  <button className="save" onClick={() => saveUpdate(note._id)}>
                    Save
                  </button>
                ) : (
                  <button
                    className="edit"
                    onClick={() => handleEditClick(note)}
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default App;
