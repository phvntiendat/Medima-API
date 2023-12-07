import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { GroupModule } from './group/group.module';
import { EventModule } from './event/event.module';
import { ChatModule } from './chat/chat.module';
import { LikeModule } from './like/like.module';
import { MediaModule } from './media/media.module';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { RequestModule } from './request/request.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PostModule,
    CommentModule,
    GroupModule,
    EventModule,
    ChatModule,
    LikeModule,
    MediaModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_HOST'),
          secure: false,
          auth: {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"Medima" <${config.get('MAIL_FROM')}>`,
        },
        template: {
          dir: join(__dirname, 'src/templates/email'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    RequestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
