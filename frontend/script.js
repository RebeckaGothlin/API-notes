
let documentContainer = document.querySelector("#documentContainer");
let userForm = document.querySelector("#userForm");


/*
-----------------------LOGIN LOG OUT-----------------------
*/

// LOGIN
function printLoginForm() {
  userForm.innerHTML = "";

  let inputUsername = document.createElement("input");
  inputUsername.placeholder = "Username";
  let inputPassword = document.createElement("input");
  inputPassword.placeholder = " Password";
  inputPassword.type = "password";
  let loginBtn = document.createElement("button");
  loginBtn.innerText = "Log in";

  let loginImage = document.createElement("img");
  loginImage.src = "pexels-anete-lusina-4792288.jpg"; // Byt ut mot din faktiska bildsökväg
  loginImage.alt = "Login Image";
  loginImage.classList.add('login-image');


  loginBtn.addEventListener("click", () => {
    let sendUser = {
      username: inputUsername.value,
      password: inputPassword.value,
    };

    fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sendUser),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Post user", data);

        if (data.userId) {
          localStorage.setItem("user", data.userId);
          documentContainer.classList.remove("hidden");
          printDocuments(data.userId);
          printLogoutBtn();
          createEditorButton();
        } else {
          alert("Fel inlogg");
        }
      });
  });
  userForm.append(inputUsername, inputPassword, loginBtn, loginImage);
}

// LOG OUT
function printLogoutBtn() {
  userForm.innerHTML = "";

  let logoutBtn = document.createElement("button");
  logoutBtn.innerText = "Log out";

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("user");
    printLoginForm();
    documentContainer.classList.add("hidden");
    hideSaveBtn();
    closeEditor();
  });
  userForm.appendChild(logoutBtn);
}

/*
-----------------------DOCUMENTS-------------------------
*/

let isEditorOpen = false;
// PRINT DOCUMENT
function printDocuments(userId) {
  documentContainer.classList.remove('hidden');

  documentContainer.innerHTML = "";

  fetch(`http://localhost:3000/documents/${userId}`)
    .then((res) => res.json())
    .then((data) => {
      console.log("documents", data);

      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      data.forEach((doc) => {
        console.log("Current document:", doc);
        try {
          const createdAtDate = new Date(doc.createdAt);
          const formattedCreatedAt = createdAtDate.toLocaleString('sv-SE', { timeZone: 'Europe/Stockholm' });

          const documentElement = document.createElement("div");
          documentElement.innerHTML = `
                <h2 class="document-title" data-doc-id="${doc.id}">${doc.title}</h2>
                <img src="pexels-jess-bailey-designs-1007023.jpg">
                <p class="content-paragraph">${doc.content}</p>
                <p class="created-date">Created: ${formattedCreatedAt}</p>
                <hr>
            `;

          documentContainer.appendChild(documentElement);
          const titleElement = documentElement.querySelector('.document-title');
          if (titleElement) {
            titleElement.addEventListener('click', () => {
              showDocument(userId, doc.id);
            });
          }
        } catch (error) {
          console.error("Error creating HTML element:", error);
        }
      });
      updateEditorButton();
    })
    .catch((error) => console.error("Error fetching documents:", error));
}

function showDocument(userId, docId) {
  console.log('showDocument - userId:', userId, 'docId:', docId);

  if (!userId || !docId) {
    console.error('Invalid userId or docId');
    return;
  }
  fetch(`http://localhost:3000/documents/${userId}/${docId}`)
  .then((res) => {
    if (!res.ok) {
      if (res.status === 404) {
        throw new Error(`Document not found with id ${docId}`);
      } else {
        throw new Error(`Failed to fetch document. Status: ${res.status}`);
      }
    }
    return res.json();
  })
  .then((data) => {
    const createdAtDate = new Date(data.createdAt);
    const formattedCreatedAt = createdAtDate.toLocaleString('sv-SE', { timeZone: 'Europe/Stockholm' });

    const documentElement = document.createElement('div');
    documentElement.innerHTML = `
      <h2>${data.title}</h2>
      <img src="pexels-jess-bailey-designs-1007023.jpg">
      <p class="content-paragraph">${data.content}</p>
      <p class="created-date">Created: ${formattedCreatedAt}</p>
      <button class="editBtn" data-doc-id="${data.id}">Edit</button>
      <button class="deleteBtn" data-doc-id="${data.id}">Delete</button>
      <hr>
    `;
    documentContainer.innerHTML = "";

      const backButton = document.createElement('button');
      backButton.innerText = 'All Documents';
      backButton.addEventListener('click', () => {
        printDocuments(userId);
        createEditorButton();
      });
      documentContainer.innerHTML = "";
      documentContainer.appendChild(backButton);
      documentContainer.appendChild(documentElement);

      const editBtn = documentElement.querySelector('.editBtn');
      if (editBtn) {
        editBtn.addEventListener('click', () => {
          if (isEditorOpen) {
            closeEditor();
            isEditorOpen = false;
          } else {
            openEditorForDocuments(data.id);
            isEditorOpen = true;
          }
        });
      }
      const deleteBtn = documentElement.querySelector('.deleteBtn');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
          deleteDocument(data.id);
        });
      }
  })
  .catch((error) => console.log('Error fetching document:', error));
}


