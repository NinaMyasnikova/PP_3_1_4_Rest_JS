const url = 'http://localhost:8080/api/admin/users';
const urlPrincipal = 'http://localhost:8080/api/user';
const newUserForm = document.getElementById("newUser");
const editUserForm = document.getElementById("editForm");
const deleteUserForm = document.getElementById("deleteForm");

$(document).ready(function (){
    getAuthUserInfo();
    getAllUsersTable();
})

$("#userPanelTable-tab").click(function () {
    getUserTable()
});

$("#adminPanelTable-tab").click(function () {
    getAllUsersTable();
})

$("#usersTable-tab").click(function () {
    clearNewForm();
})

function getAllUsersTable() {
    $("#users").empty();
    fetch(url, {
        method:"GET",
        headers: {
            "Content-type": "application/json"
        },
    })
        .then(res => res.json())
        .then(data => {
            data.forEach(user => {
                $('#users').append($('<tr id="usersRows">')).append(
                    $('<td>').text(user.id),
                    $('<td>').text(user.name),
                    $('<td>').text(user.lastName),
                    $('<td>').text(user.age),
                    $('<td>').text(user.mail),
                    $('<td>').text(user.roles.map(role => role.name.substring(5)).join(" ")),
                    $('<td>').append($('<button>').text("Edit").attr({
                        "type": "button",
                        "class": "btn btn-primary edit",
                        "data-toggle": "modal",
                        "data-target": "#editUserModal",
                        "id": "editUser` + user.id + `",
                    }).data("user", user)),
                    $('<td>').append($('<button>').text("Delete").attr({
                        "type": "button",
                        "class": "btn btn-danger delete",
                        "data-toggle": "modal",
                        "data-target": "#deleteUserModal",
                    }).data("user", user)),
                )
            })
        })
}

function getAuthUserInfo() {
    fetch(urlPrincipal)
        .then(response => (response.json()))
        .then(data => {
            authUser(data.mail,
                JSON.stringify(data.roles.map(role => role.name.substring(5)).join(" ")).replaceAll('"', ''));
        })
}

function authUser(userAuthority, userRolesAuthority) {
    document.getElementById("userAuthority").textContent = userAuthority;
    document.getElementById("userRolesAuthority").textContent = userRolesAuthority;
}

newUserForm.addEventListener("submit", (e)=>{
    e.preventDefault();

    let selectedRoles = []
    const values = $('#rolesNewSelect').val();
    for (let i = 0; i < values.length; i++) {
        selectedRoles.push({
            id: values[i]==="ROLE_ADMIN" ? 1 : 2 ,
            name: values[i]
        })
    }

    fetch('http://localhost:8080/api/admin/users', {
        method:"POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            name: document.getElementById('nameNew').value,
            lastName: document.getElementById('lastNameNew').value,
            mail: document.getElementById('mailNew').value,
            age: document.getElementById('ageNew').value,
            password: document.getElementById('passwordNew').value,
            roles: selectedRoles
        })
    })
        .then(()=>{
            document.getElementById("usersTable-tab").click()
            getAllUsersTable()
            clearNewForm()
        })

})

$(document).on("click", ".edit", function() {
    let editUser = $(this).data('user');
    $("#idEdit").val(editUser.id);
    $("#nameEdit").val(editUser.name);
    $("#lastNameEdit").val(editUser.lastName);
    $("#mailEdit").val(editUser.mail);
    $("#ageEdit").val(editUser.age);
    $("#passwordEdit").val('');

    if (editUser.roles[0].name === 'ROLE_ADMIN') {
        $('#rolesEditSelect option[value="ROLE_ADMIN"]').prop('selected', true)
    }
    if (editUser.roles[0].name === 'ROLE_USER') {
        $('#rolesEditSelect option[value="ROLE_USER"]').prop('selected', true)
    }
    if (editUser.roles.length > 1) {
        $('#rolesEditSelect option').prop('selected', true)
    }
})



