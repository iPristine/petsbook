import { ReminderFrequency } from '@prisma/client';
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
