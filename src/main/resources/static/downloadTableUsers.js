const modalEdit = bootstrap.Modal.getOrCreateInstance(document.getElementById("editModal"));
const modalDelete = bootstrap.Modal.getOrCreateInstance(document.getElementById("deleteModal"));

const createLine = (el) =>{
    return `<tr>
                <td>${el.id}</td>
                <td>${el.name}</td>  
                <td>${el.secondName}</td>  
                <td>${el.age}</td>  
                <td>${el.mail}</td>  
                <td>${el.rolesString}</td>
                <td>
                    <button type="button" class="editBut btn btn-primary btn-lg" data-toggle="modal"
                        data-target="#editModal">
                            Edit
                    </button>
                </td>
                <td>
                    <button type="button" class="delBut btn btn-danger btn-lg" data-toggle="modal"
                    data-target="#deleteModal">
                    Delete
                    </button>
                </td>
            </tr>`;
}

const renderPost = (data) =>{
    let temp = "";
    data.forEach((el)=>{
        temp += createLine(el);
    })
    document.getElementById("tableBody").innerHTML += temp;
}

fetch("http://localhost:8082/api/users")
    .then(res=>res.json())
    .then(data=> renderPost(data));

document.getElementById("formAdd").addEventListener('submit', (e) => {
    e.preventDefault();

    let role = [];

    let elem = document.getElementById("roleSelect");
    for (let i = 0; i < elem.options.length; i++) {
        if (elem.options[i].selected)
            role.push(elem.options[i].text);
        elem.options[i].selected = false;
    }

    let user = {
        id : 0,
        name: document.getElementById("name").value,
        secondName: document.getElementById("secondName").value,
        age: document.getElementById("age").value,
        password: document.getElementById("password").value,
        mail: document.getElementById("mail").value,
        roles : role
    }

    document.getElementById("name").value = "";
    document.getElementById("secondName").value = "";
    document.getElementById("age").value = "";
    document.getElementById("password").value = "";
    document.getElementById("mail").value = "";

    let response = fetch("http://localhost:8082/api/users", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(res=>res.json())
        .then(data => {
            const dataArr = [];
            dataArr.push(data);
            renderPost(dataArr);
        });

})

const on =(element, event, selector, handler) => {
    element.addEventListener(event, (e) =>{
        if(e.target.closest(selector)){
            handler(e)
        }
    })
}

on(document, 'click', '.editBut', (e) =>{
    const p = e.target.parentNode.parentNode;
    document.getElementById("idEdit").value = p.children[0].innerHTML;
    document.getElementById("firstNameEdit").value = p.children[1].innerHTML;
    document.getElementById("lastNameEdit").value = p.children[2].innerHTML;
    document.getElementById("ageEdit").value = p.children[3].innerHTML;
    document.getElementById("emailEdit").value = p.children[4].innerHTML;
    modalEdit.show();
})

on(document, 'click', '.delBut', (e) =>{
    const p = e.target.parentNode.parentNode;
    document.getElementById("idDelete").value = p.children[0].innerHTML;
    document.getElementById("firstNameDelete").value = p.children[1].innerHTML;
    document.getElementById("lastNameDelete").value = p.children[2].innerHTML;
    document.getElementById("ageDelete").value = p.children[3].innerHTML;
    document.getElementById("emailDelete").value = p.children[4].innerHTML;
    modalDelete.show();
})



document.getElementById("formEdit").addEventListener('submit', (e) => {
    e.preventDefault();
    let role = [];
    let elem = document.getElementById("roleEdit");
    for (let i = 0; i < elem.options.length; i++) {
        if (elem.options[i].selected)
            role.push(elem.options[i].text);
        elem.options[i].selected = false;
    }

    const idEl = document.getElementById("idEdit").value;
    const nameEl = document.getElementById("firstNameEdit");
    const secondNameEl = document.getElementById("lastNameEdit");
    const ageEl = document.getElementById("ageEdit");
    const passwordEl = document.getElementById("passwordEdit");
    const mailEl = document.getElementById("emailEdit");

    let user = {
        id : idEl,
        name: nameEl.value,
        secondName: secondNameEl.value,
        age: ageEl.value,
        password: passwordEl.value,
        mail: mailEl.value,
        roles : role
    }


    nameEl.value = "";
    secondNameEl.value = "";
    ageEl.value = "";
    passwordEl.value = "";
    mailEl.value = "";

    fetch('http://localhost:8082/api/users/', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(res=>res.json())
        .then(data => {
            const table = document.getElementById("tableBody");
            for(let i = 0 ; i < table.children.length; i++){
                if(table.children[i].firstElementChild.innerHTML == idEl){
                    table.children[i].innerHTML = createLine(data);
                    break;
                }
            }

        });
    modalEdit.hide();
})

document.getElementById("adminFormDelete").addEventListener('submit', (e) => {
    e.preventDefault();
    const nameEl = document.getElementById("firstNameDelete");
    const secondNameEl = document.getElementById("lastNameDelete");
    const ageEl = document.getElementById("ageDelete");
    const mailEl = document.getElementById("emailDelete");
    const id = document.getElementById("idDelete").value;
    nameEl.value = "";
    secondNameEl.value = "";
    ageEl.value = "";
    mailEl.value = "";

    fetch('http://localhost:8082/api/users/' + id, {
        method: 'DELETE'
    })
        .then(res=>res.json())
        .then(data => {
            const table = document.getElementById("tableBody");
            for(let i = 0 ; i < table.children.length; i++){
                if(table.children[i].firstElementChild.innerHTML == id){
                    table.children[i].remove();
                    break;
                }
            }

        });
    modalDelete.hide();
})





