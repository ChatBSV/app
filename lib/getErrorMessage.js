// filepath: lib/getErrorMessage.js

export default function getErrorMessage(error) {
    let errorMessage = "";
    if (error && typeof error === 'object') {
        if (error.response && error.response.data && typeof error.response.data === 'object' && error.response.data.message) {
            errorMessage = error.response.data.message;
        } else if (error.message) {
            errorMessage = error.message;
        } else if (error.code) {
            errorMessage = `An error occurred: ${error.code}`;
        } else {
            errorMessage = "An unexpected error occurred.";
        }
    } else {
        errorMessage = "An error occurred and no additional information is available.";
    }
    return errorMessage;
}
