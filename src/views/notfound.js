import l10n from '../l10n';

export default function () {
  return {
    tagName: 'section',
    classList: ['ion-padding', 'ion-text-center'],
    children: [{
      tagName: 'ion-text',
      color: 'primary',
      children: [{
        tagName: 'h2',
        textContent: () => l10n.t('notfound.code')
      }]
    }, {
      tagName: 'ion-text',
      color: 'medium',
      children: [{
        tagName: 'p',
        textContent: () => l10n.t('notfound.message')
      }]
    }, {
      tagName: 'ion-text',
      children: [{
        tagName: 'p',
        textContent: () => l10n.t('notfound.description')
      }]
    }, {
      tagName: 'ion-button',
      textContent: () => l10n.t('notfound.back'),
      on: {
        click () {
          location.hash = '#';
        }
      }
    }]
  };
}
