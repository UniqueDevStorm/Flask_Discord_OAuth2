const express = require('express');
const fetch = require('node-fetch');
const app = express();
const scope = 'identify%20email%20guilds'
const Scope_URL = 'https://discord.com/api/oauth2/authorize?client_id=695899835953578025&redirect_uri=https%3A%2F%2Ftest.stormdev.club%2Fredirect&response_type=code&scope=identify%20email%20guilds'
const DISCORD_API_ENDPOINT = 'https://discord.com/api/v8'
const port = 80;

app.get('/', (req, res) => {
    res.redirect(Scope_URL);
})

app.get('/redirect', async (req, res) => {
    var code = req.query.code;
    const params = new URLSearchParams({
        client_id: '695899835953578025',
        code,
        client_secret: '_Ek4bw_rhmnx1EOC7kD2y4Dd9FEsabGj',
        redirect_uri: 'https://test.stormdev.club/redirect',
        grant_type: 'authorization_code',
        scope: scope
    })
    const reque = (await (await fetch(`${DISCORD_API_ENDPOINT}/oauth2/token`, {
        method: 'POST',
        body: params,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })).json())
    const token = reque.access_token
    const type = reque.token_type
    const guild = (await (await fetch(`${DISCORD_API_ENDPOINT}/users/@me/guilds`, {
        method: 'GET',
        headers: {
            Authorization: `${type} ${token}`
        }
    })).json())
    const user = (await (await fetch(`${DISCORD_API_ENDPOINT}/users/@me`, {
        method: 'GET',
        headers: {
            Authorization: `${type} ${token}`
        }
    })).json())
    console.log(user)
    console.log(guild)
    res.send(`${user.username}#${user.discriminator} 님 안녕하세요.<br /> 회원님의 아이디 : ${user.id}<br /> 회원님의 아바타 : ${user.avatar}<br /> 회원님의 이메일 : ${user.email}<br /> 회원님의 인증 여부 : ${user.verified}<br /> 회원님의 국적 : ${user.locale}<br /> 회원님의 프리미엄 티어 : ${user.premium_type}`)
})

app.listen(port, () => {
    console.log(`현재 서버가 http://localhost:${port}/ 에서 열리는 중입니다!`)
})