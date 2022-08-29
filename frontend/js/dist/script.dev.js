"use strict";

// ===========================
//     DECLARE ALL INPUTS
// ===========================
var go = document.getElementById("student-button");
var nameInput = document.getElementById("name-input");
var titleInput = document.getElementById("title-input");
var descriptionInput = document.getElementById("description-input");
var imageURLInput = document.getElementById("image-url-input"); // ===========================
//     CREATE AJAX PAGES
// ===========================

var showAllStudents = function showAllStudents() {
  $.ajax({
    type: "GET",
    url: "http://localhost:3100/allStudents",
    // your success function contains a object which can be named anything
    success: function success(students) {
      console.log(students);
      displayStudents(students); // projectModalContent(students);
    },
    error: function error(_error) {
      console.log(_error);
    }
  });
};

go.onclick = function () {
  console.log("clicked");
  $.ajax({
    url: "http://localhost:3100/addStudent",
    // use the post type to create data somewhere
    // requesting to POST our data
    type: "POST",
    // we can send objects through to the backend, using the data argument
    data: {
      // the first property (i.e. the one on the left) called name has to be spelt exactly as the schema
      name: nameInput.value,
      title: titleInput.value,
      description: descriptionInput.value,
      image_url: imageURLInput.value
    },
    success: function success() {
      console.log("A new student was added.");
      showAllStudents();
    },
    error: function error() {
      console.log("Error: cannot reach the backend");
    }
  });
};

var deleteStudent = function deleteStudent(currentId) {
  // use ajax and go to the delete route
  $.ajax({
    // Let's go to our route
    url: "http://localhost:3100/deleteStudent/".concat(currentId),
    type: "DELETE",
    success: function success() {
      showAllStudents();
    },
    error: function error() {
      console.log("Cannot call API");
    }
  });
}; // ==============================
//  COLLECT PROJECT MODAL
// ==============================
// Render the inner HTML for the modal


var renderProjectModal = function renderProjectModal(projectData) {
  var studentName = document.getElementById("student-name");
  var studentProject = document.getElementById("student-project");
  var studentDescription = document.getElementById("student-description");
  var studentImage = document.getElementById("student-image");
  var currentId = projectData._id;
  studentName.innerHTML = "\n<h1>".concat(projectData.name, "</h1>\n<div class=\"name-underline\"></div>\n");
  studentProject.innerHTML = "\n<h2>".concat(projectData.title, "</h2>\n");
  studentDescription.innerHTML = "\n<p>".concat(projectData.description, "</p>\n\n");
  studentImage.innerHTML = "\n<img src=\"".concat(projectData.image_url, "\" alt=\"\">\n");
  var deleteBtn = document.getElementById('delete-button');

  deleteBtn.onclick = function () {
    console.log(currentId);
    deleteStudent(currentId);
    projectModal.classList.toggle("active");
  };

  var editBtn = document.getElementById('edit-button');

  editBtn.onclick = function () {
    console.log(currentId);
    populateEditModal(currentId);
  };
}; // Getting data from MongoDB to put in our project modal


var populateProjectModal = function populateProjectModal(projectId) {
  $.ajax({
    url: "http://localhost:3100/student/".concat(projectId),
    type: "GET",
    success: function success(projectData) {
      // console.log('student was found');
      console.log(projectData); // thias is where renderprojectmodal is getting its data from

      renderProjectModal(projectData);
    },
    error: function error(_error2) {
      console.log(_error2);
    }
  });
};

var openImage = document.getElementsByClassName("open-image");
var closeModalBtn = document.getElementById("close-modal");
var projectModal = document.getElementById("projectModal");

var collectProjectModals = function collectProjectModals() {
  var _loop = function _loop(i) {
    // This is when the user clicks on the project image
    openImage[i].onclick = function () {
      console.log("You clicked the modal");
      var projectId = openImage[i].parentNode.parentNode.id;
      console.log(projectId);
      populateProjectModal(projectId);
      projectModal.classList.toggle("active");
    };
  };

  for (var i = 0; i < openImage.length; i++) {
    _loop(i);
  }

  closeModalBtn.onclick = function () {
    projectModal.classList.toggle("active");
  };
}; // ===========================
//       EDIT FUNCTIONS
// ===========================


