const { Menu, shell } = require('electron');
const path = require('path');

const template = [
  {
    label: 'Arquivo',
    submenu: [
      { role: 'quit', label: 'Sair' }
    ]
  },
  {
    label: 'Exibir',
    submenu: [
      { role: 'reload' },
      { role: 'forcereload' },
      { role: 'toggledevtools' },
      { type: 'separator' },
      { role: 'resetzoom' },
      { role: 'zoomin' },
      { role: 'zoomout' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  {
    label: 'Ajuda',
    submenu: [
      {
        label: 'Sobre Universe Empadas',
        click: () => {
          require('electron').dialog.showMessageBox({
            title: 'Sobre',
            message: 'Universe Empadas v1.0.0\nSistema completo de gerenciamento de empadas.',
            type: 'info'
          });
        }
      },
      {
        label: 'Visitar Site',
        click: () => shell.openExternal('https://github.com/universe-empadas')
      }
    ]
  }
];

module.exports = Menu.buildFromTemplate(template);
