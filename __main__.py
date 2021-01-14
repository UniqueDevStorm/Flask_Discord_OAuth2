from flask import Flask, Response, redirect, request, jsonify
import requests

app = Flask(__name__)


def GetToken(code):
    r = requests.post(
        url="https://discord.com/api/v8/oauth2/token",
        data={
            "client_id": client_id,
            "client_secret": client_secret,
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": "http://localhost:5000/redirect",
            "scope": "identify%20email%20guilds",
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    return r.json()


def GetUserData(token, token_type):
    r = requests.get(
        url="https://discord.com/api/v8/users/@me",
        headers={"Authorization": f"{token_type} {token}"},
    )
    return r.json()


@app.route("/")
def Home():
    return redirect(redirect_uri)


@app.route("/redirect")
def Code():
    code = request.args.get("code")
    postcode = GetToken(code)
    token = postcode["access_token"]
    token_type = postcode["token_type"]
    return jsonify(GetUserData(token, token_type))


app.run(debug=True)
