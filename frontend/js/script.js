// ===========================
//     DECLARE ALL INPUTS
// ===========================
const go = document.getElementById("student-button");
const nameInput = document.getElementById("name-input");
const titleInput = document.getElementById("title-input");
const descriptionInput = document.getElementById("description-input");
const imageURLInput = document.getElementById("image-url-input");

// ===========================
//     CREATE AJAX PAGES
// ===========================

let showAllStudents = () => {
  $.ajax({
    type: "GET",
    url: "http://localhost:3100/allStudents",
    // your success function contains a object which can be named anything
    success: (students) => {
      console.log(students);
      displayStudents(students);
      // projectModalContent(students);
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
      title: titleInput.value,
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

let deleteStudent = (currentId) => {
  // use ajax and go to the delete route
  $.ajax({
    // Let's go to our route
    url: `http://localhost:3100/deleteStudent/${currentId}`,
    type: "DELETE",
    success: () => {
      showAllStudents();
    },
    error: () => {
      console.log("Cannot call API");
    },
  });
};

// ==============================
//  COLLECT PROJECT MODAL
// ==============================

// Render the inner HTML for the modal

let renderProjectModal = (projectData) => {
  let studentName = document.getElementById("student-name");
  let studentProject = document.getElementById("student-project");
  let studentDescription = document.getElementById("student-description");
  let studentImage = document.getElementById("student-image");
  let currentId = projectData._id;
  studentName.innerHTML = `
<h1>${projectData.name}</h1>
<div class="name-underline"></div>
`;

  studentProject.innerHTML = `
<h2>${projectData.title}</h2>
`;

  studentDescription.innerHTML = `
<p>${projectData.description}</p>

`;

  studentImage.innerHTML = `
<img src="${projectData.image_url}" alt="">
`;

    let deleteBtn = document.getElementById('delete-button');
    deleteBtn.onclick = () => {
      console.log(currentId);
      deleteStudent(currentId);
      projectModal.classList.toggle("active");
    };

    let editBtn = document.getElementById('edit-button');
    editBtn.onclick = () => {
      console.log(currentId);
      populateEditModal(currentId);
    };
  };





// Getting data from MongoDB to put in our project modal

let populateProjectModal = (projectId) => {
  $.ajax({
    url: `http://localhost:3100/student/${projectId}`,
    type: "GET",
    success: (projectData) => {
      // console.log('student was found');
      console.log(projectData);
      // thias is where renderprojectmodal is getting its data from
      renderProjectModal(projectData);
    },
    error: (error) => {
      console.log(error);
    },
  });
};


const openImage = document.getElementsByClassName("open-image");
const closeModalBtn = document.getElementById("close-modal");
const projectModal = document.getElementById("projectModal");

let collectProjectModals = () => {
  for (let i = 0; i < openImage.length; i++) {
    // This is when the user clicks on the project image

    openImage[i].onclick = () => {
      console.log("You clicked the modal");
      let projectId = openImage[i].parentNode.parentNode.id;
      console.log(projectId);
      populateProjectModal(projectId);
      projectModal.classList.toggle("active");
    };
  }
  closeModalBtn.onclick = () => {
    projectModal.classList.toggle("active");
  };
};

// ===========================
//       EDIT FUNCTIONS
// ===========================

handleEditFunctionality = (student, id) => {
  let studentName = document.getElementById("studentName");
  let studentTitle = document.getElementById("studentTitle");
  let imagePreview = document.getElementById("image-preview");
  let imageurl = document.getElementById("imageUrl");
  let studentDescription = document.getElementById("studentDescription");
  studentName.value = student.name;
  studentTitle.value = student.title;

  imageurl.value = student.image_url;
  studentDescription.value = student.description;
  imagePreview.innerHTML = `
  <img src="${student.image_url}" alt="${studentName}" >`;
  // console.log(`the console log was passed in through this id ${id}`)

  // ================================
  //        EDIT CLICK LISTENER
  // ================================

  $("#updateStudent").click(function () {
    event.preventDefault();
    let studentId = id;
    console.log(id);
    let studentName = document.getElementById("studentName").value;
    let studentTitle = document.getElementById("studentTitle").value;
    let imageurl = document.getElementById("imageUrl").value;
    let studentDescription =
      document.getElementById("studentDescription").value;
    console.log(studentId, studentName, imageurl, studentDescription);
    $.ajax({
      url: `http://localhost:3100/updateStudent/${studentId}`,
      type: "PATCH",
      data: {
        name: studentName,
        title: studentTitle,
        image_url: imageurl,
        description: studentDescription,
      },
      success: function (data) {
        console.log(data);
        showAllStudents();
        $("#editModal").modal("hide");
        $("#updateStudent").off("click");
        let studentN = document.getElementById("student-name");
        let studentPro = document.getElementById("student-project");
        let studentDes = document.getElementById("student-description");
        let studentImg = document.getElementById("student-image");
        studentN.innerHTML = `
<h1>${studentName}</h1>
<div class="name-underline"></div>
`;

  studentPro.innerHTML = `
<h2>${studentTitle}</h2>
`;

  studentDes.innerHTML = `
<p>${studentDescription}</p>

`;

  studentImg.innerHTML = `
<img src="${imageurl}" alt="">
`;
console.log(studentId);
populateProjectModal(studentId);
        
      },
      error: function () {
        console.log("error: cannot update");
      },
    });
  });
};

// ===========================
//  ADD STUDENT MODAL CLICKS
// ===========================

$("#student-button").click(function () {
  event.preventDefault();
  $("#addStudentModal").modal("hide");
});

$("#close-add-student").click(function () {
  event.preventDefault();
  $("#addStudentModal").modal("hide");
});

// ===========================
//         EDIT MODAL
// ===========================

populateEditModal = (currentId) => {
  console.log(currentId);
  $.ajax({
    url: `http://localhost:3100/student/${currentId}`,
    type: "GET",
    success: (projectData) => {
      // console.log('student was found');
      // console.log(student);
      handleEditFunctionality(projectData, currentId);
    },
    error: (error) => {
      console.log(error);
    },
  });
};

// ===========================
//     ADD STUDENT MODAL
// ===========================

$("#student-button").click(function () {
  event.preventDefault();
  $("#addStudentModal").modal("hide");
});

$("#close-add-student").click(function () {
  event.preventDefault();
  $("#addStudentModal").modal("hide");
});

// ===========================
//      DISPLAY STUDENTS
// ===========================

let displayStudents = (students) => {
  result.innerHTML = "";
  students.forEach((item) => {
    result.innerHTML += `
      <div class="result-container" id="${item._id}">

      <div class="img-container">
      <img src="${item.image_url}" alt="${item.name}">
      <div class="overlay open-image"><h1>${item.name}</h1></div>
      </div>
      <div class="short-bio">
      <p><span class="bold">${item.name}</span> - ${item.title}</p>

      </div>

      `;
  });

  // collect the open model buttons
  collectProjectModals();
};

// ===========================
//          START APP
// ===========================

showAllStudents();

// ===========================
// CHECK LOGIN FOR BUTTON USE
// ===========================

let checkLogin = () => {
  const userDetails = document.getElementById("user-details");
  let navContent;
  if (sessionStorage.userID) {
    navContent = `
    <ul>
    <li><h2 id="font-size" class="black">${sessionStorage.userName}</h2></li>
    <li><a id="sign-out-button" href="#">Sign out</a></li>
    </ul>
    `;
  }
  // if they're not logged in
  else {
    navContent = `
    <ul>
    <li><a href="login.html">Login</a></li>
    <li><a href="signup.html">Signup</a></li>
    </ul>
    `;
  }
  // render our logged in elements
  userDetails.innerHTML = navContent;
};

checkLogin();

// Sign out button
const signoutBtn = document.getElementById("sign-out-button");

let logOut = () => {
  sessionStorage.clear();
  window.location.reload();
};

if (sessionStorage.userID) {
  signoutBtn.onclick = () => logOut();
}

// PROJECT MODAL ------------------------------------------------------------

//---------------------- ADD STUDENT BUTTON
const addStudent = document.getElementById("addStudentBtn");

//----------------- OPEN NAV MODAL FUNCTION
const menuBtn = document.getElementById("nav-toggle-btn");
const title = document.getElementById("absolute");
menuBtn.onclick = () => {
  title.classList.toggle("black");
};
