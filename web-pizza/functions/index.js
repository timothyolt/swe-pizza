const functions = require('firebase-functions');
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
const express = require('express');
const cookieParser = require('cookie-parser')();
const cors = require('cors')({origin: true});
const app = express();

exports.onOrderCostDeleted = functions.database.ref('orders/{order}/cost').onDelete(event => {
  let taxRate;
  return admin.database().ref('globals/taxRate').once('value', data => {
    taxRate = data.exists() ? data.val() : 0;
  }).then(() => event.data.ref.parent.transaction(order => {
    console.log('order recalculate transaction');
    console.log(order);
    if (!order) return order;
    order.cost = 0;
    if (order.pizzas) for (let i = 0; i < order.pizzas.length; i++) {
      console.log(order.pizzas[i]);
      if (order.pizzas[i] && order.pizzas[i].cost)
        order.cost += order.pizzas[i].cost;
    }
    if (order.cost === 0) {
      order.cost = null;
      order.total = null;
    }
    else
      order.total = order.cost + order.cost * taxRate;
    return order;
  }));
});

exports.onPizzaRemoved = functions.database.ref('orders/{order}/pizzas/{pizza}').onDelete(event => {
  console.log('delete data ', event.data.previous.child('cost').val());
  if (event.data.previous.child('cost').exists()) {
    console.log('order pizza removal transaction');
    let taxRate;
    return admin.database().ref('globals/taxRate').once('value', data => {
      taxRate = data.exists() ? data.val() : 0;
    }).then(() => event.data.ref.parent.parent.child('cost').transaction(orderCost => {
      if (!orderCost) {
        return null;
      }
      orderCost -= event.data.previous.child('cost').val();
      if (orderCost === 0) {
        orderCost = null;
        event.data.ref.parent.parent.child('total').set(null);
      }
      else
        event.data.ref.parent.parent.child('total').set(orderCost + orderCost * taxRate);
      return orderCost;
    }));
  } else {
    return null;
  }
});

