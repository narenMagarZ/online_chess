import express from 'express'
import router from './router'
import cors from 'cors'

function buildApp(){
    const app = express()
    app.use(cors({
        'origin':'http://localhost:3000',
        'credentials':true,
        'methods':['get','post','put','delete'],
    }))
    app.use('/',router)
    return app
}
export default buildApp()