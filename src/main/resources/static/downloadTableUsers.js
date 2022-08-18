// function loadUsersTable() {
// // Добавляем аттрибут к кнопке "таблица" и содержимое таблицы - Активный
//     $('#nav-table-tab').addClass('active');
//     $('#nav-usersTable').addClass('show').addClass('active');
// // Удаляем аттрибут Активный у кнопки "Новый пользователь" и отключаем содержимое
//     $('#nav-newUser-tab').removeClass('active');
//     $('#nav-newUser').removeClass('show').removeClass('active');
// // Грузим содержимое таблицы
//     getAllUsers;
// }
//
// // Функция загрузки содержимого таблицы
// const getAllUsers =
// // Отправляем запрос на адрес "/admin/all", не добавляя к запросу опций, по факту обычный метод GET
//     fetch("http://localhost:8080/admin/all")
//         .then(response => response.json())
//         .then(users => {
//             usersTableId.empty();
//             users.forEach(user => _appendUserRow(user))
//         });
// // Браузер сразу же начинает запрос и возвращает промис,
// // который внешний код использует для получения результата.
// // .then(function (response) {
// // Проверка на успешность запроса
// // if (response.ok) {
// //     // .json() анализирует ответ и возвращает новый промис
// //     // метод возвращает обязательство при благоприятном исходе вернуть объект, который получен после JSON.parse(текст тела ответа).
// //     response.json()
// //         // Передаем в функцию наш промис
// //         .then(users => {
// //         // Очищаем содержимое таблицы
// //         usersTableId.empty();
// //         // Заполняем таблицу, передавая в метод _appendUserRow пользователя
// //         users.forEach(user => {
// //             _appendUserRow(user);
// //         });
// //     });
// //     // В случае ошибки передаем в консоль сообщение с ошибкой
// // } else {
// //     console.error('Network request for users.json failed with response ' + response.status + ': ' + response.statusText);
// // }
// //     });
//
//
// function _appendUserRow(user) {
//     usersTableId
//         // Добавляем содержимое строк таблицы
//         .append($('<tr class="border-top bg-light">').attr('id', 'userRow[' + user.id + ']')
//             // Добавляем id
//             .append($('<td>').attr('id', 'userData[' + user.id + '][id]').text(user.id))
//             // Добавляем firstName
//             .append($('<td>').attr('id', 'userData[' + user.id + '][firstName]').text(user.firstName))
//             // Добавляем lastName
//             .append($('<td>').attr('id', 'userData[' + user.id + '][lastName]').text(user.lastName))
//             // Добавляем age
//             .append($('<td>').attr('id', 'userData[' + user.id + '][age]').text(user.age))
//             // Добавляем email
//             .append($('<td>').attr('id', 'userData[' + user.id + '][email]').text(user.email))
//             // Добавляем roles
//             .append($('<td>').attr('id', 'userData[' + user.id + '][roles]').text(user.roles.map(role => role.name)))
//             // Добавляем button Edit
//             .append($('<td>').append($('<button type="button" class="editBut btn btn-primary btn-lg" ' +
//                 'data-toggle="modal" data-target="#adminEditModal">')
//                 // При нажатии кнопки грузим Модальное окно по редактированию пользователя
//                 // .click(() => {
//                 //     loadUserAndShowModalForm(user.id);})
//                 .text('Edit')))
//             // Добавляем button Delete
//             .append($('<td>').append($('<button type="button" class="delBut btn btn-danger btn-lg" ' +
//                 'data-toggle="modal" data-target="#adminDeleteModal">')
//                 // При нажатии кнопки грузим Модальное окно по удалению пользователя
//                 // .click(() => {
//                 //     loadUserAndShowModalForm(user.id, false);})
//                 .text('Delete')))
//         );
// }
//
// loadUsersTable();