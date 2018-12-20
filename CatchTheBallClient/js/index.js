$(document).ready(function () {

    var server = "http://192.168.1.8:5000/";

    document.addEventListener('init', function (event) {
        var page = event.target;

        if (page.id === 'loginPage') {
            page.querySelector('#signUpBtn').onclick = function () {
                document.querySelector('#myNavigator').pushPage('register.html');
            };
            $("#loginBtn").click(function () {
                login();
            });
        } else if (page.id === 'registerPage') {
            $("#registerBtn").click(function () {
                register();
            });
        }

        function login() {
            var username = $('#usernameLogin').val();
            var password = $('#passwordLogin').val();

            if(username!==""&&password!==""){
                $.ajax({
                    url: server+"login",
                    type: "POST",
                    data: JSON.stringify({
                        "username":username,
                        "password":password
                    }),
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    success: function (response) {
                        console.log(response);
                        if(response.login){
                            window.localStorage.setItem("username",username);
                            window.location.href="html/lobby.html";
                        } else {
                            $("#loginError").text("incorrect username or password");
                        }
                    },
                    error: function (e) {
                        alert("fail");
                        console.log(e);
                    }
                });
            } else {
                alert("Please complete the fields");
            }
        }

        function register() {
            var username = $('#usernameRegister').val();
            var password = $('#passwordRegister').val();

            if(username!==""&&password!==""){
                $.ajax({
                    url: server+"register",
                    data: JSON.stringify({
                        "username": username,
                        "password": password
                    }),
                    type: "POST",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    success: function (response) {
                        console.log(response);
                        if(response.register){
                            window.localStorage.setItem("username",username);
                            window.location.href="html/lobby.html";
                        } else {
                            $("#registerError").text("username existed");
                        }
                    },
                    error: function (e) {
                        alert("fail");
                        console.log(e);
                    }
                });
            } else {
                alert("Please complete the fields");
            }

        };
    });
});