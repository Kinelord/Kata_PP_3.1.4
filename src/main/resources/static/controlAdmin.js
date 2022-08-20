const $usersTableId = $('#adminTableBody');
const $userInfo = $('#user-info');
const $formCreateUser = $('#formCreateUser');

// Нажатие - вызывает цепочку функций по отображению вкладки "Таблица пользователей" : fragment="adminPanel"
$('#nav-tableUsers-tab').click(() => {
    loadUsersTable();
});
// Нажатие - вызывает цепочку функций по отображению вкладки "Добавить нового пользователя"  : fragment="adminPanel"
$('#nav-newUser-tab').click(() => {
    loadAddForm();
});

// Инициируем блок навигации - Админ / Пользователь
function initNavigation() {
// При нажатии на Админа - делаем активным содержимое его страницы, а содержимое пользователя отключаем
    $('#admin-page-button').click(() => {
        $('#admin-page-button').addClass('active').removeClass('btn-light').addClass('btn-primary').prop('aria-selected', true);
        $('#admin').addClass('show').addClass("active");
        $('#user-page-button').removeClass('active').removeClass('btn-primary').addClass('btn-light').prop('aria-selected', false);
        $('#user').removeClass('show').removeClass("active");
    });
// При нажатии на пользователя - делаем активным содержимое его страницы, а содержимое Админа отключаем
    $('#user-page-button').click(() => {
        $('#user-page-button').addClass('active').removeClass('btn-light').addClass('btn-primary').prop('aria-selected', true);
        $('#user').addClass('show').addClass('active');
        $('#admin-page-button').removeClass('active').removeClass('btn-primary').addClass('btn-light').prop('aria-selected', false);
        $('#admin').removeClass('show').removeClass('active');
    });
}

// грузим блок навигации Админа - Таблица пользователей
function loadUsersTable() {
// Добавляем аттрибут к кнопке "таблица" и содержимое таблицы - Активный
    $('#nav-tableUsers-tab').addClass('active');
    $('#nav-usersTable').addClass('show').addClass('active');
// Удаляем аттрибут Активный у кнопки "Новый пользователь" и отключаем содержимое
    $('#nav-newUser-tab').removeClass('active');
    $('#nav-newUser').removeClass('show').removeClass('active');
// Грузим содержимое таблицы
    getAllUsers();
}

// Функция загрузки содержимого таблицы пользователей
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
                        $usersTableId.empty();
                        // Заполняем таблицу, передавая в метод appendUserRow пользователя
                        users.forEach(user => {
                            appendUserRow(user);
                        });
                    });
                // В случае ошибки передаем в консоль сообщение с ошибкой
            } else {
                console.error('Network request for users.json failed with response ' + response.status + ': ' + response.statusText);
            }
        });
}

