'use strict';

import $ from 'jquery';

// メールを送信する
let exportMail = () => {
  let mail_deffer = getSendAddress();
  let body_deffer = createExportText();

  Promise.all([mail_deffer, body_deffer]).then((data) => {
    const subjet = escapeMailBody(data[1][0])
    const body = escapeMailBody(data[1][1]);
    window.location.href =`mailto:${data[0]}?subject=${subjet}&body=${body}`
  });
}

// 送信先のアドレスを返すPromiseを返す
function getSendAddress() {

  let member_name = document.getElementsByClassName('member-avatar')[0]
    .getAttribute('title');
  let user_name = /^.*\((\w+)\)$/.exec(member_name)[1]

  return fetch(`/1/members/${user_name}?fields=name,email`, {
    credentials: 'include'
  }).then((res) => {
    return res.json();
  }).then((json) => {
    return Promise.resolve(json.email);
  });
}

// 送信するボードの本文を作成する
function createExportText() {

  let board_export_url = document.getElementsByClassName('js-export-json')[0]
    .getAttribute('href');
  let parts = /\/b\/(\w{8})\.json/.exec(board_export_url);

  if(!parts) {
    console.log("Board menu not open.");
    return Promise.reject();
  }

  const board_id = parts[1];

  return fetch(`/1/boards/${board_id}?lists=open&cards=open`
     + '&card_fields=name,pos,idList'
     + '&fields=name,desc', {
    credentials: 'include'
  }).then((res) => {
    return res.json();
  }).then((data) => {
    // baord name
    let board_name = data.name

    // lists and cards
    let lists = getCardLists(data)

    let mail_body = "";
    for (let list of lists) {
      mail_body += `${list.name}\n`;
      mail_body += `${new Array(list.name.length * 2).join('-')}\n\n`;

      for (let card of list.cards) {
        mail_body += `* ${card.name}\n`;
      }

      mail_body += "\n\n";
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
        list.cards.push({name: card_data.name});
      } else {
        continue;
      }
    }
  }
  return lists;
}

// メールの文字列をエスケープする
function escapeMailBody(str) {
  return str.replace(/%/g, '%25')
    .replace(/\n/g, '%0d%0a')
    .replace(/=/g, '%3D')
    .replace(/&/g, "%26")
    .replace(/,/g, '%2C')
    .replace(/ /g, '%20')
    .replace(/\?/g, '%3f')
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
    $('<a>').attr({
        class: 'js-export-mail',
        href: '#',
        target: '_blank',
        'title': 'Export board to mail'
      })
      .text('Mail to')
      .click(exportMail)
      .insertAfter($export_btn.parent())
      .wrap(document.createElement("li"));
  }
}

var add_clipboard_interval = null;

// メール送信のリンクを作成する
function addClipboardlLink() {
  let $export_btn = $('a.js-export-json');
  let clipboardData = e.clipboardData

  if ($('.pop-over-list').find('.js-export-clipboard').length != 0) {
    clearInterval(add_clipboard_interval);
    return;
  }

  if (!!$export_btn) {
    $('<a>').attr({
        class: 'js-export-mail',
        href: '#',
        target: '_blank',
        'title': 'copy board to clipboard'
      })
      .text('M to')
      .click(exportMail)
      .insertAfter($export_btn.parent())
      .wrap(document.createElement("li"));
  }
}


// on DOM load
$(document).ready(function($) {
  // the "Share, Print, Export..." link on the board header option list
  $(document).on('mouseup', '.js-share', () => {
    add_mail_interval = setInterval(addMailLink, 300);
    add_clipboard_interval = setInterval(addClipboardlLink, 300);
  });
});
