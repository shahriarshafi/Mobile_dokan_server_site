const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yquz0.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection error', err);
    const serviceCollection = client.db("mobileDokan").collection("services");
    const reviewCollection = client.db("mobileDokan").collection("reviews");
    const orderCollection = client.db("mobileDokan").collection("orders");
    const adminEmailCollection = client.db("mobileDokan").collection("emails");


app.get('/services', (req, res) => {
    serviceCollection.find()
    .toArray((err, items) => {
        res.send(items);
        console.log('from database',items)
    })
})

app.post('/addService', (req, res) => {
    const newService = req.body;
    console.log('adding new product: ', newService);
    serviceCollection.insertOne(newService)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
})

app.get('/reviews', (req, res) => {
    reviewCollection.find()
    .toArray((err, items) => {
        res.send(items);
        console.log('from database',items)
    })
})


app.post('/addReview', (req, res) => {
    const newReview = req.body;
    console.log('adding new product: ', newReview);
    reviewCollection.insertOne(newReview)
    .then(result => {
        console.log('inserted count',result.insertedCount);
        res.send(result.insertedCount > 0)
    })
})

app.post('/update/:id', (req, res)=>{
    const id = ObjectID(req.params.id)
    const data = req.body;
    orderCollection.findOneAndUpdate({_id:id}, {$set :{status:data.status}})
    .then(result => {
        console.log(result)
        res.send(result);
    })
    .catch(err => {
        console.log(err)
    })
})



app.get('/order', (req, res) => {
    orderCollection.find()
    .toArray((err, items) => {
        res.send(items);
    })
})

app.get('/orders', (req, res) => {
    console.log(req.query.email);
    orderCollection.find({email: req.query.email})
    .toArray((err, documents) => {
        res.send(documents);
    })
})

app.post('/addOrder', (req, res) => {
    const newOrder = req.body;
    console.log(newOrder)
    console.log('adding new product: ', newOrder);
    orderCollection.insertOne(newOrder)
    .then(result => {
        console.log('inserted count',result.insertedCount);
        res.send(result.insertedCount > 0)
    })
})

app.get('/adminEmail', (req, res) => {
    adminEmailCollection.find()
    .toArray((err, items) => {
        res.send(items);
        console.log('from database',items)
    })
})

app.post('/addAdminEmail', (req, res) => {
    const newEmail = req.body;
    console.log('adding new product: ', newEmail);
    adminEmailCollection.insertOne(newEmail)
    .then(result => {
        console.log('inserted count',result.insertedCount);
        res.send(result.insertedCount > 0)
    })
})


app.delete('/deleteEvent/:id', (req, res) => {
    const id = req.params.id;
    console.log("Service deleted", id);
    serviceCollection.findOneAndDelete({_id: ObjectID(id)})
    .then((document) => res.send(document.deleteCount > 0))
});

});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})