'use strict';

import $ from 'jquery';

var add_interval = null;

let board_name = "";
let mail_body = "";


// メールを送信する
let exportMail = () => {

  let member_name = $('.member-avatar:first').attr('title')
  let parts = /^.*\((\w+)\)$/.exec(member_name)

  let email_address = ""

  let mail_deffer = $.getJSON(`https://trello.com/1/members/${parts[1]}`, {
    fields: "name,email"
  }).done((data) => {
    email_address = data.email;
  });

  let body_deffer = createExportText();

  if (!!body_deffer) {
    $.when(mail_deffer, body_deffer).done(() => {
      location.href = `mailto:${email_address}?subject=${board_name}&body=${mail_body.replace(',', '%2C').replace(' ', '%20').replace('?', '%3f')}"`
    });
  }
}

// 送信するボードの本文を作成する
let createExportText = () => {

  let boardExportURL = $('a.js-export-json').attr('href');
  // RegEx to extract Board ID
  let parts = /\/b\/(\w{8})\.json/.exec(boardExportURL);

  if(!parts) {
    console.log("Board menu not open.");
    return;
  }

  const board_id = parts[1];

  return $.getJSON(`https://trello.com/1/boards/${board_id}`, {
    lists: "open",
    cards: "open",
    card_fields: "name,pos,idList",
    fields: "name,desc"
  }).done((data) => {
    // baord name
    board_name = data.name

    // lists and cards
    let lists = getCardLists(data)
    mail_body = "";
    for (let list of lists) {
      mail_body += `${list.name.replace('=', '%3D').replace('%', '%25').replace("&", "%26")}%0d%0a`;
      mail_body += `${new Array(list.name.length * 2).join('-')}%0d%0a%0d%0a`;

      for (let card of list.cards) {
        mail_body += `* ${card.name.replace('=', '%3D').replace('%', '%25').replace("&", "%26")}%0d%0a`;
      }

      mail_body += "%0d%0a%0d%0a";
    }
  });
}

// メール送信のリンクを作成する
let addMailLink = () => {
  let $export_btn = $('a.js-export-json');

  if ($('.pop-over-list').find('.js-export-mail').length != 0) {
    clearInterval(add_interval);
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


// on DOM load
$(document).ready(function($) {
  // the "Share, Print, Export..." link on the board header option list
  $(document).on('mouseup', '.js-share', () => {
    add_interval = setInterval(addMailLink, 300);
  });
})
