const $usersTableId = $('#loadTableBody');
const $modalEditOrDelete = $('#modalEditOrDelete');
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

// При нажатии на странице "Добавить нового пользователя" кнопки, запускаем метод insertUser
$formCreateUser.find(':submit').click(() => {
    insertUser();
});


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


$(document).ready(
    () => {
        getAllUsers();
        initNavigation();
    }
);