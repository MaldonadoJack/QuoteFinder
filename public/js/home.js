document.querySelector("#keywordForm").addEventListener("submit" , validateForm);

function validateForm() {
    let keyword = document.querySelector("#keyword").value;
    // alert(keyword);

    if (keyword.length < 4) {
        alert("Keyword must be longer than 3 characters");
        event.preventDefault(); //prevents the submission of the form
    }
}