editUserForm.addEventListener("submit", (e)=>{
    e.preventDefault();

    let selectedRoles = []
    const values = $('#rolesEditSelect').val();
    for (let i = 0; i < values.length; i++) {
        selectedRoles.push({
            id: values[i]==="ROLE_ADMIN" ? 1 : 2 ,
            name: values[i]
        })
    }

    fetch('http://localhost:8080/api/admin/users/' + document.getElementById('idEdit').value, {
        method:"PUT",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            id: document.getElementById('idEdit').value,
            name: document.getElementById('nameEdit').value,
            lastName: document.getElementById('lastNameEdit').value,
            password: document.getElementById('passwordEdit').value,
            mail: document.getElementById('mailEdit').value,
            age: document.getElementById('ageEdit').value,
            roles: selectedRoles
        })
    })
        .then(()=>{
            getAllUsersTable()
            $("#editUserModal").modal("hide")
            clearSelectEditForm()
        })
})

$(document).on("click", ".delete", function() {
    let userDelete = $(this).data('user');
    $("#idDelete").val(userDelete.id);
    $("#nameDelete").val(userDelete.name);
    $("#lastNameDelete").val(userDelete.lastName);
    $("#mailDelete").val(userDelete.mail);
    $("#ageDelete").val(userDelete.age);
    if (userDelete.roles[0].name === 'ROLE_ADMIN') {
        $('#rolesDeleteSelect option[value="ROLE_ADMIN"]').prop('selected', true)
    }
    if (userDelete.roles[0].name === 'ROLE_USER') {
        $('#rolesDeleteSelect option[value="ROLE_USER"]').prop('selected', true)
    }
    if (userDelete.roles.length > 1) {
        $('#rolesDeleteSelect option').prop('selected', true)
    }
});

deleteUserForm.addEventListener("submit", (e)=>{
    e.preventDefault();

    let selectedRoles = []
    const values = $('#rolesDeleteSelect').val();
    for (let i = 0; i < values.length; i++) {
        selectedRoles.push({
            id: values[i]==="ROLE_ADMIN" ? 1 : 2 ,
            name: values[i]
        })
    }

    fetch('http://localhost:8080/api/admin/users/' + document.getElementById('idDelete').value, {
        method:"DELETE",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            id: document.getElementById('idDelete').value,
            name: document.getElementById('nameDelete').value,
            lastName: document.getElementById('lastNameDelete').value,
            mail: document.getElementById('mailDelete').value,
            age: document.getElementById('ageDelete').value,
            roles: selectedRoles
        })
    })
        .then(()=>{
            $("#deleteUserModal").modal("hide")
            getAllUsersTable()
        })
})

function getUserTable() {
    $("#userPrincipal").empty();
    fetch(urlPrincipal, {
        method:"GET",
        headers: {
            "Content-type": "application/json"
        },
    })
        .then(res => res.json())
        .then(user => {
            $('#userPrincipal').append($('<tr>')).append(
                $('<td>').text(user.id),
                $('<td>').text(user.name),
                $('<td>').text(user.lastName),
                $('<td>').text(user.age),
                $('<td>').text(user.mail),
                $('<td>').text(user.roles.map(role=>role.name.substring(5)).join(" "))
            )
        })
}

$('#editUserModal').on('hidden.bs.modal', function () {
    clearSelectEditForm()
})

$('#deleteUserModal').on('hidden.bs.modal', function () {
    clearSelectEditForm()
})

function clearSelectEditForm() {
    $('#rolesEditSelect option').prop('selected', false);
}

function clearNewForm() {
    document.getElementById("nameNew").value = ''
    document.getElementById("lastNameNew").value = ''
    document.getElementById("ageNew").value = ''
    document.getElementById("mailNew").value = ''
    document.getElementById("passwordNew").value = ''
    $('#rolesNewSelect option').prop('selected', false);
}