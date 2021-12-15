function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validateCredentials(username, email, password, options) {
    // If no username or email was provided by user

    if (!options.skipUsernameEmail) {
        if (!username && !email) {
            return {
                error: 'Please enter an email address.',
                status: false
            }
        }
    }


    if (!options.skipPassword) {

        if (!password) {
            // If no password was entered by user
            return {
                error: 'Password is required.',
                status: false
            }
        } else if (password.length < options.passwordLength) {
            // If password length was lesser than the options.passwordLength 
            return {
                error: `Password must be at least ${options.passwordLength} characters`,
                status: false
            }
        }
    }


    // Primary authWith should be either email or username. 
    const authWith = options.authWith;

    if (options.skipUsernameEmail) {
        // Skip usernmae and email check? Fine.
        return {error: null, status: true} 
    }

    if (authWith === 'email') {

        if (!validateEmail(email)) {
            return {
                error: `Email is incorrect`,
                status: false
            }
        }
    } else if (authWith === 'username') {

        if (username.length < options.usernameLength) {
            return {
                error: `Username must be alteast ${options.usernameLength} characters`,
                status: false
            }
        }
    }

    return {
        error: null,
        status: true
    }

}

module.exports = validateCredentials