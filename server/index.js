const { client, createTables, createUser, createProduct, fetchUsers, fetchProducts,
  createfavorites, fetchfavorites, deleteFavorites, fetchUsersFavorites
} = require('./db');
const express = require('express');
const app = express();
app.use(express.json());

app.get('/api/users/:user_id/favorites', async(req, res, next) => {
try{
res.send(await fetchUsersFavorites({user_id: req.params.user_id}));
}
catch(ex){
  next(ex);
}
});

app.delete('/api/users/:user_id/favorites/:id', async(req, res, next)=> {
    try {
        console.log(req.params.user_id);
      await deleteFavorites({ id: req.params.id, user_id: req.params.user_id });
      res.sendStatus(204);
    }
    catch(ex){
      next(ex);
    }
  });

app.get('/api/users', async(req, res, next)=> {
    try {
      res.send(await fetchUsers());
    }
    catch(ex){
      next(ex);
    }
  });
  
  app.get('/api/products', async(req, res, next)=> {
    try {
      res.send(await fetchProducts());
    }
    catch(ex){
      next(ex);
    }
  });

  app.post('/api/users/:id/favorites', async(req, res, next)=> {
    console.log(req.params.id);
    console.log(req.body.skill_id);
    try {
      res.status(201).send(await createfavorites({ user_id: req.params.id, product_id: req.body.product_id}));
    }
    catch(ex){
      next(ex);
    }
  });

const init = async()=> {
    await client.connect();
    console.log('connected to database');
    await createTables();
    console.log('tables created');
    
    
    const [moe, lucy, ethyl, playstation, nintendo, computer, apple] = await Promise.all([
      createUser({ username: 'moe', password: 's3cr3t' }),
      createUser({ username: 'lucy', password: 's3cr3t!!' }),
      createUser({ username: 'ethyl', password: 'shhh' }),
      createProduct({ name: 'Playstation'}),
      createProduct({ name: 'Nintendo'}),
      createProduct({ name: 'Computer'}),
      createProduct({ name: 'Apple Related Product'}),
      
    ]);
    
    const users = await fetchUsers();
  console.log(users);

  const products = await fetchProducts();
  console.log(products);

  const favorites = await Promise.all([
    createfavorites({ user_id: moe.id, product_id: playstation.id}),
    createfavorites({ user_id: moe.id, product_id: nintendo.id}),
    createfavorites({ user_id: ethyl.id, product_id: computer.id}),
    createfavorites({ user_id: lucy.id, product_id: apple.id}),
  ]);

  console.log(await fetchfavorites(moe.id));
  
  await deleteFavorites(favorites[0].id, moe.id);
  console.log('After Delete I am here');
  console.log(await fetchfavorites(moe.id));
  
  
  const port = process.env.PORT || 3000;
  app.listen(port, ()=> console.log(`listening on port ${port}`));
  
  };
  
  init();