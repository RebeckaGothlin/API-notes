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
  userForm.append(inputUsername, inputPassword, loginBtn);
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
// PRINT DOCUMENT
function printDocuments(userId) {
	documentContainer.classList.remove('hidden');

  documentContainer.innerHTML = "";

  fetch(`http://localhost:3000/documents/${userId}`)
    .then((res) => res.json())
    .then((data) => {
      console.log("documents", data);

      data.forEach((doc) => {
        console.log("Current document:", doc);
        try {
          const documentElement = document.createElement("div");
          documentElement.innerHTML = `
								<h2>${doc.title}</h2>
								<p>${doc.content}</p>
								<p>Created: ${doc.createdAt}</p>
								<hr>
						`;

          documentContainer.appendChild(documentElement);
        } catch (error) {
          console.error("Error creating HTML element:", error);
        }
      });
      updateEditorButton();
    })
    .catch((error) => console.error("Error fetching documents:", error));
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
        createSaveButton();
        saveBtnAdded = true;
      }
    }
    updateEditorButton();
  });
  documentContainer.appendChild(editorBtn);
  closeEditor();
  updateEditorButton();
}

// OPEN EDITOR
function openEditor() {

  tinymce.init({
    selector: '#editor'
  });
  console.log('Editor opened');
  isNewPostOpen = true;
  updateEditorButton();
}

// CLOSE EDITOR
function closeEditor() {
  tinymce.get('editor').setContent('');
  tinymce.remove();
  console.log('editor closed');
  isNewPostOpen = false;
  saveBtnAdded = false;
  hideSaveBtn();
  updateEditorButton();
}

// UPDATE EDITOR BUTTON - TEXT
function updateEditorButton() {
  const editorBtn = document.querySelector('#editorBtn');
  if (editorBtn) {
    editorBtn.innerText = isNewPostOpen ? 'Close' : 'New Post';
  }
}

// HIDE EDITOR BUTTON
function hideEditorButton() {
  const editorBtn = documentContainer.querySelector('#editorBtn');
  if (editorBtn) {
    editorBtn.remove();
  }
}

// SAVE NEW DOCUMENT BUTTON
function createSaveButton() {
  const saveBtn = document.createElement('button');
  saveBtn.id = 'saveBtn';
  saveBtn.innerText = 'Save';

  saveBtn.addEventListener('click', () => {
    saveDocument();
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
      hideEditorButton();
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

// INNIT
if (localStorage.getItem("user")) {
  const userId = localStorage.getItem("user");
  printDocuments(userId);
  printLogoutBtn();
  createEditorButton();
} else {
  printLoginForm();
}