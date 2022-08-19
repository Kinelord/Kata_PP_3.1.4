const usersTableId = $('#adminTableBody');
const userFormId = $('#user-profile');
const userAddFormId = $('#formAddUser');

// Нажатие - вызывает цепочку функций по отображению вкладки "Таблица пользователей" : fragment="panel"
$('#nav-tableUsers-tab').click(() => {
    loadUsersTable();
});
// Нажатие - вызывает цепочку функций по отображению вкладки "Добавить нового пользователя"  : fragment="panel"
$('#nav-newUser-tab').click(() => {
    loadAddForm();
});
userAddFormId.find(':submit').click(() => {
    insertUser();
});

// грузим блок навигации Админа - таблица пользователей
function loadUsersTable() {
// Добавляем аттрибут к кнопке "таблица" и содержимое таблицы - Активный
    $('#nav-table-tab').addClass('active');
    $('#nav-usersTable').addClass('show').addClass('active');
// Удаляем аттрибут Активный у кнопки "Новый пользователь" и отключаем содержимое
    $('#nav-newUser-tab').removeClass('active');
    $('#nav-newUser').removeClass('show').removeClass('active');
// Грузим содержимое таблицы
    getAllUsers();
}

// Инициируем блок навигации - Админ / Пользователь
function initNavigation() {
// При нажатии на Админа - делаем активным содержимое его страницы, а содержимое пользователя отключаем
    $('#admin-page-button').click(() => {
        $('#admin-page-button').addClass('active').removeClass('btn-light').addClass('btn-primary').prop('aria-selected', true);
        $('#admin').addClass('active');
        $('#user-page-button').removeClass('active').removeClass('btn-primary').addClass('btn-light').prop('aria-selected', false);
        $('#user').removeClass('active');
    });
// При нажатии на пользователя - делаем активным содержимое его страницы, а содержимое Админа отключаем
    $('#user-page-button').click(() => {
        $('#user-page-button').addClass('active').removeClass('btn-light').addClass('btn-primary').prop('aria-selected', true);
        $('#user').addClass('active');
        $('#admin-page-button').removeClass('active').removeClass('btn-primary').addClass('btn-light').prop('aria-selected', false);
        $('#admin').removeClass('active');
    });
}

// грузим блок навигации Админа - Добавить нового пользователя
function loadAddForm() {
// Добавляем аттрибут к кнопке "Новый пользователь" и содержимое формы - Активный
    $('#nav-newUser-tab').addClass('active');
    $('#nav-newUser').addClass('show').addClass('active');
// Удаляем аттрибут Активный у кнопки "таблица" и отключаем содержимое
    $('#nav-table-tab').removeClass('active');
    $('#nav-admin').removeClass('show').removeClass('active');
// Грузим содержимое формы
    loadUserForInsertForm();
}

// Функция загрузки содержимого таблицы
function getAllUsers() {
// Отправляем запрос на адрес "/admin/all", не добавляя к запросу опций, по факту обычный метод GET
    fetch('/admin/users')
        // Браузер сразу же начинает запрос и возвращает промис,
        // который внешний код использует для получения результата.
        .then(function (response) {
            // Проверка на успешность запроса
            if (response.ok) {
                // .json() анализирует ответ и возвращает новый промис
                // метод возвращает обязательство при благоприятном исходе вернуть объект, который получен после JSON.parse(текст тела ответа).
                response.json()
                    // Передаем в функцию наш промис
                    .then(users => {
                        // Очищаем содержимое таблицы
                        usersTableId.empty();
                        // Заполняем таблицу, передавая в метод _appendUserRow пользователя
                        users.forEach(user => {
                            _appendUserRow(user);
                        });
                    });
                // В случае ошибки передаем в консоль сообщение с ошибкой
            } else {
                console.error('Network request for users.json failed with response ' + response.status + ': ' + response.statusText);
            }
        });
}

