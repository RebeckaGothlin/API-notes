let documentContainer = document.querySelector("#documentContainer");
let userForm = document.querySelector("#userForm");

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
    })
    .catch((error) => console.error("Error fetching documents:", error));
}

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
        } else {
          alert("Fel inlogg");
        }
      });
  });
  userForm.append(inputUsername, inputPassword, loginBtn);
}

function printLogoutBtn() {
  userForm.innerHTML = "";

  let logoutBtn = document.createElement("button");
  logoutBtn.innerText = "Log out";

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("user");
    printLoginForm();
    documentContainer.classList.add("hidden");
  });

  userForm.appendChild(logoutBtn);
}

if (localStorage.getItem("user")) {
  const userId = localStorage.getItem("user");
  printDocuments(userId);
  printLogoutBtn();
} else {
  printLoginForm();
}
