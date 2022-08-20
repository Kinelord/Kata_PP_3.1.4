
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
                    $modalEditOrDelete.find('#id').val(id);
                    // find возвращает из $userFormId поле с id = "firstName" и устанавливает в него значение val(user.firstName)
                    $modalEditOrDelete.find('#firstName').val(user.firstName);
                    // find возвращает из $userFormId поле с id = "lastName" и устанавливает в него значение val(user.lastName)
                    $modalEditOrDelete.find('#lastName').val(user.lastName);
                    // find возвращает из $userFormId поле с id = "age" и устанавливает в него значение val(user.age)
                    $modalEditOrDelete.find('#age').val(user.age);
                    // find возвращает из $userFormId поле с id = "email" и устанавливает в него значение val(user.email)
                    $modalEditOrDelete.find('#email').val(user.email);
                    // find возвращает из $userFormId поле с id = "password" и устанавливает в него значение val('')
                    $modalEditOrDelete.find('#password').val('');

                    // Проверка, если в метод был передан true, то метод ведет себя под Edit
                    if (editMode) {
                        // find возвращает из $userFormId поле с class = "modal-title" и устанавливает в него значение val('Edit user')
                        $modalEditOrDelete.find('.modal-title').text('Edit user');
                        // find возвращает из $userFormId поле с id = "password-div" и show() отображает скрытое значение
                        $modalEditOrDelete.find('#password-div').show();
                        // find возвращает из $userFormId поле с class = "submit" и корректирует его под Edit
                        $modalEditOrDelete.find('.submit').text('Edit').removeClass('btn-danger').addClass('btn-primary')
                            .removeAttr('onClick')
                            .attr('onClick', 'updateUser(' + id + ');');
                        // Статус для редактирования
                        setReadonlyAttribute(false);

                        // Иначе, в метод был передан false, метод ведет себя под Delete
                    } else {
                        // find возвращает из $userFormId поле с class = "modal-title" и устанавливает в него значение val('Delete user')
                        $modalEditOrDelete.find('.modal-title').text('Delete user');
                        // find возвращает из $userFormId поле с id = "password-div" и hide() скрывает значение поля
                        $modalEditOrDelete.find('#password-div').hide();
                        // find возвращает из $userFormId поле с class = "submit" и корректирует его под Delete
                        $modalEditOrDelete.find('.submit').text('Delete').removeClass('btn-primary').addClass('btn-danger')
                            .removeAttr('onClick')
                            .attr('onClick', 'deleteUser(' + id + ');');
                        // Статус для чтения
                        setReadonlyAttribute();
                    }

                    // Отправляем запрос на сервер, для получения Ролей
                    fetch('/admin/roles').then(function (response) {
                        if (response.ok) {
                            $modalEditOrDelete.find('#roles').empty();
                            response.json().then(roleList => {
                                roleList.forEach(role => {
                                    $modalEditOrDelete.find('#roles')
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
                    $modalEditOrDelete.modal();
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
        'id': parseInt($modalEditOrDelete.find('#id').val()),
        'firstName': $modalEditOrDelete.find('#firstName').val(),
        'lastName': $modalEditOrDelete.find('#lastName').val(),
        'age': $modalEditOrDelete.find('#age').val(),
        'email': $modalEditOrDelete.find('#email').val(),
        'password': $modalEditOrDelete.find('#password').val(),
        'roles': $modalEditOrDelete.find('#roles').val().map(roleId => parseInt(roleId))
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
                $modalEditOrDelete.modal('hide');
                return false;
            }

            response.json().then(function (userData) {
                console.log(userData);

                if (response.status === 409) {
                    userData.fieldErrors.forEach(error => {
                        $modalEditOrDelete.find('#' + error.field)
                            .addClass('is-invalid')
                            .parent().append($('<div class="invalid-feedback">').text(error.defaultMessage));
                    });
                    console.warn('Error: ' + userData.message);
                    return false;
                }
                if (response.status === 400) {
                    $modalEditOrDelete.find('#email')
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
                $modalEditOrDelete.modal('hide');
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
            $modalEditOrDelete.modal('hide');
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
    $modalEditOrDelete.find('.invalid-feedback').remove();
    $modalEditOrDelete.find('#firstNameAdd').removeClass('is-invalid');
    $modalEditOrDelete.find('#lastNameAdd').removeClass('is-invalid');
    $modalEditOrDelete.find('#emailAdd').removeClass('is-invalid');
    $modalEditOrDelete.find('#passwordAdd').removeClass('is-invalid');
    $modalEditOrDelete.find('#ageAdd').removeClass('is-invalid');
}

// Функция устанавливает свойства полей для чтения / записи в модальном окне
function setReadonlyAttribute(value = true) {
    $modalEditOrDelete.find('#firstName').prop('readonly', value);
    $modalEditOrDelete.find('#lastName').prop('readonly', value);
    $modalEditOrDelete.find('#age').prop('readonly', value);
    $modalEditOrDelete.find('#email').prop('readonly', value);
    $modalEditOrDelete.find('#password').prop('readonly', value);
    $modalEditOrDelete.find('#roles').prop('disabled', value);
}
