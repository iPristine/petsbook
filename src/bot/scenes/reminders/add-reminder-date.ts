import { Ctx, Scene, SceneEnter, Action, InjectBot } from 'nestjs-telegraf';
import { BotScenes } from '../types';
import { BotContext } from '@bot/interfaces';
import { I18nTranslateService } from 'src/i18n/i18n.service';
import { Telegraf } from 'telegraf';
const Calendar = require('telegraf-calendar-telegram');

@Scene(BotScenes.ADD_REMINDER_DATE)
export class AddReminderDate {
  private calendar: any;

  constructor(
    private i18n: I18nTranslateService,
    @InjectBot() private bot: Telegraf<BotContext>
  ) {
    this.calendar = new Calendar(this.bot, {
      startWeekDay: 1,
      weekDayNames: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
      monthNames: [
        'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
        'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'
      ],
      minDate: new Date(),
      maxDate: new Date(2030, 11, 31)
    });
  }

  @SceneEnter()
  async enterAddReminderDate(@Ctx() ctx: BotContext) {
    const sentMessage = await ctx.reply('Выберите дату напоминания:', 
      await this.calendar.getCalendar());
    
    ctx.session.data.lastBotMessages = [sentMessage.message_id];
    this.calendar.setDateListener(this.onDateSelect);
  }

  async onDateSelect(@Ctx() ctx: BotContext, date: string) {
    
    if (!date) {
      await ctx.reply('Пожалуйста, выберите корректную дату');
      return;
    }

    ctx.session.data.reminderDate = new Date(date);
    await ctx.scene.enter(BotScenes.ADD_REMINDER_FREQUENCY);
  }


}
