import $ from 'jquery';
import copy from 'copy-to-clipboard';
import CardService from './card_service';
import * as utils from './utils';

// メールを送信する
let exportMail = async () => {
  const member_name: string =
    document
      .getElementsByClassName('js-open-header-member-menu')[0]
      .getAttribute('title') || '';
  const userNameReg = /.*\((\w+)\)/.exec(member_name);
  const boardIdReg = /\/b\/(\w{8})\//.exec(location.href);

  if (!userNameReg || !boardIdReg) {
    console.log('cannnot get boardId or userName');
    return;
  }

  Promise.all([
    CardService.getSendAddress(userNameReg[1]),
    CardService.getBoard(boardIdReg[1])
  ]).then(([address, board]) => {
    const subjet = utils.escapeMailText(board.name);
    const body = utils.escapeMailText(
      board.lists.map(list => utils.listToString(list)).join('\n\n')
    );
    window.location.href = `mailto:${address}?subject=${subjet}&body=${body}`;
  });
};

let add_mail_interval: NodeJS.Timer | null = null;

// メール送信のリンクを作成する
function addMailLink() {
  let $export_btn = $('a.js-export-json');

  if (
    $('.pop-over-list').find('.js-export-mail').length != 0 &&
    add_mail_interval
  ) {
    clearInterval(add_mail_interval);
    return;
  }

  if (!!$export_btn) {
    $('<a>')
      .attr({
        class: 'js-export-mail',
        href: '#',
        target: '_blank',
        title: 'Export board to mail'
      })
      .text('Mail to')
      .click(exportMail)
      .insertAfter($export_btn.parent())
      .wrap(document.createElement('li'));
  }
}

let add_clipboard_interval: NodeJS.Timer | null = null;

// クリップボードにコピーのリンクを作成する
function addClipboardLink() {
  let $export_btn = $('a.js-export-json');

  if (
    $('.pop-over-list').find('.js-copy-clipboard').length != 0 &&
    add_clipboard_interval
  ) {
    clearInterval(add_clipboard_interval);
    return;
  }

  if (!!$export_btn) {
    const boardIdReg = /\/b\/(\w{8})\//.exec(location.href);

    if (!boardIdReg) {
      console.log('cannnot get boardId or userName');
      return;
    }

    // データを取りに行ってリンクに文字列を仕込む
    CardService.getBoard(boardIdReg[1]).then(board => {
      $('.js-copy-clipboard').on('click', e => {
        e.preventDefault();
        copy(board.lists.map(list => utils.listToString(list)).join('\n\n'));
        alert('クリップボードにコピーしました。');
      });
    });

    $('<a>')
      .attr({
        class: 'js-copy-clipboard',
        href: '#',
        target: '_blank',
        title: 'copy board to clipboard'
      })
      .text('copy clipboard')
      .insertAfter($export_btn.parent())
      .wrap(document.createElement('li'));

    $('<textarea>')
      .attr({ id: 'js-clipboard-data', style: 'display: none;' })
      .insertAfter($export_btn.parent());
  }
}

var add_clipboard_list_interval: NodeJS.Timer | null = null;

// リストをクリップボードにコピーのリンクを作成する
function addClipboardListLink(listTitle: string) {
  return function() {
    let $follow_btn = $('a.js-list-subscribe');

    if (
      $('.pop-over-list').find('.js-copy-clipboard-list').length != 0 &&
      add_clipboard_list_interval
    ) {
      clearInterval(add_clipboard_list_interval);
      return;
    }

    if (!!$follow_btn) {
      const boardIdReg = /\/b\/(\w{8})\//.exec(location.href);

      if (!boardIdReg) {
        console.log('cannnot get boardId or userName');
        return;
      }

      // データを取りに行ってリンクに文字列を仕込む
      CardService.getBoard(boardIdReg[1], listTitle).then(board => {
        $('.js-copy-clipboard-list').on('click', e => {
          e.preventDefault();
          copy(utils.listToString(board.lists[0]) + '\n');
          alert('クリップボードにコピーしました。');
        });
      });

      $('<a>')
        .attr({
          class: 'js-copy-clipboard-list',
          href: '#',
          target: '_blank',
          title: 'copy list to clipboard'
        })
        .text('copy clipboard')
        .insertAfter($follow_btn.parent())
        .wrap(document.createElement('li'));

      $('<textarea>')
        .attr({ id: 'js-clipboard-data', style: 'display: none;' })
        .insertAfter($follow_btn.parent());
    }
  };
}

// on DOM load
$(document).ready(function($) {
  // the "Share, Print, Export..." link on the board header option list
  $(document).on('mouseup', '.js-share', () => {
    add_mail_interval = setInterval(addMailLink, 300);
    add_clipboard_interval = setInterval(addClipboardLink, 300);
  });

  // open list menu
  $(document).on('mouseup', '.js-open-list-menu', function() {
    let list_title = $(this)
      .parent()
      .parent()
      .find('.js-list-name-assist')
      .text();
    add_clipboard_list_interval = setInterval(
      addClipboardListLink(list_title),
      300
    );
  });
});
