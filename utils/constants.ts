export const USER = {
  name: "",
  email: "john.doe@email.com",
  address_line1: "123 Main Street",
  address_line2: "3 Travis Street",
  city: "New York",
  zipCode: "12345",
  hiringDate: "2021-01-01",
  jobTitle: "Software Engineer",
};

export const USER_WITH_LONG_ZIP_CODE = {
  ...USER,
  zipCode: "757575757575757757575757575757575757577575757575757575757575757757575757575",
};

export const USER_UPDATE = {
  name: "",
  email: "jean.dupont@email.com",
  address_line1: "1 rue de la Paix",
  address_line2: "43 rue de la tour Eiffel",
  city: "Paris",
  zipCode: "75001",
  hiringDate: "2023-07-07",
  jobTitle: "CEO",
};

export const USER_WITH_HTML_TAG = {
  name: "",
  email: "john.doe@email.com",
  address_line1: "<b>123 Main Street</b>",
  address_line2: "<b>address line 2</b>",
  city: "<b>New York</b>",
  zipCode: "12345",
  hiringDate: "2021-01-01",
  jobTitle: "<b>Software Engineer</b>",
};

export const USER_WITH_SPACE_IN_FIELD = {
  name: "   ",
  email: "john.doe@email.com",
  address_line1: "   ",
  address_line2: "   ",
  city: "   ",
  zipCode: "12345",
  hiringDate: "2021-01-01",
  jobTitle: "   ",
};

export const SQL_INJECTION = `'; DROP TABLE teams; --`;
export const DOM_XSS = `</script><script>alert("XSS")</script>`;

export const TEAM_ALREADY_EXIST_ERROR = "a team with the same name already exists";
export const EMAIL_ALREADY_EXIST_ERROR = "a user with the same email already exists";
export const ZIP_CODE_TOO_LONG_ERROR = "zip code is too long";
export const INTERNAL_SERVER_ERROR = "Server Error (500)";
export const REQUIRED_FIELD_ERROR = "This field is required";

export const UPDATE_BASIC_INFO = "Update basic info";
export const UPDATE_ADDRESS = "Update address";
export const UPDATE_CONTRACT = "Update contract";
export const UPDATE_MANAGER = "Promote as manager";

export const BASE_URL = "https://c.hr.dmerej.info";