// Функция, заполнение содержимого таблицы
function _appendUserRow(user) {
    usersTableId
        // Добавляем содержимое строк таблицы
        .append($('<tr class="border-top bg-light">').attr('id', 'userRow[' + user.id + ']')
            // Добавляем id
            .append($('<td>').attr('id', 'userData[' + user.id + '][id]').text(user.id))
            // Добавляем firstName
            .append($('<td>').attr('id', 'userData[' + user.id + '][firstName]').text(user.firstName))
            // Добавляем lastName
            .append($('<td>').attr('id', 'userData[' + user.id + '][lastName]').text(user.lastName))
            // Добавляем age
            .append($('<td>').attr('id', 'userData[' + user.id + '][age]').text(user.age))
            // Добавляем email
            .append($('<td>').attr('id', 'userData[' + user.id + '][email]').text(user.email))
            // Добавляем roles
            .append($('<td>').attr('id', 'userData[' + user.id + '][roles]').text(user.roles.map(role => role.name)))
            // Добавляем button Edit
            .append($('<td>').append($('<button class="btn btn-sm btn-info">')
                // При нажатии кнопки грузим Модальное окно по редактированию пользователя
                .click(() => {
                    loadUserAndShowModalForm(user.id);
                }).text('Edit')))
            // Добавляем button Delete
            .append($('<td>').append($('<button class="btn btn-sm btn-danger">')
                // При нажатии кнопки грузим Модальное окно по удалению пользователя
                .click(() => {
                    loadUserAndShowModalForm(user.id, false);
                }).text('Delete')))
        );
}

function _eraseUserModalForm() {
    userFormId.find('.invalid-feedback').remove();
    userFormId.find('#firstName').removeClass('is-invalid');
    userFormId.find('#email').removeClass('is-invalid');
    userFormId.find('#password').removeClass('is-invalid');
    userFormId.find('#age').removeClass('is-invalid');
}

// Функция устанавливает свойства для чтения / записи
function _setReadonlyAttr(value = true) {
    userFormId.find('#firstName').prop('readonly', value);
    userFormId.find('#lastName').prop('readonly', value);
    userFormId.find('#age').prop('readonly', value);
    userFormId.find('#email').prop('readonly', value);
    userFormId.find('#password').prop('readonly', value);
    userFormId.find('#roles').prop('disabled', value);
}

function updateUser(id) {
    _eraseUserModalForm();

    let headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=utf-8');
    let user = {
        'id': parseInt(userFormId.find('#id').val()),
        'firstName': userFormId.find('#firstName').val(),
        'lastName': userFormId.find('#lastName').val(),
        'age': userFormId.find('#age').val(),
        'email': userFormId.find('#email').val(),
        'password': userFormId.find('#password').val(),
        'roles': userFormId.find('#roles').val().map(roleId => parseInt(roleId))
    };
    let request = new Request('/admin/' + id, {
        method: 'PATCH',
        headers: headers,
        body: JSON.stringify(user)
    });

    fetch(request)
        .then(function (response) {
            if (response.status === 404) {
                response.text().then((value) => console.warn("Error message: " + value));
                userFormId.modal('hide');
                return false;
            }

            response.json().then(function (userData) {
                console.log(userData);

                if (response.status === 409) {
                    userData.fieldErrors.forEach(error => {
                        userFormId.find('#' + error.field)
                            .addClass('is-invalid')
                            .parent().append($('<div class="invalid-feedback">').text(error.defaultMessage));
                    });
                    console.warn('Error: ' + userData.message);
                    return false;
                }
                if (response.status === 400) {
                    userFormId.find('#email')
                        .addClass('is-invalid')
                        .parent().append($('<div class="invalid-feedback">').text('E-mail must be unique'));
                    console.warn("Error message: " + userData.message);
                    return false;
                }

                $('#userData\\[' + userData.id + '\\]\\[firstName\\]').text(userData.firstName)
                $('#userData\\[' + userData.id + '\\]\\[lastName\\]').text(userData.lastName)
                $('#userData\\[' + userData.id + '\\]\\[age\\]').text(userData.age)
                $('#userData\\[' + userData.id + '\\]\\[email\\]').text(userData.email)
                $('#userData\\[' + userData.id + '\\]\\[roles\\]').text(userData.roles.map(role => role.name));
                userFormId.modal('hide');

                console.info("User with id = " + id + " was updated");
            });
        })
        .catch(function (err) {
            console.error('Fetch Error :-S', err);
        });
}

