import { browser, by, element } from 'protractor';

export class AppPage {
  /** begin browser test */
  navigateTo() {
    return browser.get('/');
  }

  /** test h1 text get */
  getParagraphText() {
    return element(by.css('app-root h1')).getText();
  }
}
