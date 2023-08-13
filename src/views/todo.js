import { createState, createSync } from 'neux';
import { closeCircle } from 'ionicons/icons';
import l10n from '../l10n';
import router from '../router';

const state = createState({
  list: []
});
const syncer = (newv, oldv, diff) => {
  if (!oldv) {
    return JSON.parse(localStorage.getItem('todos') || '[]');
  } else {
    localStorage.setItem('todos', JSON.stringify(newv));
  }
  return newv;
};
const sync = createSync(state.list, syncer, { slippage: 100 });
state.list.$$on('*', () => sync());

export default function () {
  sync();
  return {
    tagName: 'section',
    className: 'ion-padding',
    children: [{
      children: [{
        tagName: 'ion-input',
        className: 'ion-margin-vertical',
        label: () => l10n.t('todo.newtask'),
        labelPlacement: 'stacked',
        placeholder: () => l10n.t('todo.input'),
        autofocus: true,
        on: {
          keyup (e) {
            if (e.keyCode === 13) {
              e.preventDefault();
              state.list.push({
                id: `${Date.now()}`,
                text: e.target.value
              });
              e.target.value = '';
            }
          }
        }
      }]
    }, {
      children: [{
        tagName: 'ion-checkbox',
        labelPlacement: 'end',
        textContent: () => l10n.t('todo.mark_all'),
        on: {
          ionChange (e) {
            const checked = e.target.checked;
            state.list.forEach((item) => {
              item.checked = checked;
            });
          }
        }
      }]
    }, {
      tagName: 'ion-list',
      children: () => {
        const filter = router.params.$filter;
        return state.list.$$each(item => {
          if (filter && filter !== 'all') {
            if (item.checked && filter !== 'completed') return;
            if (!item.checked && filter !== 'active') return;
          }
          return {
            tagName: 'ion-item',
            children: [{
              tagName: 'ion-checkbox',
              checked: () => item.$checked,
              slot: 'start',
              on: {
                ionChange (e) {
                  item.checked = e.target.checked;
                }
              }
            }, {
              tagName: 'ion-text',
              style: {
                width: '100%'
              },
              children: () => {
                return item.$editable
                  ? {
                    tagName: 'input',
                    type: 'text',
                    style: {
                      width: '100%'
                    },
                    value: item.text,
                    on: {
                      mounted (e) {
                        e.target.focus();
                      },
                      input (e) {
                        item.text = e.target.value;
                      },
                      blur () {
                        item.editable = false;
                      },
                      keydown (e) {
                      }
                    }
                  }
                  : {
                    style: {
                      textDecoration () {
                        return item.$checked ? 'line-through' : 'none';
                      }
                    },
                    textContent: () => item.text,
                    on: {
                      dblclick () {
                        item.editable = true;
                      },
                      touchstart () {
                        item.editable = true;
                      }
                    }
                  };
              }
            }, {
              tagName: 'ion-button',
              fill: 'clear',
              on: {
                click () {
                  const index = state.list.indexOf(item);
                  state.list.splice(index, 1);
                }
              },
              children: {
                tagName: 'ion-icon',
                src: closeCircle
              }
            }]
          };
        });
      }
    }, {
      tagName: 'ion-text',
      color: 'medium',
      className: 'ion-padding',
      children: [{
        textContent: () => l10n.t('todo.total', { count: state.list.$length })
      }]
    }]
  };
}
