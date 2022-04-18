import express from "express";
import config from "./config.js";
import fetch from 'node-fetch';
import jwt from 'jsonwebtoken'
import cookieParser from "cookie-parser";
const port = 8080;
const app = express();


app.use(cookieParser())
app.get('/', (req, res) => {
    if (req.cookies?.session) {
        res.end(`
        
        <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
  </head>
  <body>
      <form action="/logout" method="post">
          <button type="submit">Logout</button>
      </form>
  </body>
  </html>
  
        
        `)
    }
    else {
        res.redirect('/login')
    }
})

app.get('/login', (req, res) => {
    res.end(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
  </head>
  <body>
      <form action="/login" method="post">
          <button type="submit">Login github</button>
      </form>
  </body>
  </html>
  `)
})

app.post('/login', (req, res) => {
    const url = new URL(config.autorize);
    url.searchParams.append('client_id', config.client_id)
    res.redirect(url.href);
})

app.post('/logout', (_, res) => {
    res.clearCookie('session', {
        httpOnly: true,
    })
    res.redirect('/login')
})
app.get('/register', async (req, res) => {
    const { code } = req.query;
    const url = new URL(config.server_autorize);
    url.searchParams.append('client_id', config.client_id)
    url.searchParams.append('client_secret', config.client_secret)
    url.searchParams.append('code', code);
    const response = await fetch(url.href, {
        method: 'POST', headers: {
            'Accept': 'application/json'
        }
    });
    const data = await response.json();
    const user = await getUserData(data);
    const token = createJwt(user)
    res.cookie('session', token, {
        httpOnly: true,
    })
    res.redirect('/')
})

function createJwt({ email }) {
    const token = jwt.sign({ email }, config.secret)
    return token;
}

async function getUserData({ access_token }) {
    const response = await fetch('https://api.github.com/user', {
        method: 'GET', headers: {
            'Accept': 'application/json',
            'Authorization': `bearer ${access_token}`
        }
    });
    const user = await response.json();
    return user
}

app.listen(port, () => {
    console.log(`server is running in port ${port}`)
})