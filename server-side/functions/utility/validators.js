// email regular expression
const isEmail = (email) => {
    const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // if its true the email has the correct format, otherwise is not an email
    if(email.match(emailRegEx)) return true;
    else return false;
  }
  
  // check if the string is empty
  const isEmpty = (string) => {
    if(string.trim() == '') return true;
    else return false;
  }

  // validate sign up data
  exports.validateSignupData = (data) => {

    // initialize errors object
    let errors = {};
  
    // check if email is empty
    if(isEmpty(data.email)) {
      errors.email = 'Email must not be empty'
    } else if(!isEmail(data.email)){                    // check if email is valid
      errors.email = 'Must be a valid email address'
    }
    
    // check if passowrd is empty
    if(isEmpty(data.password)) errors.password = 'Must not be empty'
    // check if passwords match
    if(data.password !==  data.confirmPassword) errors.confirmPassword = 'Password must match'
    // check if username is empty
    if(isEmpty(data.handle)) errors.handle = 'Must not be empty'

    // return errors and if errors length > 0 that means the data inserted are not valid
    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
  }

  // validate login data
  exports.validateLoginData = (data) => {
    // initialize errors object
    let errors = {};
    // check if email is empty
    if(isEmpty(data.email)) errors.email = 'Must not be empty';
    // check if password is empty
    if(isEmpty(data.password)) errors.password = 'Must not be empty';
    // return errors and if errors length > 0 that means the data inserted are not valid
    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }

  }