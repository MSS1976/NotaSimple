// Referencia a la base de datos
const db = firebase.database();
const notesRef = db.ref("notes");

const noteTitle = document.getElementById("noteTitle");
const noteContent = document.getElementById("noteContent");
const notesList = document.getElementById("notesList");

const editModal = document.getElementById("editModal");
const modalNoteTitle = document.getElementById("modalNoteTitle");
const modalNoteContent = document.getElementById("modalNoteContent");
const modalTimestamps = document.getElementById("modalTimestamps"); // ?? CAMBIO: Debe existir en tu HTML un div con id modalTimestamps
const cancelBtn = document.getElementById("cancelBtn");
const saveModalBtn = document.getElementById("saveModalBtn");

let editingNoteId = null;

// Funci車n para formatear fechas
function formatDate(timestamp) { // ?? CAMBIO: para mostrar las fechas bonitas
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toLocaleString();
}

// Guardar nueva nota (agrego timestamps)
function saveNote() {
  const title = noteTitle.value.trim();
  const content = noteContent.value.trim();

  if (!title || !content) {
    alert("Complet芍 el t赤tulo y el contenido.");
    return;
  }

  const timestamp = Date.now();
  const newNote = notesRef.push();
  newNote.set({
    title,
    content,
    createdAt: timestamp,    // ?? CAMBIO: guardo fecha creaci車n
    updatedAt: timestamp,    // ?? CAMBIO: guardo fecha edici車n inicial igual a creaci車n
  });

  noteTitle.value = "";
  noteContent.value = "";
}

// Escuchar cambios y mostrar notas
notesRef.on("value", (snapshot) => {
  notesList.innerHTML = "";

  snapshot.forEach((childSnapshot) => {
    const note = childSnapshot.val();
    const id = childSnapshot.key;

    const div = document.createElement("div");
    div.className = "p-2 bg-gray-100 border rounded mb-2 flex justify-between items-center";

    const contentDiv = document.createElement("div");
    contentDiv.className = "cursor-pointer hover:bg-yellow-100 p-1 rounded flex-grow";
    contentDiv.innerHTML = `
      <strong>${note.title}</strong><br>
      <span>${note.content}</span><br>
      <small>Creada: ${formatDate(note.createdAt)} | Editada: ${formatDate(note.updatedAt)}</small>  <!-- ?? CAMBIO: mostrar fechas -->
    `;

    contentDiv.addEventListener("click", () => {
      modalNoteTitle.value = note.title;
      modalNoteContent.value = note.content;
      if(note.createdAt && note.updatedAt) {
        modalTimestamps.innerText = `Creada: ${formatDate(note.createdAt)} | Editada: ${formatDate(note.updatedAt)}`;  // ?? CAMBIO: muestro fechas en modal
      } else {
        modalTimestamps.innerText = "";
      }
      editingNoteId = id;
      editModal.classList.remove("hidden");
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "??";  // ?? CAMBIO: bot車n eliminar con icono de basura
    deleteBtn.className = "ml-2 text-red-600 hover:text-red-800";
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if(confirm("?Quer谷s eliminar esta nota?")) {  // ?? CAMBIO: confirmaci車n para eliminar
        notesRef.child(id).remove();
      }
    });

    div.appendChild(contentDiv);
    div.appendChild(deleteBtn);

    notesList.appendChild(div);
  });
});

// Cancelar edici車n y cerrar modal
cancelBtn.addEventListener("click", () => {
  editModal.classList.add("hidden");
  editingNoteId = null;
});

// Guardar cambios en modal (actualizo updatedAt)
saveModalBtn.addEventListener("click", () => {
  const title = modalNoteTitle.value.trim();
  const content = modalNoteContent.value.trim();

  if (!title || !content) {
    alert("Complet芍 el t赤tulo y el contenido.");
    return;
  }

  if (editingNoteId) {
    notesRef.child(editingNoteId).update({
      title,
      content,
      updatedAt: Date.now()  // ?? CAMBIO: actualizo fecha de edici車n al guardar cambios
    });
  }

  editModal.classList.add("hidden");
  editingNoteId = null;
});
