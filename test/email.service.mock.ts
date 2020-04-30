import { SendEmailsInput } from "../src/email/models/sendEmails.input";

export class EmailServiceMock{
  async sendEmails(input: SendEmailsInput){
    return;
  }
}