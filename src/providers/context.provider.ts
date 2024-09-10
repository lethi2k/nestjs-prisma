import { ClsServiceManager } from 'nestjs-cls';
import type { LanguageCode } from '../constants';
import type { User } from '@prisma/client'; // Import Prisma User type

export class ContextProvider {
  private static readonly nameSpace = 'request';

  private static readonly authUserKey = 'user_key';

  private static readonly languageKey = 'en_us';

  private static get<T>(key: string): T | undefined {
    const store = ClsServiceManager.getClsService();
    // Type assertion to tell TypeScript that the returned type matches T
    return store.get(key) as T | undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static set(key: string, value: any): void {
    const store = ClsServiceManager.getClsService();
    store.set(key, value);
  }

  private static getKeyWithNamespace(key: string): string {
    return `${ContextProvider.nameSpace}.${key}`;
  }

  static setAuthUser(user: User): void { // Use Prisma User type
    ContextProvider.set(ContextProvider.authUserKey, user);
  }

  static setLanguage(language: string): void {
    ContextProvider.set(ContextProvider.languageKey, language);
  }

  static getLanguage(): LanguageCode | undefined {
    return ContextProvider.get<LanguageCode>(ContextProvider.languageKey);
  }

  static getAuthUser(): User | undefined { // Use Prisma User type
    return ContextProvider.get<User>(ContextProvider.authUserKey);
  }
}
