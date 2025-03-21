import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from './config';
import { join } from 'path';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './modules/auth/auth.module';
import { ClsModule } from 'nestjs-cls';
import { UserModule } from './modules/user/user.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { RatesModule } from './modules/country/rates/rates.module';
import { CountryModule } from './modules/country/country.module';
import { UploadModule } from './modules/upload/upload.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AcceptLanguageResolver, I18nMiddleware, I18nModule, QueryResolver } from 'nestjs-i18n';
import { LanguageMiddleware } from './middleware/i18n.middleware';
import { NewsModule } from './modules/news/news.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: config.databaseUrl,
      entities: [join(__dirname, 'entities/*.entity.{ts,js}')],
      logging: true,
      synchronize: true,
    }),
    JwtModule.register({
      global: true,
      secret: config.jwtSecret,
      signOptions: {
        expiresIn: '1d',
      }
    }),
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
      guard: { mount: true },
    }),
    MailerModule.forRoot({
      transport: 'smtps://user@domain.com:pass@smtp.domain.com',
      defaults: {
        from: '"166 Cargo No-Reply" <noreply@166cargo.com>',
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads'
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: join(__dirname, '/i18n/'),
        watch: true,
        global: true
      },
      resolvers: [
        new QueryResolver(['lang', 'language']),
        new AcceptLanguageResolver(),
      ],
      typesOutputPath: join(__dirname, '../src/generated/i18n.generated.ts'),
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore({
        socket: {
          host: config.redisHost,
          port: config.redisPort
        },
      }),
    }),
    AuthModule,
    UserModule,
    RatesModule,
    CountryModule,
    UploadModule,
    NewsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    return consumer.apply(I18nMiddleware, LanguageMiddleware).forRoutes('*');
  }
}
