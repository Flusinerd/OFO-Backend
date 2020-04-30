import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SendEmailsInput } from './models/sendEmails.input';
import { EventService } from '../event/event.service';

@Injectable()
export class EmailService {
  constructor(
    private readonly _emailService: MailerService,
    private readonly _eventService: EventService,
  ) {}

  private greetings = [
    "Moin Moin",
    "Schalom",
    "Tach",
    "Grüß Gott",
    "Moin Meister",
    "Servus",
    "Hallo",
    "Salam aleikum"
  ]

  /**
   * Sends one invite to all provided emails
   * @param input Input object
   */
  async sendEmails(input: SendEmailsInput) {
    const event = await this._eventService.getOne(input.eventId);
    try {
      const index = Math.floor(Math.random() * this.greetings.length);
      this._emailService.sendMail({
        subject: `OFO - Einladung zu der Veranstaltung ${event.title}`,
        text: `
            ${this.greetings[index]}, du wurdest in der OFO-App zu der Veranstaltung ${event.title} eingeladen.\n
            Bitte folge dem link um abzustimmen: ${input.link} \n\n
            
            Viel Spaß bei der Veranstaltung,\n
            wünschen dir Tom und Jan  😊
          `,
        to: input.emails,
      });
      return;
    } catch (error) {
      throw new Error('Could not send emails')
    }
  }
}