exports.onPizzaUpdated = functions.database.ref('orders/{order}/pizzas/{pizza}/{child}').onWrite(event => {
  let itemCats;
  let itemTypes;
  let taxRate;
  return Promise.all([
    admin.database().ref('itemCat').once('value', data => {
      itemCats = data.val();
    }),
    admin.database().ref('itemType').once('value', data => {
      itemTypes = data.val();
    }),
    admin.database().ref('globals/taxRate').once('value', data => {
      taxRate = data.exists() ? data.val() : 0;
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
        if (order.cost === 0) {
          order.cost = null;
          order.total = null;
        }
        else
          order.total = order.cost + order.cost * taxRate;
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

// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
// `Authorization: Bearer <Firebase ID Token>`.
// when decoded successfully, the ID Token content will be added as `req.user`.
const validateFirebaseIdToken = (req, res, next) => {
  console.log('Check if request is authorized with Firebase ID token');

  if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
    !req.cookies.__session) {
    console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.',
      'Make sure you authorize your request by providing the following HTTP header:',
      'Authorization: Bearer <Firebase ID Token>',
      'or by passing a "__session" cookie.');
    res.status(403).send('Unauthorized');
    return;
  }

  let idToken;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    console.log('Found "Authorization" header');
    // Read the ID Token from the Authorization header.
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else {
    console.log('Found "__session" cookie');
    // Read the ID Token from cookie.
    idToken = req.cookies.__session;
  }
  admin.auth().verifyIdToken(idToken).then(decodedIdToken => {
    console.log('ID Token correctly decoded', decodedIdToken);
    req.user = decodedIdToken;
    next();
  }).catch(error => {
    console.error('Error while verifying Firebase ID token:', error);
    res.status(403).send('Unauthorized');
  });
};

app.use(cors);
app.use(cookieParser);
app.use(validateFirebaseIdToken);
app.get('/acquireUser', (req, res) => {
  let acquireUserIdToken;
  let acquireUser;
  let userSnapshot;
  let acquireUserSnapshot;
  if (req.headers.secondauthorization && req.headers.secondauthorization.startsWith('Bearer ')) {
    console.log('Found "SecondAuthorization" header');
    // Read the ID Token from the Authorization header.
    acquireUserIdToken = req.headers.secondauthorization.split('Bearer ')[1];
  } else {
    console.error('No Secondary Firebase ID token was passed as a Bearer token in the Authorization header.',
      'Make sure you authorize your request by providing the following HTTP header:',
      'SecondAuthorization: Bearer <Firebase ID Token>');
    res.status(403).send('Unauthorized');
    return;
  }
  return admin.auth().verifyIdToken(acquireUserIdToken).then(decodedIdToken => {
    console.log('ID Token correctly decoded', decodedIdToken);
    acquireUser = decodedIdToken;
    return decodedIdToken
  }).catch(error => {
    console.error('Error while verifying Firebase ID token:', error);
    res.status(403).send('Unauthorized');
  }).then(() => {
    return admin.database().ref('/users/' + req.user.uid).once('value', user => {
      console.log('user get: ', user ? user.val() : null);
      userSnapshot = user;
    })
  }).then(() => {
    return admin.database().ref('/users/' + acquireUser.uid).once('value', user => {
      console.log('user get: ', user ? user.val() : null);
      acquireUserSnapshot = user;
    })
  }).then(() => {
    console.log('user: ', userSnapshot.val());
    console.log('acquireUser: ', acquireUserSnapshot.val());
    if (userSnapshot && acquireUserSnapshot && userSnapshot.child('activeOrder').exists() && acquireUserSnapshot.child('activeOrder').exists()) {
      let acquireOrderSnapshot;
      let orderSnapshot;
      // because the user acquires the new order, the new order must acquire the old one
      return Promise.all([
        admin.database().ref('/orders/' + userSnapshot.child('activeOrder').val()).once('value', acquireOrder => {
          acquireOrderSnapshot = acquireOrder;
        }),
        admin.database().ref('/orders/' + acquireUserSnapshot.child('activeOrder').val()).once('value', order => {
          orderSnapshot = order;
        })
      ]).then(() => {
        let orderMax = -1; // -1 for no pizzas /shrug
        orderSnapshot.child('pizzas').forEach(pizza => {
          if (Number(pizza.key) > orderMax)
            orderMax = Number(pizza.key);
        });
        const order = orderSnapshot.val();
        const acquireOrder = acquireOrderSnapshot.val();
        for (const pizza in Object.keys(acquireOrder.pizzas)) if (acquireOrder.pizzas.hasOwnProperty(pizza)) {
          console.log(Number(pizza));
          acquireOrder.pizzas[Number(pizza) + orderMax + 1] = acquireOrder.pizzas[Number(pizza)];
          delete acquireOrder.pizzas[Number(pizza)];
        }
        for (const pizza in Object.keys(order.pizzas)) if (order.pizzas.hasOwnProperty(pizza)) {
          console.log(Number(pizza));
          acquireOrder.pizzas[Number(pizza)] = order.pizzas[Number(pizza)];
        }
        acquireOrder.user = req.user.uid;
        // note, this only produces an option update for direct children
        // a partial address or payment will override a full one
        return admin.database().ref('/orders/' + acquireUserSnapshot.child('activeOrder').val()).update(acquireOrder).then(() => {
          return admin.database().ref('/orders/' + userSnapshot.child('activeOrder').val()).remove();
        });
      }).then(() => {
        // note, this only produces an option update for direct children
        // a partial address will override a full one
        const acquireUserVal = acquireUserSnapshot.val();
        // todo: update any payments to allow user access
        // todo: update any orders to allow user access
        acquireUserVal.payMethods = null;
        return admin.database().ref('/users/' + req.user.uid).update(acquireUserVal).then(() => {
          return admin.database().ref('/users/' + acquireUser.uid).remove();
        });
      });
    } else if (acquireUserSnapshot.exists()) {
      // note, this only produces an option update for direct children
      // a partial address will override a full one
      const acquireUserVal = acquireUserSnapshot.val();
      // todo: update any payments to allow user access
      // todo: update any orders to allow user access
      return admin.database().ref('/users/' + req.user.uid).update(acquireUserVal).then(() => {
        return admin.database().ref('/users/' + acquireUser.uid).remove();
      });
    }
  }).then(() => {
    return admin.auth().deleteUser(acquireUser.uid);
  }).then(() => {
    res.status(200).send('OK');
  }).catch(error => {
    console.error('Error while acquiring user: ', error);
    res.status(500).send(error);
  });
});

// This HTTPS endpoint can only be accessed by your Firebase Users.
// Requests need to be authorized by providing an `Authorization` HTTP header
// with value `Bearer <Firebase ID Token>`.
exports.app = functions.https.onRequest(app);