// Модальное окно по редактированию пользователя
function loadUserAndShowModalForm(id, editMode = true) {
// Вызываем функцию по настройке
    _eraseUserModalForm();

    // Отправляем запрос на сервер, для получения полей пользователя выбранного на редактирование
    fetch('/admin/' + id, {method: 'GET'})
        .then(function (response) {
                // Полученный ответ анализируем на корректность
                if (response.status !== 200) {
                    console.error('Looks like there was a problem. Status Code: ' + response.status);
                    if (response.status === 400) {
                        response.text().then((value) => console.warn("Error message: " + value));
                    }
                    return;
                }
                // Анализируем ответ и передаем его в функцию
                response.json().then(function (user) {
                    // find возвращает из userFormId поле с id = "id" и устанавливает в него значение val(id)
                    userFormId.find('#id').val(id);
                    // find возвращает из userFormId поле с id = "firstName" и устанавливает в него значение val(user.firstName)
                    userFormId.find('#firstName').val(user.firstName);
                    // find возвращает из userFormId поле с id = "lastName" и устанавливает в него значение val(user.lastName)
                    userFormId.find('#lastName').val(user.lastName);
                    // find возвращает из userFormId поле с id = "age" и устанавливает в него значение val(user.age)
                    userFormId.find('#age').val(user.age);
                    // find возвращает из userFormId поле с id = "email" и устанавливает в него значение val(user.email)
                    userFormId.find('#email').val(user.email);
                    // find возвращает из userFormId поле с id = "password" и устанавливает в него значение val('')
                    userFormId.find('#password').val('');

                    // Проверка, если в метод был передан true, то метод ведет себя под Edit
                    if (editMode) {
                        // find возвращает из userFormId поле с class = "modal-title" и устанавливает в него значение val('Edit user')
                        userFormId.find('.modal-title').text('Edit user');
                        // find возвращает из userFormId поле с id = "password-div" и show() отображает скрытое значение
                        userFormId.find('#password-div').show();
                        // find возвращает из userFormId поле с class = "submit" и корректирует его под Edit
                        userFormId.find('.submit').text('Edit').removeClass('btn-danger').addClass('btn-primary')
                            .removeAttr('onClick')
                            .attr('onClick', 'updateUser(' + id + ');');
                        // Статус для редактирования / чтения
                        _setReadonlyAttr(false);

                        // Иначе, в метод был передан false, метод ведет себя под Delete
                    } else {
                        // find возвращает из userFormId поле с class = "modal-title" и устанавливает в него значение val('Delete user')
                        userFormId.find('.modal-title').text('Delete user');
                        // find возвращает из userFormId поле с id = "password-div" и hide() скрывает значение поля
                        userFormId.find('#password-div').hide();
                        // find возвращает из userFormId поле с class = "submit" и корректирует его под Delete
                        userFormId.find('.submit').text('Delete').removeClass('btn-primary').addClass('btn-danger')
                            .removeAttr('onClick')
                            .attr('onClick', 'deleteUser(' + id + ');');
                        // Статус для редактирования / чтения
                        _setReadonlyAttr();
                    }

                    // Отправляем запрос на сервер, для получения Ролей
                    fetch('/admin/roles').then(function (response) {
                        if (response.ok) {
                            userFormId.find('#roles').empty();
                            response.json().then(roleList => {
                                roleList.forEach(role => {
                                    userFormId.find('#roles')
                                        .append($('<option>')
                                            .prop('selected', user.roles.filter(e => e.id === role.id).length)
                                            .val(role.id).text(role.name));
                                });
                            });
                        } else {
                            console.error('Network request for roles.json failed with response ' + response.status + ': ' + response.statusText);
                        }
                    });

                    // вызов метода из Bootstrap
                    userFormId.modal();
                });
            }
        )
        .catch(function (err) {
            console.error('Fetch Error :-S', err);
        });
}

