const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require("cors");
const bodyParser = require('body-parser');
const { ObjectID } = require('bson');

const app = express();
const prot = 5000;

// middleware 
app.use(cors());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json())
app.use(express.json())
app.get('/', (req,res) => {
      res.send('server working')
})


//connect mongodb atlas cloud database
const uri = "mongodb+srv://jakaria-biswas:eENc8Rc2VHsN6Mq@jakaria-biswas.2wzy1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
       try{

           await  client.connect()   
           const database = client.db('food');
           const userCollection = database.collection('users');


         

            //post api
            app.post('/users', async (req,res) => {
                    
                     const newUser =  req.body;
                     const addUser = await userCollection.insertOne(newUser)
                  //    console.log('add new user', addUser)
                     res.json(addUser)
                    
            })
              // get api

              app.get('/user', async (req,res) => {
                    
                  const cursor = userCollection.find({})
                  const user = await cursor.toArray()
                  res.send(user)

         })
    


          // get single user

            
           app.get('/updateUser/:id', async (req,res) => {
                   
                  const id = req.params.id;
                  const query = {_id: ObjectID(id)}
                  const user = await userCollection.findOne(query)
                  res.send(user)
           })


            /// update api 

             app.put('/user/:id', async (req,res) => {
                      
                     const id = req.params.id;
                     const updating = req.body;
                      const filter = {_id: ObjectID(id)}
                      const options = { upsert: true };
                  //     console.log(updating.name)

                      const updateDoc = {
                            $set:{
                                  name: updating.name,
                                  email: updating.email
                            }
                      };
                      const result = await userCollection.updateOne(filter, updateDoc, options);
                      res.send(result)
 
             })

         //delete api
           app.delete('/userDelete/:id', async (req,res) => {
                    
                  const deleteUser =  await userCollection.deleteOne({_id: ObjectID(req.params.id)})
                   res.send(deleteUser.deletedCount > 0)
                 
           })





       } finally{
            // await client.close();
      }

}
run().catch(console.dir);











app.listen( prot, () => console.log('server start'))