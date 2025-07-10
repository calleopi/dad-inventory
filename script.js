console.log("JS file is connected!");

// ========== Utility Functions ==========
function getNotes() {
  return JSON.parse(localStorage.getItem("notes") || "[]");
}

function saveNotes(notes) {
  localStorage.setItem("notes", JSON.stringify(notes));
}

function generateId() {
  return "note-" + Math.random().toString(36).substr(2, 9);
}

function getBinNotes() {
  return JSON.parse(localStorage.getItem("binNotes") || "[]");
}

function saveBinNotes(binNotes) {
  localStorage.setItem("binNotes", JSON.stringify(binNotes));
}

function moveToBin(noteId) {
  const notes = getNotes();
  const binNotes = getBinNotes();

  const noteToMove = notes.find((n) => n.id === noteId);
  if (!noteToMove) return;

  const updatedNotes = notes.filter((n) => n.id !== noteId);
  binNotes.push(noteToMove);

  saveNotes(updatedNotes);
  saveBinNotes(binNotes);
}

// ========== Note Page Logic ==========
window.addEventListener("DOMContentLoaded", () => {
  const noteId = new URLSearchParams(window.location.search).get("id") || generateId();
  const notes = getNotes();
  let existing = notes.find((n) => n.id === noteId);

  const titleEl = document.getElementById("noteTitle");
  const contentEl = document.getElementById("noteText");
  const linkEl = document.getElementById("noteLink");
  const imageEl = document.getElementById("noteImage");
  const pinEl = document.getElementById("pinNote");
  const imageInput = document.getElementById("imageInput");

  if (existing) {
    if (titleEl) titleEl.value = existing.title || "";
    if (contentEl) contentEl.value = existing.content || "";
    if (linkEl) linkEl.value = existing.link || "";
    if (imageEl && existing.image) {
      imageEl.src = existing.image;
      imageEl.style.display = "block";
    }
    if (pinEl) pinEl.checked = existing.pinned || false;
  }

  if (imageInput && imageEl) {
    imageInput.addEventListener("change", function () {
      const reader = new FileReader();
      reader.onload = function (e) {
        imageEl.src = e.target.result;
        imageEl.style.display = "block";
      };
      reader.readAsDataURL(this.files[0]);
    });
  }

  window.saveNote = function () {
    const updatedNote = {
      id: noteId,
      title: titleEl?.value || "Untitled Note",
      content: contentEl?.value || "",
      image: imageEl?.src || "",
      link: linkEl?.value || "",
      pinned: pinEl?.checked || false
    };

    const updated = notes.filter((n) => n.id !== noteId);
    updated.push(updatedNote);
    saveNotes(updated);
    alert("Note saved!");
  };
});
