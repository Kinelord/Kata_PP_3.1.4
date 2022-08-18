alert("Delete User")
const modalDelete = bootstrap.Modal.getOrCreateInstance(document.getElementById("adminDeleteModal"));



on(document, 'click', '.delBut', (e) =>{
    const p = e.target.parentNode.parentNode;
    document.getElementById("idDelete").value = p.children[0].innerHTML;
    document.getElementById("firstNameDelete").value = p.children[1].innerHTML;
    document.getElementById("lastNameDelete").value = p.children[2].innerHTML;
    document.getElementById("ageDelete").value = p.children[3].innerHTML;
    document.getElementById("emailDelete").value = p.children[4].innerHTML;
    modalDelete.show();
})


const on =(element, event, selector, handler) => {
    element.addEventListener(event, (e) =>{
        if(e.target.closest(selector)){
            handler(e)
        }
    })
}


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

    fetch('http://localhost:8080/admin/' + id, {
        method: 'DELETE'
    })
        .then(res=>res.json())
        .then(data => {
            const table = document.getElementById("adminTableBody");
            for(let i = 0 ; i < table.children.length; i++){
                if(table.children[i].firstElementChild.innerHTML === id){
                    table.children[i].remove();
                    break;
                }
            }

        });
    modalDelete.hide();
})

