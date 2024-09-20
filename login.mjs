<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Signup Form</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        .input-wrapper {
            position: relative;
            margin-bottom: 15px;
        }

        .input-wrapper label {
            display: block;
            margin-bottom: 5px;
            font-size: 0.8em;
            color: #333;
            font-weight: 700;
        }

        .input-wrapper input {
            padding: 8px;
            padding-right: 40px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 0.7em;
            width: 100%;
            box-sizing: border-box;
            background-color: #ffffff;
            outline: none;
        }

        .input-wrapper input:focus {
            border-color: #7ebbfd;
        }

        .input-wrapper .input-icon {
            font-size: 16px;
            color: #7ebbfd;
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            pointer-events: none;
        }

        #message {
            color: red;
            margin-top: 10px;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="main-container">
        <div class="image-container">
            <img src="LHS.jpg" alt="Company Logo">
        </div>
        <div class="form-container">
            <div id="header">
                <h1>Sign Up</h1>
                <p>Enter details to proceed</p>
            </div>
            <form onsubmit="signup(); return false;">
                <div class="input-wrapper">
                    <label for="fullName">Full Name</label>
                    <input type="text" id="fullName" placeholder="Enter your full name" required>
                    <i class="fas fa-user input-icon"></i>
                </div>

                <div class="input-wrapper">
                    <label for="email">Email</label>
                    <input type="email" id="email" placeholder="Enter email address" required>
                    <i class="fas fa-envelope input-icon"></i>
                </div>

                <div class="input-wrapper">
                    <label for="username">Username</label>
                    <input type="text" id="username" placeholder="Create a username" required>
                    <i class="fas fa-user-tag input-icon"></i>
                </div>

                <div class="input-wrapper">
                    <label for="password">Password</label>
                    <input type="password" id="password" placeholder="**************************************" required>
                    <i class="fas fa-lock input-icon"></i>
                </div>

                <div class="input-wrapper">
                    <label for="repeatPassword">Confirm Password</label>
                    <input type="password" id="repeatPassword" placeholder="**************************************" required>
                    <i class="fas fa-lock input-icon"></i>
                </div>

                <label>
                    <input type="checkbox" id="terms" required>
                    Agree to <a href="#" rel="noopener noreferrer">Terms And Privacy Policy</a>
                </label>

                <input type="submit" value="Join">
                
                <p id="message"></p>
                <p class="login-link"><a href="/LoginPage/login.html">Already a Member? Login here</a></p>
            </form>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script>
        function signup() {
            var fullName = document.getElementById('fullName').value;
            var email = document.getElementById('email').value;
            var username = document.getElementById('username').value;
            var password = document.getElementById('password').value;
            var repeatPassword = document.getElementById('repeatPassword').value;

            // Validate passwords
            if (password !== repeatPassword) {
                document.querySelector("#message").innerHTML = 'Passwords do not match, please try again';
                return;
            }

            // Clear previous messages
            document.querySelector("#message").innerHTML = '';

            // Send signup request
            axios.post('/signup', {
                fullName,
                email: email.toLowerCase(),
                username,
                password,
            })
            .then(function (response) {
                console.log(response.data);
                document.querySelector("#message").innerHTML = response.data.message;
            })
            .catch(function (error) {
                // Handle error messages
                if (error.response && error.response.data) {
                    document.querySelector("#message").innerHTML = error.response.data.message;
                } else {
                    document.querySelector("#message").innerHTML = 'An unexpected error occurred. Please try again.';
                }
                console.error('Signup error:', error);
            });
        }
    </script>
</body>
</html>