// Функция очищает аттрибуты невалидных полей
function _eraseUserAddForm() {
    userAddFormId.find('.invalid-feedback').remove();
    userAddFormId.find('#firstNameAdd').removeClass('is-invalid');
    userAddFormId.find('#lastNameAdd').removeClass('is-invalid');
    userAddFormId.find('#ageAdd').removeClass('is-invalid');
    userAddFormId.find('#emailAdd').removeClass('is-invalid');
    userAddFormId.find('#passwordAdd').removeClass('is-invalid');
}

function loadUserForInsertForm() {
    _eraseUserAddForm();
    userAddFormId.find('#firstNameAdd').val('');
    userAddFormId.find('#lastNameAdd').val('');
    userAddFormId.find('#ageAdd').val('0');
    userAddFormId.find('#emailAdd').val('');
    userAddFormId.find('#passwordAdd').val('');

    fetch('/admin/roles').then(function (response) {
        if (response.ok) {
            userAddFormId.find('#roleSelectAdd').empty();
            response.json().then(roleList => {
                roleList.forEach(role => {
                    userAddFormId.find('#roleSelectAdd')
                        .append($('<option>').val(role.id).text(role.name));
                });
            });
        } else {
            console.error('Network request for roles.json failed with response ' + response.status + ': ' + response.statusText);
        }
    });
}

// Отправляем запрос на сервер, для сохранения пользователя
function insertUser() {
// Вызываем функцию по очистке невалидных полей
    _eraseUserAddForm();

// Определяем тип запроса
    let headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=utf-8');
// Считываем поля и создаем объект user
    let user = {
        'firstName': userAddFormId.find('#firstNameAdd').val(),
        'lastName': userAddFormId.find('#lastNameAdd').val(),
        'age': userAddFormId.find('#ageAdd').val(),
        'email': userAddFormId.find('#emailAdd').val(),
        'password': userAddFormId.find('#passwordAdd').val(),
        'roles': userAddFormId.find('#roleSelectAdd').val().map(roleId => parseInt(roleId))
    };
// Создаем объект запроса, по данному URL сохраняем объект
    let request = new Request('admin/create/', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(user)
    });

// Отправляем запрос на адрес
    fetch(request)
        // Получаем ответ
        .then(function (response) {
            response.json().then(function (userData) {
                console.log(userData);

                // if (response.status === 409) {
                //     userData.fieldErrors.forEach(error => {
                //         userAddFormId.find('#new' + error.field)
                //             .addClass('is-invalid')
                //             .parent().append($('<div class="invalid-feedback">').text(error.defaultMessage));
                //     });
                //     console.warn('Error: ' + userData.message);
                //     return false;
                // }
                // if (response.status === 400) {
                //     userAddFormId.find('#newemail')
                //         .addClass('is-invalid')
                //         .parent().append($('<div class="invalid-feedback">').text('E-mail must be unique'));
                //     console.warn("Error message: " + userData.message);
                //     return false;
                // }

                loadUsersTable();
                console.info("User with id = " + userData.id + " was inserted");
            });
        });
}

function deleteUser(id) {
    fetch('/admin/' + id, {method: 'DELETE'})
        .then(function (response) {
            userFormId.modal('hide');
            if (response.status === 404 || response.status === 400) {
                response.text().then((value) => console.warn("Error message: " + value));
                return;
            }
            usersTableId.find('#userRow\\[' + id + '\\]').remove();
            console.info("User with id = " + id + " was deleted");
        });
}

$(document).ready(
    () => {
        getAllUsers();
        initNavigation();
    }
);