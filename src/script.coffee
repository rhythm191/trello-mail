'use strict'

$ = require 'jquery'
ListFactory = require('./models/list').ListFactory

add_interval = null

board_name = ""
mail_body = ""

# メールを送信する
exportMail = ->
  d = createExportText()

  if d?
    d.done (data) ->
      console.log "mailto:sac2ndg@gmail.com?subject=#{board_name}&body=#{mail_body.replace(" ", "%20").replace("?", "%3f")}"
      location.href = "mailto:sac2ndg@gmail.com?subject=#{board_name}&body=#{mail_body.replace(" ", "%20").replace("?", "%3f")}"

# 送信するボードの本文を作成する
createExportText = ->

  boardExportURL = $('a.js-export-json').attr('href')
  #RegEx to extract Board ID
  parts = /\/b\/(\w{8})\.json/.exec(boardExportURL)

  if !parts
    alert "Board menu not open."
    return

  board_id = parts[1]

  $.getJSON("https://trello.com/1/boards/#{board_id}",
    lists: "all"
    cards: "all"
    card_fields: "name,pos,idList"
    members: "all"
    fields: "name,desc"
  ).done (data) ->
    # baord name
    board_name = data.name

    # lists and cards
    lists = ListFactory.build(data)
    mail_body = ""
    for list in lists
      mail_body += "#{list.name}%0d%0a"
      mail_body += "#{new Array(list.name.length * 2).join('-')}%0d%0a"

      for card in list.cards
        mail_body += " - #{card.name}%0d%0a"

      mail_body += "%0d%0a%0d%0a"


# メール送信のリンクを作成する
addMailLink = ->
  $export_btn = $ 'a.js-export-json'

  if $('.pop-over-list').find('.js-export-mail').length
    clearInterval add_interval
    return

  if $export_btn
    $mail_btn = $('<a>')
      .attr
        class: 'js-export-mail'
        href: '#'
        target: '_blank'
        'title': 'Export board to mail'
      .text('Mail to')
      .click exportMail
      .insertAfter $export_btn.parent()
      .wrap document.createElement "li"

# on DOM load 
$ ->
  #the "Share, Print, Export..." link on the board header option list
  $(document).on 'mouseup', '.js-share', ->
    add_interval = setInterval addMailLink, 300
