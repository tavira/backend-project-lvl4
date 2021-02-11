module.exports = {
  translation: {
    appName: 'Fastify Шаблон',
    flash: {
      session: {
        create: {
          success: 'Вы залогинены',
          error: 'Неправильный емейл или пароль',
        },
        delete: {
          success: 'Вы разлогинены',
        },
      },
      users: {
        create: {
          error: 'Не удалось зарегистрировать',
          success: 'Пользователь успешно зарегистрирован',
        },
        delete: {
          success: 'Пользователь удалён',
          otherUserError: 'Нельзя удалить чужого пользователя',
        },
        update: {
          error: 'Не удалось обновить информацию о пользователе',
          otherUserError: 'Нельзя редактировать чужого пользователя',
        },
      },
      statuses: {
        create: {
          error: 'Не удалось создать статус',
          success: 'Статус создан',
        },
        delete: {
          success: 'Статус удалён',
          error: 'Не удалось удалить статус',
        },
        update: {
          success: 'Статус обновлён',
          error: 'Не удалось обновить статус',
        },
      },
      authError: 'Доступ запрещён! Пожалуйста, авторизируйтесь.',
    },
    layouts: {
      application: {
        users: 'Пользователи',
        statuses: 'Статусы',
        signIn: 'Вход',
        signUp: 'Регистрация',
        signOut: 'Выход',
      },
    },
    views: {
      session: {
        new: {
          email: 'Email',
          password: 'Пароль',
          signIn: 'Вход',
          submit: 'Войти',
        },
      },
      users: {
        id: 'ID',
        email: 'Email',
        password: 'Пароль',
        firstname: 'Имя',
        lastname: 'Фамилия',
        fullname: 'Полное имя',
        createdAt: 'Дата создания',
        actions: 'Действия',
        edit: 'Редактировать',
        delete: 'Удалить',
        newUser: {
          submit: 'Сохранить',
          signUp: 'Регистрация',
        },
        editUser: {
          header: 'Редактирование пользователя',
          email: 'Email',
          password: 'Пароль',
          firstname: 'Имя',
          lastname: 'Фамилия',
          submit: 'Сохранить',
        },
      },
      welcome: {
        index: {
          hello: 'Привет от Хекслета!',
          description: 'Практические курсы по программированию',
          more: 'Узнать Больше',
        },
      },
      statuses: {
        id: 'ID',
        name: 'Название',
        createdAt: 'Дата создания',
        updatedAt: 'Дата обновления',
        index: {
          new: 'Создать новый статус',
          edit: 'Редактировать',
          delete: 'Удалить',
          actions: 'Действия',
        },
        new: {
          header: 'Создать новый статус',
          submit: 'Создать',
        },
        edit: {
          header: 'Редактирование статуса',
          submit: 'Сохранить',
        },
      },
    },
    validation: {
      user: {
        email: {
          format: 'Не соответствует формату email',
        },
        password: {
          minLength: 'Не должен быть короче {{ count }} символов',
        },
        firstname: {
          required: 'Это обязательное поле',
          minLength: 'Это обязательное поле',
        },
        lastname: {
          minLength: 'Это обязательное поле',
        },
      },
      status: {
        name: {
          minLength: 'Это обязательное поле',
        },
      },
    },
  },
};
