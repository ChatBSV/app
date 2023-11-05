// lib/getErrorMessage.js

export default function getErrorMessage(error) {
    let errorMessage = "";
    if (error.response && error.response.data && error.response.data.message) {
    errorMessage = error.response.data.message;
    } else if (error.message) {
    errorMessage = error.message;
    } else {
    errorMessage = "An unexpected error occurred.";
    }
    return errorMessage;
    }