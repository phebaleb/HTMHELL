const server = 'http://localhost:3100';

const signupBtn = document.getElementById("signup-login-button");
const usernameInput = document.getElementById("name-input");
const passwordInput = document.getElementById("password-input");
const profileImgInput = document.getElementById("image-url-input");

signupBtn.onclick = function () {
    event.preventDefault();

    let username = usernameInput.value;
    let password = passwordInput.value;
    let profileImg = profileImgInput.value;

    // testing if getting correct data from inputs
    // console.log(username, password, profileImg);

    $.ajax({
        url: `${server}/registeruser`,
        type: 'POST',
        data: {
            username: username,
            password: password,
            profileImg: profileImg
        },
        success: function (user) {
            if (user !== 'username exists') {
                console.log("nice you signed up");
                console.log(user);

                $.ajax({
                    url: `${server}/loginuser`,
                    type: 'POST',
                    data: {
                        username: usernameInput.value,
                        password: passwordInput.value,
                        profileImg: profileImgInput.value
                    },
                    success: function (user) {
                        if (user == 'user not found') {
                            console.log("User not found. Please register")
                        } else if (user == 'not authorised') {
                            console.log("Incorrect password.");
                        } else {
                            console.log("logged in successfully. Loggin in as:")
                            console.log(user);
                            // set the local storage (cookie) properties equal to the retrieved data
                            sessionStorage.setItem('userID', user._id);
                            sessionStorage.setItem('userName', user.username)
                            sessionStorage.setItem('profileImg', user.profile_img_url)

                            //redirect to the homepage
                            document.location.href = 'index.html'
                        }//end ifs
                    }, //end of success
                    error: function () {
                        console.log('error: cannot call api')
                        alert('Unable to login - unable to call api')
                    }// error
                })//end of ajax

            } else {
                console.log('username taken already. Please try another name')
            } //end of else
            //if register is successful - log user in Ends
        },// end of success for giant ajax
        error: function (err) {
            console.log('error: cannot call api')
        }//end of error
    }) //end of ajax post
}// end of signupBtn onclick