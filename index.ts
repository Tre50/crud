import express from "express"
import cors from "cors"
import { MongoClient, ObjectId } from "mongodb"
import 'dotenv/config'
import bcrypt from 'bcrypt'

const app = express()
app.use(express.json())
app.use(cors())
const client = new MongoClient(process.env.MONGO_URI as string)
const db = client.db('dinos-store')

const users = db.collection('users')
 client.connect()
 app.get('/', (req, res) =>{
    res.send('here is my api info')
 })





app.listen(process.env.PORT, () => console.log('API running here'))

app.get('/', async (req, res) => {
    const allUsers = await users.find().toArray()
    res.send(allUsers)
})
app.post('/', async(req,res) => {
    const userEmail = req.body.email
    const userAdded = await users.insertOne (req.body)
    const userPassword = req.body.password
    const hashPass = await userAdded.insertOne({email: userEmail, password: userPassword})
    res.status(201).send(userAdded)
})
app.delete('/:_id',async(req,res) =>  {
  const hashPass =  bcrypt.hash(req.body.password, 10)
    const cleanId = new ObjectId(req.params._id)
    console.log('req.params ->',req.params)
const userDeleted = await users.findOneAndDelete({ _id: cleanId}) 
res.send(userDeleted)

})
app.patch ('/:_id', async(req, res) => {
    const cleanId = new ObjectId(req.params._id)
const itemUpdated = await  users.findOneAndUpdate( {$set: req.body}, {_id: cleanId})
res.send(itemUpdated)
})

app.post ('/login', (req, res) => {
const foundUser =  users.findOne({email: req.body.email})
const userPassword = req.body.password
if(foundUser){}
const passInDb = foundUser?.password
const result = bcrypt.compare(userPassword, passInDb)

res.send(foundUser)

})