/*
----------------------EDITOR--------------------------
*/

let isNewPostOpen = false;
let saveBtnAdded = false;
let saveBtn;

// OPEN EDITOR BUTTON
function createEditorButton() {
  const editorBtn = document.createElement('button');
  editorBtn.id = 'editorBtn';
  editorBtn.innerText = 'New Post';

  editorBtn.addEventListener('click', () => {
    if (isNewPostOpen) {
      closeEditor();
    } else {
      openEditor();  
      if (!saveBtnAdded) {
        hideSaveBtn();
        createSaveButton();
        saveBtnAdded = true;
      }
    }
    console.log('isNewPostOpen before updateEditorButton:', isNewPostOpen);
    updateEditorButton();
    console.log('isNewPostOpen after updateEditorButton:', isNewPostOpen);
  });
  documentContainer.appendChild(editorBtn);
  closeEditor();
  updateEditorButton();
}

// OPEN EDITOR
function openEditor() {
  tinymce.init({
    selector: '#editor',
  });
  console.log('Editor opened');
  isNewPostOpen = true;
  updateEditorButton();
}

// CLOSE EDITOR
function closeEditor() {
  if (isNewPostOpen) {
    console.log('isEditorOpen before closing editor:', isEditorOpen);
    tinymce.get('editor').setContent('');
    tinymce.remove();
    console.log('editor closed');
    isNewPostOpen = false;
    isEditorOpen = false;
    saveBtnAdded = false;
    hideSaveBtn();
    updateEditorButton();

    const titleInput = document.querySelector('.title-input');
    if (titleInput) {
      titleInput.remove();
    }
  }
}

// UPDATE EDITOR BUTTON - TEXT
function updateEditorButton() {
  const editorBtn = document.querySelector('#editorBtn');
  if (editorBtn) {
    editorBtn.innerText = isNewPostOpen ? 'Close' : 'New Post';
  }
}



// SAVE NEW DOCUMENT BUTTON
function createSaveButton() {
  const saveBtn = document.createElement('button');
  saveBtn.id = 'saveBtn';
  saveBtn.innerText = 'Save';

  saveBtn.addEventListener('click', () => {
    saveDocument();
    closeEditor();
  })
  documentContainer.appendChild(saveBtn);
}

// SAVE NEW DOCUMENT
function saveDocument() {
  let title, content;

  if (isNewPostOpen) {
    content = tinymce.get('editor').getContent();
    title = prompt('Ange en titel för dokumentet:');
  }

  if (title && content) {
    const userId = localStorage.getItem('user');

    fetch('http://localhost:3000/documents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: title,
        content: content,
        authorId: userId,
      }),
    })
    .then((res) => res.json())
    .then((data) => {
      console.log('Document saved', data);
      printDocuments(userId);
      tinymce.get('editor').setContent('');
      isNewPostOpen = false;
      updateEditorButton();
      hideSaveBtn();
      closeEditor();
      createEditorButton();
    })
    .catch((error) => console.log('Error saving document:', error));
  }
}

// HIDE SAVE BUTTON
function hideSaveBtn() {
  const saveBtn = documentContainer.querySelector('#saveBtn');
  if (saveBtn) {
    saveBtn.remove();
  }
}




