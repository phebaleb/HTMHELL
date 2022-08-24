console.log("hello");
const go = document.getElementById("student-button");

// declare all our inputs
const nameInput = document.getElementById("name-input");
const descriptionInput = document.getElementById("description-input");
const imageURLInput = document.getElementById("image-url-input");

let showAllStudents = () => {
  $.ajax({
    type: "GET",
    url: "http://localhost:3100/allStudents",
    // your success function contains a object which can be named anything
    success: (students) => {
      console.log(students);
      renderStudents(students);
    },
    error: (error) => {
      console.log(error);
    },
  });
};

go.onclick = () => {
  console.log("clicked");
  $.ajax({
    url: `http://localhost:3100/addStudent`,
    // use the post type to create data somewhere
    // requesting to POST our data
    type: "POST",
    // we can send objects through to the backend, using the data argument
    data: {
      // the first property (i.e. the one on the left) called name has to be spelt exactly as the schema
      name: nameInput.value,
      description: descriptionInput.value,
      image_url: imageURLInput.value,
    },
    success: () => {
      console.log("A new student was added.");
      showAllStudents();
    },
    error: () => {
      console.log("Error: cannot reach the backend");
    },
  });
};

let deleteStudent = (studentId) => {
  // use ajax and go to the delete route
  $.ajax({
    // Let's go to our route
    url: `http://localhost:3100/deleteStudent/${studentId}`,
    type: "DELETE",
    success: () => {
      showAllStudents();
    },
    error: () => {
      console.log("Cannot call API");
    },
  });
};

handleEditFunctionality = (student, id) => {
  let studentName = document.getElementById("studentName");
  let imagePreview = document.getElementById("image-preview");
  let imageurl = document.getElementById("imageUrl");
  let studentDescription = document.getElementById("studentDescription");
  studentName.value = student.name;
  imageurl.value = student.image_url;
  studentDescription.value = student.description
  imagePreview.innerHTML = `
  <img src="${student.image_url}" alt="${studentName}" >`
  // console.log(`the console log was passed in through this id ${id}`)
  // ================================
  //        EDIT CLICK LISTENER
  // ================================

  $("#updateStudent").click(function () {
    event.preventDefault();
    let studentId = id;
    let studentName = document.getElementById("studentName").value;
    let imageurl = document.getElementById("imageUrl").value;
    let studentDescription = document.getElementById("studentDescription").value;
    console.log(studentId, studentName, imageurl, studentDescription);
    $.ajax({
      url: `http://localhost:3100/updateStudent/${studentId}`,
      type: "PATCH",
      data: {
        name: studentName,
        image_url: imageurl,
        description: studentDescription
      },
      success: function (data) {
        console.log(data);
        showAllStudents();
        $('#editModal').modal('hide');
        $('#updateProduct').off('click');
      },
      error: function () {
        console.log("error: cannot update");
      },
    });
  });
};

populateEditModal = (studentId) => {
  console.log(studentId);
  $.ajax({

    url: `http://localhost:3100/student/${studentId}`,
    type: "GET",
    success: (studentData) => {
      // console.log('student was found');
      // console.log(student);
      handleEditFunctionality(studentData, studentId);
    },
    error: (error) => {
      console.log(error);
    },
  });
};

// this function will handle all our deletes
let collectDeleteButtons = () => {
  // this will return an Array, but it's a slightly different one
  // it returns HTML "nodes" instead
  // we'll have use a regular loop to loop over these
  let deleteButtonsArray = document.getElementsByClassName("delete-button");
  // this will loop over every delete button
  for (let i = 0; i < deleteButtonsArray.length; i++) {
    deleteButtonsArray[i].onclick = () => {
      let currentId = deleteButtonsArray[i].parentNode.id;
      // delete student based on the id
      deleteStudent(currentId);
    };
  }
};

// this function will handle all our edits
let collectEditButtons = () => {
  // this will return an Array, but it's a slightly different one
  // it returns HTML "nodes" instead
  // we'll have use a regular loop to loop over these
  let editButtonsArray = document.getElementsByClassName("edit-button");
  // this will loop over every delete button
  for (let i = 0; i < editButtonsArray.length; i++) {
    editButtonsArray[i].onclick = () => {
      let currentId = editButtonsArray[i].parentNode.id;
      // delete student based on the id
      populateEditModal(currentId);
    };
  }
};

let renderStudents = (students) => {
  console.log("The render student function is running");
  result.innerHTML = "";
  students.forEach((item) => {
    if (sessionStorage.userID) {
      result.innerHTML += `
      <div class="result-container" id="${item._id}">
      <img src="${item.image_url}" alt="${item.name}">
      <h3>${item.name}</h3>
      <p>$${item.price}</p> 
      <i class="fa-solid fa-trash-can delete-button"></i>
      <i class="fa-solid fa-pen-to-square edit-button" data-bs-toggle="modal" data-bs-target="#editModal"></i>
      </div>
      `;
      //if the user isn't logged in
    } else {
      result.innerHTML += `
      <div class="result-container" id="${item._id}">
      <img src="${item.image_url}" alt="${item.name}">
      <h3>${item.name}</h3>
      <p>$${item.price}</p> 
      </div>
      `;
    }
  });
  // all students should be rendered now
  // and now we can collect the delete buttons
  collectDeleteButtons();
  // collect edit buttons
  collectEditButtons();
};

// start app
showAllStudents();

let checkLogin = () => {
  const userDetails = document.getElementById("user-details");
  let navContent;
  if (sessionStorage.userID) {
    // console.log("You're logged in")
    // console.log(sessionStorage.userName)
    navContent = `
    <span id="username">${sessionStorage.userName}</span>
    <span id="dp" style="background-image: url('${sessionStorage.profileImg}')"></span>
    <a id="sign-out-button" href="#">Sign out</a>
    `
  }
  // if they're not logged in
  else {
    navContent = `
    <a href="login.html">Login</a>
    <a href="signup.html">Signup</a>
    `;
  }
  // render our logged in elements
  userDetails.innerHTML = navContent;
}

checkLogin();

// Sign out button
const signoutBtn = document.getElementById("sign-out-button");

let logOut = () => {
  console.log("You've logged out")
  sessionStorage.clear();
  window.location.reload();
}

if (sessionStorage.userID) {
  signoutBtn.onclick = () => logOut();
};
