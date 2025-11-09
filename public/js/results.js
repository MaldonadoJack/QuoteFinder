$("#closeModal").addEventListener("click", () => {
    $("#authorModal").close();
});

let authorLinks = document.querySelectorAll(".authors");

for (let i of authorLinks) {
    i.addEventListener("click", getAuthorInfo);
}

function $(selector) {
    return document.querySelector(selector);
}

async function getAuthorInfo() {
    let authorId = this.getAttribute("authorId");
    let url = "api/authorInfo/" + authorId;
    let response = await fetch(url);
    let data = await response.json();
    console.log(data);
    $("#authorName").textContent = data[0].firstName + " " + data[0].lastName;
    $("#authorImg").src = data[0].portrait;
    $("#authorModal").showModal();
}