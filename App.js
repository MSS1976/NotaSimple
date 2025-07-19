// Obtener referencia a Firebase desde firebase-config.js
const notesRef = window.notesRef;

// Elementos del DOM
const noteTitle = document.getElementById("noteTitle");
const noteContent = document.getElementById("noteContent");
const btnSave = document.getElementById("btnSaveNote");
const notesList = document.getElementById("notesList");

// Modal
const modal = document.getElementById("editModal");
const backdrop = document.getElementById("modalBackdrop");
const modalTitle = document.getElementById("modalNoteTitle");
const modalContent = document.getElementById("modalNoteContent");
const modalTimestamps = document.getElementById("modalTimestamps");
const saveModalBtn = document.getElementById("saveModalBtn");
const cancelBtn = document.getElementById("cancelBtn");

let currentEditingId = null;

// Mostrar modal
function showModal() {
  modal.classList.add('visible');
  backdrop.classList.add('visible');
}

// Ocultar modal
function hideModal() {
  modal.classList.remove('visible');
  backdrop.classList.remove('visible');
  currentEditingId = null;
}

// Crear nueva nota
btnSave.addEventListener("click", () => {
  const title = noteTitle.value.trim();
  const content = noteContent.value.trim();

  if (!title || !content) {
    alert("Completá el título y el contenido.");
    return;
  }

  const note = {
    title,
    content,
    timestamp: Date.now()
  };

  notesRef.push(note, (error) => {
    if (error) {
      alert("Error al guardar la nota.");
    } else {
      noteTitle.value = "";
      noteContent.value = "";
    }
  });
});

// Cargar y mostrar notas en tiempo real
notesRef.on("value", (snapshot) => {
  const notes = snapshot.val();
  notesList.innerHTML = "";

  for (let id in notes) {
    const note = notes[id];

    const item = document.createElement("div");
    item.classList.add("note-item");
    item.innerHTML = `
      <strong>${note.title}</strong>
      <span>${note.content}</span>
      <button class="btn-delete" data-id="${id}">X</button>
    `;

    // Editar al hacer clic
    item.addEventListener("click", (e) => {
      if (e.target.classList.contains("btn-delete")) return; // ignorar si fue el botón
      modalTitle.value = note.title;
      modalContent.value = note.content;
      modalTimestamps.textContent = `Editando nota creada el ${new Date(note.timestamp).toLocaleString()}`;
      currentEditingId = id;
      showModal();
    });

    // Eliminar
    item.querySelector(".btn-delete").addEventListener("click", (e) => {
      const idToDelete = e.target.dataset.id;
      if (confirm("¿Eliminar esta nota?")) {
        notesRef.child(idToDelete).remove();
      }
    });

    notesList.appendChild(item);
  }
});

// Guardar cambios del modal
saveModalBtn.addEventListener("click", () => {
  const newTitle = modalTitle.value.trim();
  const newContent = modalContent.value.trim();

  if (!newTitle || !newContent) {
    alert("Título y contenido requeridos.");
    return;
  }

  if (currentEditingId) {
    notesRef.child(currentEditingId).update({
      title: newTitle,
      content: newContent
    });
  }

  hideModal();
});

// Cancelar edición
cancelBtn.addEventListener("click", hideModal);
backdrop.addEventListener("click", hideModal);