// OPEN EDITOR FOR SPECIFIC DOCUMENT
function openEditorForDocuments(docId) {
  const userId = localStorage.getItem('user');

fetch(`http://localhost:3000/documents/${userId}/${docId}`)
  .then((res) => {
    if (!res.ok) {
      if (res.status === 404) {
        throw new Error(`Document not found with id ${docId}`);
      } else {
        throw new Error(`Failed to fetch document. Status: ${res.status}`);
      }
    }
    return res.json();
  })
  .then((data) => {
    const { title, content } = data;

    const titleInput = document.createElement("input");
    titleInput.value = title;
    titleInput.placeholder = "Title";
    titleInput.classList.add("title-input");

    documentContainer.appendChild(titleInput);

    tinymce.init({
    selector: '#editor',
    setup: function (editor) {
      editor.on('init', function () {
        editor.setContent(content);
        openEditor();
      });
    }
    });

    const saveBtn = documentContainer.querySelector('#saveBtn');
    if (!saveBtn) {
      createSaveButtonForUpdate(docId, userId, titleInput);
    }
  })
  .catch((error) => console.log('Error fetching document:', error));
}

// CREATE SAVE BUTTON FOR DOCUMENT UPDATE
function createSaveButtonForUpdate(docId, userId, titleInput) {
  const saveBtn = document.createElement('button');
  saveBtn.id = 'saveBtn';
  saveBtn.innerText = 'Save changes';

  saveBtn.addEventListener('click', () => {
    const updatedTitle = titleInput.value || showTitlePrompt(titleInput.placeholder);
    const content = tinymce.get('editor').getContent();

    if (updatedTitle && content) {
      fetch(`http://localhost:3000/documents/${userId}/${docId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: updatedTitle,
          content: content,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('Document updated', data);
          showDocument(userId, docId);
          tinymce.get('editor').setContent('');
          isEditorOpen = false;
          updateEditorButton();
          hideSaveBtn();
          closeEditor();
        })
        .catch((error) => console.log('Error updating document:', error));
    }
  });

  documentContainer.appendChild(saveBtn);
}

function showTitlePrompt(placeholder) {
  const titleModal = document.createElement('div');
  titleModal.className = 'title-modal';
  
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = placeholder;

  const saveButton = document.createElement('button');
  saveButton.innerText = 'Save';
  saveButton.addEventListener('click', () => {
    closeTitlePrompt();
  });

  titleModal.appendChild(input);
  titleModal.appendChild(saveButton);

  document.body.appendChild(titleModal);

  return new Promise((resolve) => {
    saveButton.addEventListener('click', () => {
      resolve(input.value);
      closeTitlePrompt();
    });
  });
}

// Stäng modal
function closeTitlePrompt() {
  const titleModal = document.querySelector('.title-modal');
  if (titleModal) {
    titleModal.remove();
  }
}


// SAVE UPDATED DOCUMENT
function saveUpdatedDocument(docId) {
  console.log('saveUpdatedDocument - docId:', docId);

  const title = prompt('Enter the updated title for the document:');
  const content = tinymce.get('editor').getContent();
  const userId = localStorage.getItem('user');

  if (title && content) {
    fetch(`http://localhost:3000/documents/${userId}/${docId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: title,
        content: content,
      }),
    })
    .then((res) => res.json())
    .then((data) => {
      console.log('Document updated', data);
      showDocument(userId, docId);
      tinymce.get('editor').setContent('');
      isEditorOpen = false;
      updateEditorButton();
      hideSaveBtn();
      closeEditor();
    })
    .catch((error) => console.log('Error updating document:', error));
  }
}

// DELETE DOCUMENT
function deleteDocument(docId) {
  const userId = localStorage.getItem('user');

  fetch(`http://localhost:3000/documents/${userId}/${docId}`, {
    method: 'DELETE'
  })
  .then(res => res.json())
  .then(data => {
    console.log(data);
    printDocuments(userId);
    createEditorButton();
  })
}

// INNIT
if (localStorage.getItem("user")) {
  const userId = localStorage.getItem("user");

  fetch(`http://localhost:3000/documents/${userId}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.length > 0) {
        const firstDocId = data[0].id;
        showDocument(userId, firstDocId);
      } else {
        console.log("No documents found");
      }
    })
    .catch((error) => console.error("Error fetching documents:", error));

  printDocuments(userId);
  printLogoutBtn();
  createEditorButton();
} else {
  printLoginForm();
}
