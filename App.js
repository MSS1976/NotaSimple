let notes = [];
let currentNoteId = null;

const notesListEl = document.getElementById("notesList");
const noteTitleEl = document.getElementById("noteTitle");
const noteContentEl = document.getElementById("noteContent");
const btnSaveNote = document.getElementById("btnSaveNote");
const btnNewNote = document.getElementById("btnNewNote");

// Referencia a Realtime Database
const notesRef = window.notesRef;

function createNoteListItem(id, note) {
  const div = document.createElement("div");
  div.className = "note-item";
  div.style.position = "relative"; // necesario para el botón eliminar

  const titleStrong = document.createElement("strong");
  titleStrong.textContent = note.title || "Sin título";

  const contentSpan = document.createElement("span");
  contentSpan.textContent = note.content || "";

  // ✅ Botón eliminar
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "🗑";
  deleteBtn.className = "btn-delete";
  deleteBtn.title = "Eliminar nota";

  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // evita seleccionar la nota al hacer clic en el botón
    if (confirm("¿Estás seguro de que querés eliminar esta nota?")) {
      notesRef.child(id).remove();
      if (currentNoteId === id) {
        currentNoteId = null;
        noteTitleEl.value = "";
        noteContentEl.value = "";
      }
    }
  });

  div.appendChild(deleteBtn);
  div.appendChild(titleStrong);
  div.appendChild(contentSpan);

  div.addEventListener("click", () => {
    currentNoteId = id;
    noteTitleEl.value = note.title || "";
    noteContentEl.value = note.content || "";
  });

  return div;
}

function renderNotesList() {
  notesListEl.innerHTML = "";
  for (const id in notes) {
    notesListEl.appendChild(createNoteListItem(id, notes[id]));
  }
}

function loadNotesFromDatabase() {
  notesRef.on("value", (snapshot) => {
    notes = snapshot.val() || {};
    renderNotesList();
  });
}

function saveNote() {
  const title = noteTitleEl.value.trim();
  const content = noteContentEl.value.trim();

  if (!title && !content) {
    alert("La nota está vacía. Agregá título o contenido.");
    return;
  }

  const newNote = {
    title,
    content,
    timestamp: new Date().toISOString()
  };

  if (currentNoteId === null) {
    const newRef = notesRef.push();
    newRef.set(newNote);
    currentNoteId = newRef.key;
  } else {
    notesRef.child(currentNoteId).update(newNote);
  }

  noteTitleEl.value = "";
  noteContentEl.value = "";
  currentNoteId = null;
}

function newNote() {
  currentNoteId = null;
  noteTitleEl.value = "";
  noteContentEl.value = "";
}

btnSaveNote.addEventListener("click", saveNote);
btnNewNote.addEventListener("click", newNote);

loadNotesFromDatabase();
