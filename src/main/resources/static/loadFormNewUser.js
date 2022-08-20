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
