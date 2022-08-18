alert("Update User")
const modalEdit = bootstrap.Modal.getOrCreateInstance(document.getElementById("adminEditModal"));

on(document, 'click', '.delBut', (e) =>{
    const p = e.target.parentNode.parentNode;
    document.getElementById("idEdit").value = p.children[0].innerHTML;
    document.getElementById("firstNameEdit").value = p.children[1].innerHTML;
    document.getElementById("lastNameEdit").value = p.children[2].innerHTML;
    document.getElementById("ageEdit").value = p.children[3].innerHTML;
    document.getElementById("emailEdit").value = p.children[4].innerHTML;
    modalEdit.show();
})


const on =(element, event, selector, handler) => {
    element.addEventListener(event, (e) =>{
        if(e.target.closest(selector)){
            handler(e)
        }
    })
}


document.getElementById("adminFormEdit").addEventListener('submit', (e) => {
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

    fetch('http://localhost:8080/admin/' + idEl, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(res=>res.json())
        .then(data => {
            const table = document.getElementById("adminTableBody");
            for(let i = 0 ; i < table.children.length; i++){
                if(table.children[i].firstElementChild.innerHTML === idEl){
                    table.children[i].innerHTML = createLine(data);
                    break;
                }
            }

        });
    modalEdit.hide();
})
