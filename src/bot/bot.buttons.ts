import { Markup } from 'telegraf';
import { ButtonsLocalNames } from '../i18n/i18n.service';

export class BotButtons {
  static startupButtons(button_names: ButtonsLocalNames[]) {
    return Markup.keyboard(
      [
        Markup.button.callback(button_names[0], 'budget'),
        Markup.button.callback(button_names[1], 'expenses'),
        Markup.button.callback(button_names[2], 'currency'),
      ],
      {
        columns: 1,
      },
    );
  }

  static chooseLanguage() {
    return Markup.inlineKeyboard([
      Markup.button.callback('RU', 'ru'),
      Markup.button.callback('EN', 'en'),
    ]);
  }

  static mainMenu() {
    return Markup.inlineKeyboard([
      [Markup.button.callback('My Profile', 'my-profile')],
      [Markup.button.callback('My Pets', 'my-pets')],
      [Markup.button.callback('Remainders', 'remainders')],
      [Markup.button.callback('Settings', 'settings')],
    ]);
  }

  static myProfile() {
    return Markup.inlineKeyboard([[Markup.button.callback('Back', 'back')]]);
  }

  static myPets() {
    return Markup.inlineKeyboard([
      [Markup.button.callback('Add Pet', 'add_pet')],
      [Markup.button.callback('Back', 'back')],
    ]);
  }

  static remainders() {
    return Markup.inlineKeyboard([[Markup.button.callback('Back', 'back')]]);
  }

  static settings() {
    return Markup.inlineKeyboard([[Markup.button.callback('Back', 'back')]]);
  }

  static showCommandsMenu(button_commands: ButtonsLocalNames[]) {
    return Markup.inlineKeyboard(
      [
        Markup.button.callback(button_commands[0], 'currencies'),
        Markup.button.callback(button_commands[1], 'currencies_sum'),
        Markup.button.callback(button_commands[2], 'close_count'),
      ],
      {
        columns: 2,
      },
    );
  }

  static showCurrencyMenu() {
    return Markup.inlineKeyboard(
      [
        Markup.button.callback('AZN', 'azn'),
        Markup.button.callback('RUB', 'rub'),
        Markup.button.callback('USD', 'usd'),
        Markup.button.callback('EUR', 'eur'),
        Markup.button.callback('ILS', 'ils'),
        Markup.button.callback('AED', 'aed'),
        Markup.button.callback('TRY', 'try'),
        Markup.button.callback('GEL', 'gel'),
        Markup.button.callback('AMD', 'amd'),
        Markup.button.callback('KZT', 'kzt'),
        Markup.button.callback('GBP', 'gbp'),
        Markup.button.callback('CNY', 'cny'),
      ],
      {
        columns: 3,
      },
    );
  }

  static showExpensesMenu(button_commands: ButtonsLocalNames[]) {
    return Markup.inlineKeyboard(
      [
        Markup.button.callback(button_commands[0], 'add_expense'),
        Markup.button.callback(button_commands[1], 'show_expenses'),
      ],
      {
        columns: 1,
      },
    );
  }

  static showBudgetOptions(button_commands: ButtonsLocalNames[]) {
    return Markup.inlineKeyboard(
      [
        Markup.button.callback(button_commands[0], 'add_budget_sum'),
        Markup.button.callback(button_commands[1], 'show_budget'),
      ],
      {
        columns: 1,
      },
    );
  }
  static showCurrenciesOptions(button_commands: ButtonsLocalNames[]) {
    return Markup.inlineKeyboard(
      [
        Markup.button.callback(button_commands[0], 'all_currencies'),
        Markup.button.callback(button_commands[1], 'main_currency'),
        Markup.button.callback(button_commands[2], 'close_count'),
      ],
      {
        columns: 1,
      },
    );
  }

  static showCurrenciesSumOptions(button_commands: ButtonsLocalNames[]) {
    return Markup.inlineKeyboard([
      Markup.button.callback(button_commands[0], 'another_currency'),
      Markup.button.callback(button_commands[1], 'currencies'),
      Markup.button.callback(button_commands[2], 'close_count'),
    ]);
  }

  static showExpensesPeriod(button_commands: ButtonsLocalNames[]) {
    return Markup.inlineKeyboard(
      [
        Markup.button.callback(button_commands[0], 'w'),
        Markup.button.callback(button_commands[1], 'w2'),
        Markup.button.callback(button_commands[2], 'm'),
        Markup.button.callback(button_commands[3], 'm3'),
        Markup.button.callback(button_commands[4], 'm6'),
        Markup.button.callback(button_commands[5], 'y'),
      ],
      {
        columns: 2,
      },
    );
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
