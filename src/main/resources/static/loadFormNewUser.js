// Метод загружает панель по добавлению нового пользователя
function newUserRegistrationPage() {

// Функция find производит поиск в $userFormId и устанавливает пустое значение для всех полей
    $formCreateUser.find('#firstNameAdd').val('');
    $formCreateUser.find('#lastNameAdd').val('');
    $formCreateUser.find('#ageAdd').val('0');
    $formCreateUser.find('#emailAdd').val('');
    $formCreateUser.find('#passwordAdd').val('');

    // Отправляем запрос на сервер, для установки выбора возможных ролей пользователя
    fetch('/admin/roles').then(function (response) {

        // Очищаем значение поля Роли
        $formCreateUser.find('#roleSelectAdd').empty();
        // Добавляем в блок возможный выбор из ролей
        response.json().then(roleList => {
            roleList.forEach(role => {
                $formCreateUser.find('#roleSelectAdd')
                    .append($('<option>').val(role.id).text(role.name));
            });
        });

    });
}


// Отправляем запрос на сервер, для сохранения пользователя
function createUser() {

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
                // После отработанного запроса грузим страницу "Таблица пользователей"
                loadUsersTable();
                console.log("create user" + userData);
            });
        });
}

