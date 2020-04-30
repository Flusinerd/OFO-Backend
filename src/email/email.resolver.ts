import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { SendEmailsInput } from './models/sendEmails.input';
import { EmailService } from './email.service';

@Resolver('Email')
export class EmailResolver {
  constructor(private readonly _emailService: EmailService){

  }

  @Mutation(returns => Boolean)
  async sendEmails(@Args('input', {type: () => SendEmailsInput}) input: SendEmailsInput){
    try {
      await this._emailService.sendEmails(input);
      return true;
    } catch (error) {
      throw new Error('Could not send email')
    }
  }
}
