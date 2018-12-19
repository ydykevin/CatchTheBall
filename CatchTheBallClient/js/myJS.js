$(document).ready(function () {

    var server = "http://127.0.0.1:5000/"

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
                    //url: "https://api.mlab.com/api/1/databases/ball/collections/User?apiKey=zZBSGIydXaai821m_HybLVGYFegwEFTh&fo=true",
                    //url: server+"login?username="+username+"&password="+password,
                    url: server+"login",
                    type: "POST",
                    data: JSON.stringify({
                        "username":username,
                        "password":password
                    }),
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    success: function (response) {
                        alert("success");
                        console.log(response);
                    },
                    error: function (e) {
                        alert("fail");
                        console.log(e);
                    }
                });
            } else {
                alert("incomplete");
            }
        }

        function register() {
            var username = $('#usernameRegister').val();
            var password = $('#passwordRegister').val();

            if(username!==""&&password!==""){
                $.ajax({
                    //url: "https://api.mlab.com/api/1/databases/ball/collections/User?apiKey=zZBSGIydXaai821m_HybLVGYFegwEFTh",
                    url: server+"register",
                    data: JSON.stringify({
                        "username": username,
                        "password": password
                    }),
                    type: "POST",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    success: function (response) {
                        alert("success");
                        console.log(response);
                    },
                    error: function (e) {
                        alert("fail");
                        console.log(e);
                    }
                });
            } else {
                alert("incomplete");
            }

        };
    });
});