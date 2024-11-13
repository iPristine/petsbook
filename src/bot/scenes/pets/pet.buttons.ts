import { Markup } from 'telegraf';

export class PetButtons {
  static myPets() {
    return Markup.inlineKeyboard([
      [Markup.button.callback('Add Pet', 'add_pet')],
      [Markup.button.callback('Back', 'back')],
    ]);
  }

  static petTypes(gender: 'male' | 'female') {
    return Markup.inlineKeyboard([
      [
        Markup.button.callback(
          `🐱  ${gender === 'male' ? 'Кот' : 'Кошка'}`,
          'cat',
        ),
        Markup.button.callback(`🐕 Собака`, 'dog'),
      ],
    ]);
  }

  static petGender() {
    return Markup.inlineKeyboard([
      [
        Markup.button.callback('♂️ Мальчик', 'male'),
        Markup.button.callback('♀️ Девочка', 'female'),
      ],
    ]);
  }

  static petConfirm() {
    return Markup.inlineKeyboard([
      [
        Markup.button.callback('✅ Подтвердить', 'confirm'),
        Markup.button.callback('❌ Отменить', 'cancel'),
      ],
    ]);
  }

  static petDetails() {
    return Markup.inlineKeyboard([
      [Markup.button.callback('✏️ Редактировать', 'edit_pet')],
      [Markup.button.callback('🗑️ Удалить', 'delete_pet')],
      [Markup.button.callback('◀️ Назад', 'back')],
    ]);
  }

  static petEdit() {
    return Markup.inlineKeyboard([
      [Markup.button.callback('📝 Изменить имя', 'edit_name')],
      [Markup.button.callback('🎂 Изменить возраст', 'edit_age')],
      [Markup.button.callback('◀️ Назад', 'back')],
    ]);
  }

  static petDelete() {
    return Markup.inlineKeyboard([
      [Markup.button.callback('✅ Да, удалить', 'confirm_delete')],
      [Markup.button.callback('❌ Нет, отменить', 'cancel_delete')],
    ]);
  }

  static petDeleteConfirm() {
    return Markup.inlineKeyboard([
      [
        Markup.button.callback('✅ Да, удалить', 'confirm_delete'),
        Markup.button.callback('❌ Нет, отменить', 'cancel_delete'),
      ],
    ]);
  }
}
