import validator from "validator";

const allowedClasses = [
  "HSC 1st Year",
  "HSC 2nd Year",
  "SSC",
];

export const validateRegistration =
  (data) => {
    const {
      name,
      className,
      school,
      phone,
      email,
      password,
      confirmPassword,
    } = data;

    if (
      !name ||
      name.length < 3
    ) {
      return "Name minimum 3 characters";
    }

    if (name.length > 50) {
      return "Name maximum 50 characters";
    }

    if (
      !className ||
      !allowedClasses.includes(
        className
      )
    ) {
      return "Invalid class";
    }

    if (
      !school ||
      school.length < 3
    ) {
      return "School minimum 3 characters";
    }

    if (
      !/^01[3-9]\d{8}$/.test(phone)
    ) {
      return "Invalid phone number";
    }

    if (
      !validator.isEmail(email)
    ) {
      return "Invalid email";
    }

    if (
      !validator.isStrongPassword(
        password,
        {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        }
      )
    ) {
      return "Weak password";
    }

    if (
      password !==
      confirmPassword
    ) {
      return "Passwords do not match";
    }

    return null;
  };