var h             = require('virtual-dom/h');
var diff          = require('virtual-dom/diff');
var patch         = require('virtual-dom/patch');
var createElement = require('virtual-dom/create-element');
var debounce      = require('./debounce');
var languages     = require('./movies');

var Search = function ( tot ) {
  var total = h('span.total', [ tot, " found" ] );
  var label = h('label',["Live Search"]);
  var onKeyUpHandler = function ( e ) {
    var term = e.target.value;
    compateDebounced(
      languages.filter(function( item ) {
        return ['title', 'year', 'category', 'rating', 'available'].some(function(i) {
          var i = typeof item[i] === "string" ? item[i] : item[i].join(" ");
          return i.toLowerCase().match(term);
        })
      })
    );
  }
  var input = h('input.sb__input', {
      type: "text",
      name: "search",
      id:"search",
      onkeyup: onKeyUpHandler
    });
  return h('div.sb', [ label, input, total ] );
};


var Total = function ( total ) {
  return h('div.sb', [ "Total:", total ] );
};

var Table = function ( results ) {
  var sort = function ( e ) {
    e.preventDefault();
    console.log('clicked');
  };
  var th = ['Img', 'Title', 'Year', 'Category', 'Rating', 'Available']
           .map( function( i ) {
             return h('th', [ h('span', { id: i.toLowerCase(), onclick: sort }, [i]) ]);
           });
  var thead = h('thead', [ h('tr', [th] ) ]);

  var tr = results.map( function( item ) {
    var td = [];
    var category = item.category.map(function(c){
      return h('span', [c] );
    });
    td.push( h('td.img', [ h('img', { src: item.img }) ] ) );
    td.push( h('td.title', [ item.title ]) );
    td.push( h('td.year', [ item.year ]) );
    td.push( h('td.category', [category]) );
    td.push( h('td.rating', [ item.rating ]) );
    td.push( h('td.available', [ item.available ]) );
    return h('tr', [ td ] );
  });
  var tbody = h('tbody', [tr] );
  var table = h('table.table', [ thead, tbody ] );
  return h('div.sb', [table] );
};

function render( results ) {
  return h('div', [ Search(results.length), Table(results) ] );
}

function compare( results ) {
  var newTree = render( results );
  var patches = diff(tree, newTree);
  rootNode = patch(rootNode, patches);
  tree = newTree;
}

var compateDebounced = debounce(compare, 250);

var tree = render( languages );
var rootNode = createElement( tree );
document.getElementById("app").appendChild( rootNode );
