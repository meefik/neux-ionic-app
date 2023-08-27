import { createView } from 'neux';
import './ionic';
import router from './router';
import l10n from './l10n';
import Todo from './views/todo';
import NotFound from './views/notfound';

const views = {
  todo: Todo
};

createView({
  tagName: 'ion-app',
  children: [{
    tagName: 'ion-header',
    children: [{
      tagName: 'ion-toolbar',
      slot: 'primary',
      children: [{
        tagName: 'ion-title',
        slot: 'start',
        textContent: () => l10n.t(`${router.$path}.title`) || l10n.t('notfound.title')
      }, {
        tagName: 'ion-buttons',
        slot: 'end',
        children: [{
          tagName: 'ion-radio-group',
          value: l10n.lang,
          children: () => {
            return l10n.locales.map(lang => {
              return {
                tagName: 'ion-radio',
                className: 'ion-padding',
                value: lang,
                textContent: l10n.t('language', lang)
              };
            });
          },
          on: {
            ionChange (e) {
              l10n.lang = e.detail.value;
            }
          }
        }]
      }]
    }]
  }, {
    tagName: 'ion-content',
    children: () => {
      return {
        view: views[router.$path] || NotFound
      };
    }
  }, {
    tagName: 'ion-footer',
    children: () => {
      return router.$path === 'todo' && [{
        tagName: 'ion-toolbar',
        slot: 'primary',
        children: [{
          tagName: 'ion-segment',
          value: 'all',
          children: () => {
            return ['all', 'active', 'completed'].map((item) => {
              return {
                tagName: 'ion-segment-button',
                value: item,
                children: [{
                  tagName: 'ion-label',
                  textContent: () => l10n.t(`todo.filter.${item}`)
                }]
              };
            });
          },
          on: {
            ionChange (e) {
              router.navigate({ filter: e.detail.value });
            }
          }
        }]
      }];
    }
  }]
}, { target: document.body });
