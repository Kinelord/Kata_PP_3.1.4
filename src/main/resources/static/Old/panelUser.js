alert("Panel User")
fetch("http://localhost:8080/user").then(
    res => {
        res.json().then(
            data => {
                let temp = `<tr>
                         <td>${data.id}</td>
                         <td>${data.firstName}</td>  
                         <td>${data.lastName}</td>  
                         <td>${data.age}</td>  
                         <td>${data.email}</td>  
                         <td>${data.role}</td></tr>`
                document.getElementById("userTableBody").innerHTML = temp;
            }
        )
    }
)
