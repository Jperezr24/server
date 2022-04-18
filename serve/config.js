export default {
    client_id: 'Iv1.ae0edfacda9e616a',
    client_secret: process.env.github_secret,
    redirect_url: 'http://localhost:8080/register',
    autorize: 'https://github.com/login/oauth/authorize',
    server_autorize: 'https://github.com/login/oauth/access_token',
    secret:process.env.secret,
}