import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventModule } from './event/event.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MailerModule, MailerService, HandlebarsAdapter } from '@nestjs-modules/mailer';
import { EmailModule } from './email/email.module';
import * as fs from 'fs';


@Module({
  imports: [
    TypeOrmModule.forRoot(),
    EventModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'src', 'client')
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      installSubscriptionHandlers: true,
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.sendgrid.net',
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
        }
      },
      defaults: {
        from:'"OFO - Freizeit Planer" <ofo@datenlotse.org>',
      },
    }),
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(){
    this.createFrontedConfig();
  }
  
  private createFrontedConfig(){
    const config = {
      url: process.env.HOST_URL,
    }
    fs.writeFileSync(join(__dirname, '..', 'src', 'client', 'assets', 'config.json'), JSON.stringify(config));
  }
}
