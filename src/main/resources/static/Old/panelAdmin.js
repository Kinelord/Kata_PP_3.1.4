alert("Panel Admin")

const createLine = (el) =>{
    return `<tr>
                <td>${el.id}</td>
                <td>${el.firstName}</td>  
                <td>${el.lastName}</td>  
                <td>${el.age}</td>  
                <td>${el.email}</td>  
                <td>${el.roles.map(role => role.name)}</td>
                <td>
                    <button type="button" class="editBut btn btn-primary btn-lg" data-toggle="modal"
                        data-target="#adminEditModal">
                            Edit
                    </button>
                </td>
                <td>
                    <button type="button" class="delBut btn btn-danger btn-lg" data-toggle="modal"
                    data-target="#adminDeleteModal">
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
    document.getElementById("adminTableBody").innerHTML += temp;
}

fetch("http://localhost:8080/admin/all")
    .then(res=>res.json())
    .then(data=> renderPost(data));
