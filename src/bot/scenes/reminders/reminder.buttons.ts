import { Markup } from 'telegraf';

export class ReminderButtons {
  static selectPets(pets: any[]) {
    const buttons = [
      [Markup.button.callback('🌐 Общее напоминание', 'no_pets')],
      ...pets.map((pet) => [
        Markup.button.callback(`🐾 ${pet.name}`, `select_pet_${pet.id}`),
      ]),
    ];
    return Markup.inlineKeyboard(buttons);
  }

  static frequency() {
    return Markup.inlineKeyboard([
      [Markup.button.callback('📅 Разовое', 'freq_once')],
      [Markup.button.callback('🔄 Раз в неделю', 'freq_weekly')],
      [Markup.button.callback('🔄 Раз в месяц', 'freq_monthly')],
      [Markup.button.callback('🔄 Раз в 3 месяца', 'freq_quarterly')],
      [Markup.button.callback('🔄 Раз в год', 'freq_yearly')],
    ]);
  }

  static notifyBefore() {
    return Markup.inlineKeyboard([
      [Markup.button.callback('🔔 В тот же день', 'notify_0')],
      [Markup.button.callback('🔔 За день до', 'notify_1')],
      [Markup.button.callback('🔔 За неделю до', 'notify_7')],
    ]);
  }

  static confirmReminder() {
    return Markup.inlineKeyboard([
      [Markup.button.callback('✅ Подтвердить', 'confirm_reminder')],
      [Markup.button.callback('❌ Отменить', 'cancel_reminder')],
    ]);
  }

  static reminderDetails() {
    return Markup.inlineKeyboard([
      [Markup.button.callback('✏️ Редактировать', 'edit_reminder')],
      [Markup.button.callback('🗑️ Удалить', 'delete_reminder')],
      [Markup.button.callback('◀️ Назад', 'back_to_list')],
    ]);
  }

  static editReminder() {
    return Markup.inlineKeyboard([
      [Markup.button.callback('📝 Описание', 'edit_description')],
      [Markup.button.callback('📅 Дата', 'edit_date')],
      [Markup.button.callback('🔄 Периодичность', 'edit_frequency')],
      [Markup.button.callback('🔔 Уведомление', 'edit_notify')],
      [Markup.button.callback('◀️ Назад', 'back_to_details')],
    ]);
  }
}
