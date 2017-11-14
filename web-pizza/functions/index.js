const functions = require('firebase-functions');
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

exports.onOrderCostDeleted = functions.database.ref('orders/{order}/cost').onDelete(event => {
  return event.data.ref.parent.transaction(order => {
    console.log('order recalculate transaction');
    console.log(order);
    if (!order) return order;
    order.cost = 0;
    if (order.pizzas) for (let i = 0; i < order.pizzas.length; i++) {
      console.log(order.pizzas[i]);
      if (order.pizzas[i] && order.pizzas[i].cost)
        order.cost += order.pizzas[i].cost;
    }
    if (order.cost === 0)
      order.cost = null;
    return order;
  });
});

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
    console.log(event.params.child);
    if (event.params.child === 'cost') {
      if (event.data.val()) return event.data.ref.parent.parent.parent.transaction(order => {
        console.log('order total transaction');
        console.log(order);
        if (!order) return order;
        order.cost = 0;
        if (order.pizzas) for (let i = 0; i < order.pizzas.length; i++) {
          console.log(order.pizzas[i]);
          if (order.pizzas[i] && order.pizzas[i].cost)
            order.cost += order.pizzas[i].cost;
        }
        if (order.cost === 0)
          order.cost = null;
        return order;
      });
      else return event.data.ref.parent.transaction(pizza => {
        console.log('recalculate transaction');
        console.log(pizza);
        if (!pizza) return pizza;
        pizza.cost = 0;
        for (const cat in pizza) if (pizza.hasOwnProperty(cat)) {
          const itemCat = itemCats[cat];
          if (!itemCat) continue;
          console.log(cat);
          if (itemCat.exclusive) {
            console.log('exclusive');
            console.log(pizza[cat]);
            const itemType = itemTypes[pizza[cat]];
            if (itemType) pizza.cost += itemType.cost;
          } else {
            console.log('inclusive');
            console.log(pizza[cat]);
            const current = pizza[cat];
            if (current) for (const type in current) if (current.hasOwnProperty(type)) {
              console.log(type);
              const itemType = itemTypes[type];
              if (itemType) pizza.cost += itemType.cost;
            }
          }
        }
        if (pizza.cost === 0)
          pizza.cost = null;
        return pizza;
      });
    }
    const itemCat = itemCats[event.params.child];
    console.log(itemCat);
    if (!itemCat) return null;
    return event.data.ref.parent.transaction(pizza => {
      console.log('modify transaction');
      console.log(pizza);
      if (!pizza) return pizza;
      if (!pizza.cost) pizza.cost = 0;
      if (itemCat.exclusive) {
        console.log('exclusive');
        console.log('previous');
        console.log(event.data.previous.val());
        const previousItemType = itemTypes[event.data.previous.val()];
        if (previousItemType) pizza.cost -= previousItemType.cost;
        console.log('current');
        console.log(event.data.val());
        const itemType = itemTypes[event.data.val()];
        if (itemType) pizza.cost += itemType.cost;
      } else {
        console.log('inclusive');
        console.log('previous');
        console.log(event.data.previous.val());
        const previous = event.data.previous.val();
        if (previous) for (const type in previous) if (previous.hasOwnProperty(type)) {
          console.log(type);
          const itemType = itemTypes[type];
          if (itemType) pizza.cost -= itemType.cost;
        }
        console.log(event.data.previous.val());
        console.log(event.data.val());
        const current = event.data.val();
        if (current) for (const type in current) if (current.hasOwnProperty(type)) {
          console.log(type);
          const itemType = itemTypes[type];
          if (itemType) pizza.cost += itemType.cost;
        }
      }
      if (pizza.cost === 0)
        pizza.cost = null;
      return pizza;
    });
  });
});

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});
