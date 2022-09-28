const urlPrincipal = 'http://localhost:8080/api/user';

$(document).ready(function (){
    getUserTable();
    getAuthUserInfo();
})

function getUserTable() {
    $("#userLogin").empty();
    fetch(urlPrincipal, {
        method:"GET",
        headers: {
            "Content-type": "application/json"
        },
    })
        .then(res => res.json())
        .then(user => {
            $('#userLogin').append($('<tr>')).append(
                $('<td>').text(user.id),
                $('<td>').text(user.name),
                $('<td>').text(user.lastName),
                $('<td>').text(user.age),
                $('<td>').text(user.mail),
                $('<td>').text(user.roles.map(role=>role.name.substring(5)).join(" "))
            )
        })
}

function authUser(userAuthority, userRolesAuthority) {
    document.getElementById("userAuthority").textContent = userAuthority;
    document.getElementById("userRolesAuthority").textContent = userRolesAuthority;
}

function getAuthUserInfo() {
    fetch(urlPrincipal)
        .then(response => (response.json()))
        .then(data => {
            authUser(data.mail, JSON.stringify(data.roles
                .map(role => role.name.substring(5)).join(" ")).replaceAll('"', ''));
        })
}