handleEditFunctionality = function handleEditFunctionality(student, id) {
  var studentName = document.getElementById("studentName");
  var studentTitle = document.getElementById("studentTitle");
  var imagePreview = document.getElementById("image-preview");
  var imageurl = document.getElementById("imageUrl");
  var studentDescription = document.getElementById("studentDescription");
  studentName.value = student.name;
  studentTitle.value = student.title;
  imageurl.value = student.image_url;
  studentDescription.value = student.description;
  imagePreview.innerHTML = "\n  <img src=\"".concat(student.image_url, "\" alt=\"").concat(studentName, "\" >"); // console.log(`the console log was passed in through this id ${id}`)
  // ================================
  //        EDIT CLICK LISTENER
  // ================================

  $("#updateStudent").click(function () {
    event.preventDefault();
    var studentId = id;
    console.log(id);
    var studentName = document.getElementById("studentName").value;
    var studentTitle = document.getElementById("studentTitle").value;
    var imageurl = document.getElementById("imageUrl").value;
    var studentDescription = document.getElementById("studentDescription").value;
    console.log(studentId, studentName, imageurl, studentDescription);
    $.ajax({
      url: "http://localhost:3100/updateStudent/".concat(studentId),
      type: "PATCH",
      data: {
        name: studentName,
        title: studentTitle,
        image_url: imageurl,
        description: studentDescription
      },
      success: function success(data) {
        console.log(data);
        showAllStudents();
        $("#editModal").modal("hide");
        $("#updateStudent").off("click");
        var studentN = document.getElementById("student-name");
        var studentPro = document.getElementById("student-project");
        var studentDes = document.getElementById("student-description");
        var studentImg = document.getElementById("student-image");
        studentN.innerHTML = "\n<h1>".concat(studentName, "</h1>\n<div class=\"name-underline\"></div>\n");
        studentPro.innerHTML = "\n<h2>".concat(studentTitle, "</h2>\n");
        studentDes.innerHTML = "\n<p>".concat(studentDescription, "</p>\n\n");
        studentImg.innerHTML = "\n<img src=\"".concat(imageurl, "\" alt=\"\">\n");
        console.log(studentId);
        populateProjectModal(studentId);
      },
      error: function error() {
        console.log("error: cannot update");
      }
    });
  });
}; // ===========================
//  ADD STUDENT MODAL CLICKS
// ===========================


$("#student-button").click(function () {
  event.preventDefault();
  $("#addStudentModal").modal("hide");
});
$("#close-add-student").click(function () {
  event.preventDefault();
  $("#addStudentModal").modal("hide");
}); // ===========================
//         EDIT MODAL
// ===========================

populateEditModal = function populateEditModal(currentId) {
  console.log(currentId);
  $.ajax({
    url: "http://localhost:3100/student/".concat(currentId),
    type: "GET",
    success: function success(projectData) {
      // console.log('student was found');
      // console.log(student);
      handleEditFunctionality(projectData, currentId);
    },
    error: function error(_error3) {
      console.log(_error3);
    }
  });
}; // ===========================
//     ADD STUDENT MODAL
// ===========================


$("#student-button").click(function () {
  event.preventDefault();
  $("#addStudentModal").modal("hide");
});
$("#close-add-student").click(function () {
  event.preventDefault();
  $("#addStudentModal").modal("hide");
}); // ===========================
//      DISPLAY STUDENTS
// ===========================

var displayStudents = function displayStudents(students) {
  result.innerHTML = "";
  students.forEach(function (item) {
    result.innerHTML += "\n      <div class=\"result-container\" id=\"".concat(item._id, "\">\n\n      <div class=\"img-container\">\n      <img src=\"").concat(item.image_url, "\" alt=\"").concat(item.name, "\">\n      <div class=\"overlay open-image\"><h1>").concat(item.name, "</h1></div>\n      </div>\n      <div class=\"short-bio\">\n      <p><span class=\"bold\">").concat(item.name, "</span> - ").concat(item.title, "</p>\n\n      </div>\n\n      ");
  }); // collect the open model buttons

  collectProjectModals();
}; // ===========================
//          START APP
// ===========================


showAllStudents(); // ===========================
// CHECK LOGIN FOR BUTTON USE
// ===========================

var checkLogin = function checkLogin() {
  var userDetails = document.getElementById("user-details");
  var navContent;

  if (sessionStorage.userID) {
    navContent = "\n    <ul>\n    <li><h2 id=\"font-size\" class=\"black\">".concat(sessionStorage.userName, "</h2></li>\n    <li><a id=\"sign-out-button\" href=\"#\">Sign out</a></li>\n    </ul>\n    ");
  } // if they're not logged in
  else {
      navContent = "\n    <ul>\n    <li><a href=\"login.html\">Login</a></li>\n    <li><a href=\"signup.html\">Signup</a></li>\n    </ul>\n    ";
    } // render our logged in elements


  userDetails.innerHTML = navContent;
};

checkLogin(); // Sign out button

var signoutBtn = document.getElementById("sign-out-button");

var logOut = function logOut() {
  sessionStorage.clear();
  window.location.reload();
};

if (sessionStorage.userID) {
  signoutBtn.onclick = function () {
    return logOut();
  };
} // PROJECT MODAL ------------------------------------------------------------
//---------------------- ADD STUDENT BUTTON


var addStudent = document.getElementById("addStudentBtn"); //----------------- OPEN NAV MODAL FUNCTION

var menuBtn = document.getElementById("nav-toggle-btn");
var title = document.getElementById("absolute");

menuBtn.onclick = function () {
  title.classList.toggle("black");
};