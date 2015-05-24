
# list class
class List
  contructor: (id, name) ->
    @id = id
    @name = name
    @cards = []

  getName: ->
    @name

  addCard: (card) ->
    @cards.push card

  getCards: ->
    @cards

class ListFactory
  @build: (datas) ->
    lists = []
    for list_data in datas.lists
      list = 
        id: list_data.id
        name: list_data.name
        cards: []
      lists.push list
    
      for card_data in datas.cards
        if list.id is card_data.idList
          list.cards.push( name: card_data.name )
        else
          continue
    lists


# card class
class Card
  contructor: (name) ->
    @name

  getName: ->
    @name


module.exports.ListFactory = ListFactory
