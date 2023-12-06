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
    MediaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
