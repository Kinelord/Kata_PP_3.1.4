alert("Create New User")

document.getElementById("formAddUser").addEventListener('submit', async (e) => {
    e.preventDefault();

    let role = [];

    let elem = document.getElementById("roleSelectAdd");
    for (let i = 0; i < elem.options.length; i++) {
        if (elem.options[i].selected)
            role.push(elem.options[i].text);
        elem.options[i].selected = false;
    }

    let user = {
        id: 0,
        firstName: document.getElementById("firstNameAdd").value,
        lastName: document.getElementById("lastNameAdd").value,
        age: document.getElementById("ageAdd").value,
        password: document.getElementById("passwordAdd").value,
        email: document.getElementById("emailAdd").value,
        roles: role
    }

    document.getElementById("firstNameAdd").value = "";
    document.getElementById("lastNameAdd").value = "";
    document.getElementById("ageAdd").value = "";
    document.getElementById("passwordAdd").value = "";
    document.getElementById("emailAdd").value = "";

    fetch("http://localhost:8080/admin/create", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(res => res.json())
        .then(data => {
            const dataArr = [];
            dataArr.push(data);
            renderPost(dataArr);
        });
    downloadTable();
})