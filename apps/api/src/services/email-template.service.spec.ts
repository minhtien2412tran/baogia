import { EmailTemplateService } from './email-template.service';

describe('EmailTemplateService.render', () => {
  const svc = Object.create(EmailTemplateService.prototype) as EmailTemplateService;

  it('replaces mustache-style vars', () => {
    expect(
      svc.render('Hello {{name}} #{{id}}', { name: 'Ops', id: 42 }),
    ).toBe('Hello Ops #42');
  });

  it('empty for missing vars', () => {
    expect(svc.render('X={{missing}}', {})).toBe('X=');
  });
});
