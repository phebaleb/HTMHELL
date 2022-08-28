"use strict";

var go = document.getElementById("student-button"); // declare all our inputs

var nameInput = document.getElementById("name-input");
var titleInput = document.getElementById("title-input");
var descriptionInput = document.getElementById("description-input");
var imageURLInput = document.getElementById("image-url-input");

var showAllStudents = function showAllStudents() {
  $.ajax({
    type: "GET",
    url: "http://localhost:3100/allStudents",
    // your success function contains a object which can be named anything
    success: function success(students) {
      console.log(students);
      displayStudents(students);
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

var deleteStudent = function deleteStudent(studentId) {
  // use ajax and go to the delete route
  $.ajax({
    // Let's go to our route
    url: "http://localhost:3100/deleteStudent/".concat(studentId),
    type: "DELETE",
    success: function success() {
      showAllStudents();
    },
    error: function error() {
      console.log("Cannot call API");
    }
  });
};

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
      },
      error: function error() {
        console.log("error: cannot update");
      }
    });
  });
};

$("#student-button").click(function () {
  event.preventDefault();
  $("#addStudentModal").modal("hide");
});
$("#close-add-student").click(function () {
  event.preventDefault();
  $("#addStudentModal").modal("hide");
});

populateEditModal = function populateEditModal(studentId) {
  console.log(studentId);
  $.ajax({
    url: "http://localhost:3100/student/".concat(studentId),
    type: "GET",
    success: function success(studentData) {
      // console.log('student was found');
      // console.log(student);
      handleEditFunctionality(studentData, studentId);
    },
    error: function error(_error2) {
      console.log(_error2);
    }
  });
}; // this function will handle all our deletes


var collectDeleteButtons = function collectDeleteButtons() {
  // this will return an Array, but it's a slightly different one
  // it returns HTML "nodes" instead
  // we'll have use a regular loop to loop over these
  var deleteButtonsArray = document.getElementsByClassName("delete-button"); // this will loop over every delete button

  var _loop = function _loop(i) {
    deleteButtonsArray[i].onclick = function () {
      var currentId = deleteButtonsArray[i].parentNode.id; // delete student based on the id

      deleteStudent(currentId);
    };
  };

  for (var i = 0; i < deleteButtonsArray.length; i++) {
    _loop(i);
  }
}; // this function will handle all our edits


var collectEditButtons = function collectEditButtons() {
  // this will return an Array, but it's a slightly different one
  // it returns HTML "nodes" instead
  // we'll have use a regular loop to loop over these
  var editButtonsArray = document.getElementsByClassName("edit-button"); // this will loop over every delete button

  var _loop2 = function _loop2(i) {
    editButtonsArray[i].onclick = function () {
      var currentId = editButtonsArray[i].parentNode.id; // delete student based on the id

      populateEditModal(currentId);
      console.log(currentId);
    };
  };

  for (var i = 0; i < editButtonsArray.length; i++) {
    _loop2(i);
  }
};

var displayStudents = function displayStudents(students) {
  console.log("The render student function is running");
  result.innerHTML = "";
  students.forEach(function (item) {
    result.innerHTML += "\n      <div class=\"result-container\" id=\"".concat(item._id, "\">\n\n      <div class=\"img-container\">\n      <img src=\"").concat(item.image_url, "\" alt=\"").concat(item.name, "\">\n      <div class=\"overlay open-image\"><h1>").concat(item.name, "</h1></div>\n      </div>\n      <div class=\"short-bio\">\n      <p><span class=\"bold\">").concat(item.name, "</span> - ").concat(item.title, "</p>\n\n      </div>\n\n      ");
  }); // all students should be displayed now
  // and now we can collect the delete buttons
  // collectDeleteButtons();
  // collect edit buttons
  // collectEditButtons();

  collectOpenImages();
}; // start app


showAllStudents();

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
  console.log("You've logged out");
  sessionStorage.clear();
  window.location.reload();
};

if (sessionStorage.userID) {
  signoutBtn.onclick = function () {
    return logOut();
  };
} // PROJECT MODAL ------------------------------------------------------------


var closeModalBtn = document.getElementById("close-modal");
var projectModal = document.getElementById("projectModal"); // const openImage = document.getElementsByClassName('open-image');

var openModal = function openModal(id) {
  console.log("Clicked open modal");
  projectModal.classList.toggle("active");
  console.log(id);
};

closeModalBtn.onclick = function () {
  projectModal.classList.toggle("active");
}; // this function will handle all our edits


var collectOpenImages = function collectOpenImages() {
  console.log("Collecting images"); // this will return an Array, but it's a slightly different one
  // it returns HTML "nodes" instead
  // we'll have use a regular loop to loop over these

  var openImagesArray = document.getElementsByClassName("open-image"); // this will loop over every delete button

  var _loop3 = function _loop3(i) {
    openImagesArray[i].onclick = function () {
      var currentId = openImagesArray[i].parentNode.id;
      console.log(currentId);
      console.log("This has passed the currentId log"); // delete student based on the id

      openModal(currentId);
    };
  };

  for (var i = 0; i < openImagesArray.length; i++) {
    _loop3(i);
  }
}; // Content that will appear in the student work modal


var projectModalContent = function projectModalContent(students) {
  console.log("The project modal is running");
  projectModal.innerHTML = "";
  students.forEach(function (item) {
    projectModal.innerHTML = "\n      <div class=\"left-container\" id=\"".concat(item._id, "\">\n      <img src=\"").concat(item.image_url, "\" alt=\"").concat(item.name, "\">\n      </div>\n      <div>\n      <h2>").concat(item.name, "</h2>\n      <h4>").concat(item.title, "</h4>\n      <p>").concat(item.description, "</p>\n     </div>\n\n      <i class=\"fa-solid fa-trash-can delete-button\"></i>\n      <i class=\"fa-solid fa-pen-to-square edit-button\" data-bs-toggle=\"modal\" data-bs-target=\"#editModal\"></i>\n      </div>\n      ");
  }); // all students should be rendered now
  // and now we can collect the delete buttons

  collectDeleteButtons(); // collect edit buttons

  collectEditButtons();
}; //---------------------- ADD STUDENT BUTTON


var addStudent = document.getElementById("addStudentBtn"); //----------------- OPEN NAV MODAL FUNCTION

var menuBtn = document.getElementById("nav-toggle-btn");
var title = document.getElementById("absolute");

menuBtn.onclick = function () {
  console.log("You clicked the menu");
  title.classList.toggle("black");
};