// Функция, заполнение содержимого таблицы пользователей - пользователями
function appendUserRow(user) {
    $usersTableId
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

// Модальное окно по редактированию или удалению пользователя
function loadUserAndShowModalForm(id, editMode = true) {
// Вызываем метод, убирающий информацию о невалидных полях
     clearFieldModalForm();

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
                    // find возвращает из $userFormId поле с id = "id" и устанавливает в него значение val(id)
                    $userInfo.find('#id').val(id);
                    // find возвращает из $userFormId поле с id = "firstName" и устанавливает в него значение val(user.firstName)
                    $userInfo.find('#firstName').val(user.firstName);
                    // find возвращает из $userFormId поле с id = "lastName" и устанавливает в него значение val(user.lastName)
                    $userInfo.find('#lastName').val(user.lastName);
                    // find возвращает из $userFormId поле с id = "age" и устанавливает в него значение val(user.age)
                    $userInfo.find('#age').val(user.age);
                    // find возвращает из $userFormId поле с id = "email" и устанавливает в него значение val(user.email)
                    $userInfo.find('#email').val(user.email);
                    // find возвращает из $userFormId поле с id = "password" и устанавливает в него значение val('')
                    $userInfo.find('#password').val('');

                    // Проверка, если в метод был передан true, то метод ведет себя под Edit
                    if (editMode) {
                        // find возвращает из $userFormId поле с class = "modal-title" и устанавливает в него значение val('Edit user')
                        $userInfo.find('.modal-title').text('Edit user');
                        // find возвращает из $userFormId поле с id = "password-div" и show() отображает скрытое значение
                        $userInfo.find('#password-div').show();
                        // find возвращает из $userFormId поле с class = "submit" и корректирует его под Edit
                        $userInfo.find('.submit').text('Edit').removeClass('btn-danger').addClass('btn-primary')
                            .removeAttr('onClick')
                            .attr('onClick', 'updateUser(' + id + ');');
                        // Статус для редактирования
                        setReadonlyAttribute(false);

                        // Иначе, в метод был передан false, метод ведет себя под Delete
                    } else {
                        // find возвращает из $userFormId поле с class = "modal-title" и устанавливает в него значение val('Delete user')
                        $userInfo.find('.modal-title').text('Delete user');
                        // find возвращает из $userFormId поле с id = "password-div" и hide() скрывает значение поля
                        $userInfo.find('#password-div').hide();
                        // find возвращает из $userFormId поле с class = "submit" и корректирует его под Delete
                        $userInfo.find('.submit').text('Delete').removeClass('btn-primary').addClass('btn-danger')
                            .removeAttr('onClick')
                            .attr('onClick', 'deleteUser(' + id + ');');
                        // Статус для чтения
                        setReadonlyAttribute();
                    }

                    // Отправляем запрос на сервер, для получения Ролей
                    fetch('/admin/roles').then(function (response) {
                        if (response.ok) {
                            $userInfo.find('#roles').empty();
                            response.json().then(roleList => {
                                roleList.forEach(role => {
                                    $userInfo.find('#roles')
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
                    $userInfo.modal();
                    // $modalFormEdit.find(':submit').click(() => {
                    //     updateUser(id);
                    // });
                });
            }
        )
        .catch(function (err) {
            console.error('Fetch Error :-S', err);
        });
}

function updateUser(id) {
    clearFieldModalForm();

    let headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=utf-8');
    let user = {
        'id': parseInt($userInfo.find('#id').val()),
        'firstName': $userInfo.find('#firstName').val(),
        'lastName': $userInfo.find('#lastName').val(),
        'age': $userInfo.find('#age').val(),
        'email': $userInfo.find('#email').val(),
        'password': $userInfo.find('#password').val(),
        'roles': $userInfo.find('#roles').val().map(roleId => parseInt(roleId))
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
                $userInfo.modal('hide');
                return false;
            }

            response.json().then(function (userData) {
                console.log(userData);

                if (response.status === 409) {
                    userData.fieldErrors.forEach(error => {
                        $userInfo.find('#' + error.field)
                            .addClass('is-invalid')
                            .parent().append($('<div class="invalid-feedback">').text(error.defaultMessage));
                    });
                    console.warn('Error: ' + userData.message);
                    return false;
                }
                if (response.status === 400) {
                    $userInfo.find('#email')
                        .addClass('is-invalid')
                        .parent().append($('<div class="invalid-feedback">').text('E-mail must be unique'));
                    console.warn("Error message: " + userData.message);
                    return false;
                }

                $('#userData\\[' + userData.id + '\\]\\[firstName\\]').text(userData.firstName)
                $('#userData\\[' + userData.id + '\\]\\[lastName\\]').text(userData.lastName)
                $('#userData\\[' + userData.id + '\\]\\[age\\]').text(userData.age)
                $('#userData\\[' + userData.id + '\\]\\[email\\]').text(userData.email)
                $('#userData\\[' + userData.id + '\\]\\[roles\\]').text(userData.role);
                $userInfo.modal('hide');
                loadUsersTable()
                console.info("User with id = " + id + " was updated");
            });
        })
        .catch(function (err) {
            console.error('Fetch Error :-S', err);
        });
}

function deleteUser(id) {
    fetch('/admin/' + id, {method: 'DELETE'})
        .then(function (response) {
            $userInfo.modal('hide');
            if (response.status === 404 || response.status === 400) {
                response.text().then((value) => console.warn("Error message: " + value));
                return;
            }
            $usersTableId.find('#userRow\\[' + id + '\\]').remove();
            console.info("User with id = " + id + " was deleted");
        });
}

// Функция удаляющая классы и блоки невалидного отображения в модальном окне
function clearFieldModalForm() {
// Функция find производит поиск в $userFormId и удаляет информацию о невалидных полях в модальном окне
    $userInfo.find('.invalid-feedback').remove();
    $userInfo.find('#firstNameAdd').removeClass('is-invalid');
    $userInfo.find('#lastNameAdd').removeClass('is-invalid');
    $userInfo.find('#emailAdd').removeClass('is-invalid');
    $userInfo.find('#passwordAdd').removeClass('is-invalid');
    $userInfo.find('#ageAdd').removeClass('is-invalid');
}

// Функция устанавливает свойства полей для чтения / записи в модальном окне
function setReadonlyAttribute(value = true) {
    $userInfo.find('#firstName').prop('readonly', value);
    $userInfo.find('#lastName').prop('readonly', value);
    $userInfo.find('#age').prop('readonly', value);
    $userInfo.find('#email').prop('readonly', value);
    $userInfo.find('#password').prop('readonly', value);
    $userInfo.find('#roles').prop('disabled', value);
}


// грузим блок навигации Админа - Добавить нового пользователя
function loadAddForm() {
// Добавляем аттрибут к кнопке "Новый пользователь" и содержимое формы - Активный
    $('#nav-newUser-tab').addClass('active');
    $('#nav-newUser').addClass('show').addClass('active');
// Удаляем аттрибут Активный у кнопки "таблица" и отключаем содержимое
    $('#nav-tableUsers-tab').removeClass('active');
    $('#nav-usersTable').removeClass('show').removeClass('active');
// Грузим содержимое формы
    newUserRegistrationPage();
}


// Метод загружает панель по добавлению нового пользователя
function newUserRegistrationPage() {
// Метод очищает информацию о невалидных полях
    clearFieldUserAddForm();
// Функция find производит поиск в $userFormId и устанавливает пустое значение для всех полей
    $formCreateUser.find('#firstNameAdd').val('');
    $formCreateUser.find('#lastNameAdd').val('');
    $formCreateUser.find('#ageAdd').val('0');
    $formCreateUser.find('#emailAdd').val('');
    $formCreateUser.find('#passwordAdd').val('');

    // Отправляем запрос на сервер, для установки выбора возможных ролей пользователя
    fetch('/admin/roles').then(function (response) {
        // Проверяем успешность запроса
        if (response.ok) {
            // Очищаем значение поля Роли
            $formCreateUser.find('#roleSelectAdd').empty();
            // Добавляем в блок возможный выбор из ролей
            response.json().then(roleList => {
                roleList.forEach(role => {
                    $formCreateUser.find('#roleSelectAdd')
                        .append($('<option>').val(role.id).text(role.name));
                });
            });
        } else {
            console.error('Network request for roles.json failed with response ' + response.status + ': ' + response.statusText);
        }
    });
}

// При нажатии на странице "Добавить нового пользователя" кнопки, запускаем метод insertUser
$formCreateUser.find(':submit').click(() => {
    insertUser();
});


// Отправляем запрос на сервер, для сохранения пользователя
function insertUser() {
// Вызываем функцию по очистке невалидных полей
    clearFieldUserAddForm();

// Определяем тип запроса
    let headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=utf-8');
// Считываем поля и создаем объект user
    let user = {
        // find - ищет соответствие с firstNameAdd и считывает значение поля, устанавливая его для ключа
        'firstName': $formCreateUser.find('#firstNameAdd').val(),
        'lastName': $formCreateUser.find('#lastNameAdd').val(),
        'age': $formCreateUser.find('#ageAdd').val(),
        'email': $formCreateUser.find('#emailAdd').val(),
        'password': $formCreateUser.find('#passwordAdd').val(),
        'roles': $formCreateUser.find('#roleSelectAdd').val().map(roleId => parseInt(roleId))
    };
// Создаем объект запроса, по данному URL сохраняем объект
    let request = new Request('admin/create', {
// Устанавливаем тип и свойства запроса
        method: 'POST',
        headers: headers,
// Преобразуем объект user в строковое представление
        body: JSON.stringify(user)
    });

// Отправляем запрос на адрес
    fetch(request)
        // Получаем ответ
        .then(function (response) {
            response.json().then(function (userData) {
                console.log(userData + " userData 297");

                // Проверяем на валидность поля
                if (response.status === 409) {
                    // Устанавливаем на соответствующие поля статус invalid
                    userData.fieldErrors.forEach(error => {
                        $formCreateUser.find('#' + error.field + 'Add')
                            .addClass('is-invalid')
                            .parent().append($('<div class="invalid-feedback">').text(error.defaultMessage));
                    });
                    console.warn('Error: ' + userData.message + " userData.message 307");
                    return false;
                }
                // Проверяем на уникальность логин
                if (response.status === 400) {
                    // Устанавливаем на поле emailAdd статус invalid
                    $formCreateUser.find('#emailAdd')
                        .addClass('is-invalid')
                        .parent().append($('<div class="invalid-feedback">').text('E-mail must be unique'));
                    console.warn("Error message: " + userData.message + " userData.message 307");
                    return false;
                }

                // После отработанного запроса грузим страницу "Таблица пользователей"
                // выводим в консоль инфу об успешном выполнении метода
                loadUsersTable();
                console.info("User with id = " + userData.id + " was inserted");
            });
        });
}

// Функция очищает аттрибуты невалидных полей страница по добавлению нового пользователя
function clearFieldUserAddForm() {
    $formCreateUser.find('.invalid-feedback').remove();
    $formCreateUser.find('#firstNameAdd').removeClass('is-invalid');
    $formCreateUser.find('#lastNameAdd').removeClass('is-invalid');
    $formCreateUser.find('#ageAdd').removeClass('is-invalid');
    $formCreateUser.find('#emailAdd').removeClass('is-invalid');
    $formCreateUser.find('#passwordAdd').removeClass('is-invalid');
}


$(document).ready(
    () => {
        getAllUsers();
        initNavigation();
    }
);