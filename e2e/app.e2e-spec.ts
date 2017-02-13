import { BluebankPage } from './app.po';

describe('bluebank App', function() {
  let page: BluebankPage;

  beforeEach(() => {
    page = new BluebankPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
