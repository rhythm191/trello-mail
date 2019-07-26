'use strict';

import $ from 'jquery';
import Clipboard from 'clipboard';

// メールを送信する
let exportMail = () => {
  let mail_deffer = getSendAddress();
  let body_deffer = createExportText();

  Promise.all([mail_deffer, body_deffer]).then(data => {
    const subjet = escapeMailBody(data[1][0]);
    const body = escapeMailBody(data[1][1]);
    window.location.href = `mailto:${data[0]}?subject=${subjet}&body=${body}`;
  });
};

// 送信先のアドレスを返すPromiseを返す
function getSendAddress() {
  let member_name = document
    .getElementsByClassName('member-avatar')[0]
    .getAttribute('title');
  let user_name = /^.*\((\w+)\)$/.exec(member_name)[1];

  return fetch(`/1/members/${user_name}?fields=name,email`, {
    credentials: 'include'
  })
    .then(res => {
      return res.json();
    })
    .then(json => {
      return Promise.resolve(json.email);
    });
}

// 送信するボードの本文を作成する
function createExportText(list_title) {
  let board_url = location.href;
  let parts = /\/b\/(\w{8})\//.exec(board_url);
  console.log(list_title);

  if (!parts) {
    console.log('Board menu not open.');
    return Promise.reject();
  }

  const board_id = parts[1];

  return fetch(
    `/1/boards/${board_id}?lists=open&cards=open` +
      '&card_fields=name,pos,idList' +
      '&fields=name,desc',
    {
      credentials: 'include'
    }
  )
    .then(res => {
      return res.json();
    })
    .then(data => {
      // baord name
      let board_name = data.name;

      // lists and cards
      let lists = getCardLists(data);

      let mail_body = '';
      for (let list of lists) {
        if (!list_title || list_title == list.name) {
          mail_body += `${list.name}\n`;
          mail_body += `${new Array(list.name.length * 2).join('-')}\n\n`;

          for (let card of list.cards) {
            mail_body += `* ${card.name}\n`;
          }

          mail_body += '\n\n';
        }
      }
      return Promise.resolve([board_name, mail_body]);
    });
}

// カードリストを作成する
function getCardLists(datas) {
  let lists = [];
  for (let list_data of datas.lists) {
    let list = {
      id: list_data.id,
      name: list_data.name,
      cards: []
    };
    lists.push(list);

    for (let card_data of datas.cards) {
      if (list.id === card_data.idList) {
        list.cards.push({ name: card_data.name });
      } else {
        continue;
      }
    }
  }
  return lists;
}

// メールの文字列をエスケープする
function escapeMailBody(str) {
  return str
    .replace(/%/g, '%25')
    .replace(/\n/g, '%0d%0a')
    .replace(/=/g, '%3D')
    .replace(/&/g, '%26')
    .replace(/,/g, '%2C')
    .replace(/ /g, '%20')
    .replace(/\?/g, '%3f');
}

var add_mail_interval = null;

// メール送信のリンクを作成する
function addMailLink() {
  let $export_btn = $('a.js-export-json');

  if ($('.pop-over-list').find('.js-export-mail').length != 0) {
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

var add_clipboard_interval = null;

// クリップボードにコピーのリンクを作成する
function addClipboardLink() {
  let $export_btn = $('a.js-export-json');
  let $pop_over_list = $('.pop-over-list');

  if ($('.pop-over-list').find('.js-copy-clipboard').length != 0) {
    clearInterval(add_clipboard_interval);
    return;
  }

  if (!!$export_btn) {
    // データを取りに行ってリンクに文字列を仕込む
    createExportText().then(data => {
      const body = data[1];

      // FIXME: chromeのアップデートかなんかでclipboard.jsダメになったので対策
      $('.js-copy-clipboard').on('click', e => {
        e.preventDefault();
        execCopy(body);
        alert('クリップボードにコピーしました。');
      });

      // const clipboard = new Clipboard('.js-copy-clipboard');
      // clipboard.on('success', e => {
      //   alert('クリップボードにコピーしました。');
      // });
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

var add_clipboard_list_interval = null;

// リストをクリップボードにコピーのリンクを作成する
function addClipboardListLink(list_title) {
  return function() {
    let $follow_btn = $('a.js-list-subscribe');
    let $pop_over_list = $('.pop-over-list');

    if ($('.pop-over-list').find('.js-copy-clipboard-list').length != 0) {
      clearInterval(add_clipboard_list_interval);
      return;
    }

    if (!!$follow_btn) {
      // データを取りに行ってリンクに文字列を仕込む
      createExportText(list_title).then(data => {
        const body = data[1];

        // FIXME: chromeのアップデートかなんかでclipboard.jsダメになったので対策
        $('.js-copy-clipboard-list').on('click', e => {
          e.preventDefault();
          execCopy(body);
          alert('クリップボードにコピーしました。');
        });

        // const clipboard = new Clipboard('.js-copy-clipboard');
        // clipboard.on('success', e => {
        //   alert('クリップボードにコピーしました。');
        // });
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
  $(document).on('mouseup', '.js-open-list-menu', function(e) {
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

function execCopy(string) {
  // 空div 生成
  var tmp = document.createElement('div');
  // 選択用のタグ生成
  var pre = document.createElement('pre');

  // 親要素のCSSで user-select: none だとコピーできないので書き換える
  pre.style.webkitUserSelect = 'auto';
  pre.style.userSelect = 'auto';

  tmp.appendChild(pre).textContent = string;

  // 要素を画面外へ
  var s = tmp.style;
  s.position = 'fixed';
  s.right = '200%';

  // body に追加
  document.body.appendChild(tmp);
  // 要素を選択
  document.getSelection().selectAllChildren(tmp);

  // クリップボードにコピー
  var result = document.execCommand('copy');

  // 要素削除
  document.body.removeChild(tmp);

  return result;
}
