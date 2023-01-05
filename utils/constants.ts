export const USER = {
  name: "",
  email: "john.doe@email.com",
  address: {
    street: "123 Main Street",
    city: "New York",
    zipCode: "12345",
  },
  hiringDate: "2021-01-01",
  jobTitle: "Software Engineer",
};

export const USER_WITH_LONG_ZIP_CODE = {
  ...USER,
  address: {
    ...USER.address,
    zipCode: "757575757575757757575757575757575757577575757575757575757575757757575757575",
  },
};

export const USER_UPDATE = {
  name: "",
  email: "jean.dupont@email.com",
  address: {
    street: "1 rue de la Paix",
    city: "Paris",
    zipCode: "75001",
  },
  hiringDate: "2023-07-07",
  jobTitle: "CEO",
};

export const USER_WITH_HTML_TAG = {
  name: "",
  email: "john.doe@email.com",
  address: {
    street: "<b>123 Main Street</b>",
    city: "<b>New York</b>",
    zipCode: "12345",
  },
  hiringDate: "2021-01-01",
  jobTitle: "<b>Software Engineer</b>",
};

export const SQL_INJECTION = `'; DROP TABLE teams; --`;
export const DOM_XSS = `</script><script>alert("XSS")</script>`;

export const TEAM_ALREADY_EXIST_ERROR = "a team with the same name already exists";
export const INTERNAL_SERVER_ERROR = "Server Error (500)";
export const REQUIRED_FIELD_ERROR = "This field is required";

export const UPDATE_BASIC_INFO="Update basic info";
export const UPDATE_ADDRESS="Update address";
export const UPDATE_CONTRACT="Update contract";
export const UPDATE_MANAGER="Promote as manager";