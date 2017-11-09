const functions = require('firebase-functions');
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

exports.onPizzaUpdated = functions.database.ref('orders/{order}/pizzas/{pizza}/{child}').onWrite(event => {
  let itemCats;
  let itemTypes;
  return Promise.all([
    admin.database().ref('itemCat').once('value', data => {
      itemCats = data.val();
    }),
    admin.database().ref('itemType').once('value', data => {
      itemTypes = data.val();
    })]
  ).then(() => {
    const itemCat = itemCats[event.params.child];
    console.log(itemTypes);
    if (itemCat === null) return null;
    return event.data.ref.parent.transaction(pizza => {
      if (!pizza) return pizza;
      if (itemCat.exclusive) {
        console.log('exclusive');
        if (!pizza.cost) pizza.cost = 0;
        const previousItemType = itemTypes[event.data.previous.val()];
        if (previousItemType) pizza.cost -= previousItemType.cost;
        const itemType = itemTypes[event.data.val()];
        if (itemType) pizza.cost += itemType.cost;
      } else {
        console.log('inclusive');
      }
      return pizza;
    });
  });
});

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});
