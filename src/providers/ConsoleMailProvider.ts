import { injectable } from 'inversify';
import { IMailProvider, Mail } from './IMailProvider';

@injectable()
export class ConsoleMailProvider implements IMailProvider {
  async sendMail(mail: Mail): Promise<string | null> {
    console.log(`[MAIL] Para: ${mail.to}\nAssunto: ${mail.subject}\n${mail.text}`);
    return null;
  }
}