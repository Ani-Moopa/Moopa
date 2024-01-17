<div align="center">
<a href="https://moopa.live">
  <img src="https://user-images.githubusercontent.com/97084324/234460363-216b29d3-acba-4c29-a321-780de84c9ab0.png" alt="logo" width="180"/>
</a>
</div>

<h1 align="center">
  <a href="https://moopa.live">Moopa Anime Streaming Website</a>
</h1>

<p align="center">

 <a href="https://github.com/DevanAbinaya/Ani-Moopa/blob/main/LICENSE.md">
    <img src="https://img.shields.io/github/license/DevanAbinaya/Ani-Moopa" alt="license"/>
  </a>
  <a href="https://github.com/DevanAbinaya/Ani-Moopa/fork">
    <img src="https://img.shields.io/github/forks/DevanAbinaya/Ani-Moopa?style=social" alt="fork"/>
  </a>
  <a href="https://github.com/DevanAbinaya/Ani-Moopa">
    <img src="https://img.shields.io/github/stars/DevanAbinaya/Ani-Moopa?style=social" alt="stars"/>
  </a>
  
</p>

> ⚠️ **DISCLAIMER**: This branch is not stable. Any errors or issues encountered while using this code will not be supported or addressed by me. Use this code at your own risk. I will not provide assistance for any problems that arise from using this code.

<p align="center">
 <img src="https://github.com/Ani-Moopa/Moopa/assets/97084324/c17d5d6a-36a2-4d08-957d-ad4683dcdf0d" alt="main">
</p>

<details>
<summary>More Screenshots</summary>

<h3 align="center">Home page after you login</h3>
<img src="https://github.com/Ani-Moopa/Moopa/assets/97084324/4eab1606-adc3-43e6-8c62-712354732083"/>

<h3 align="center">Profile Page</h3>
<img src="https://user-images.githubusercontent.com/97084324/234556937-76ec236c-a077-4af5-a910-0cb85e900e38.gif"/>

<h3 align="center">Info page for PC/Mobile</h3>
<p align="center">
<img src="https://github.com/Ani-Moopa/Moopa/assets/97084324/7126ca71-26dc-4a02-819d-9e84c938d5c6"/>
</p>

<h3 align="center">Watch Page</h3>
<p align="center">Normal Mode</p>
<img src="https://github.com/Ani-Moopa/Moopa/assets/97084324/03b2c9c7-eb25-4f2c-8f26-a9ae817bfbaa"/>
<br/>
<p align="center">Theater Mode</p>
<img src="https://github.com/Ani-Moopa/Moopa/assets/97084324/767a0335-f6a3-4969-b415-3c45d07cce64"/>
 
<h3 align="center">Manga Reader</h3>
<img src="https://github.com/DevanAbinaya/Ani-Moopa/assets/97084324/ccd2ee11-4ee3-411c-b634-d48c84f1a9e2"/>

</details>

> **Warning:** If you are not familiar with JavaScript or any other programming language related to this project, please learn it first before attempting to work on this project. **I won't help anyone who doesn't know how to do basic stuff.**

## Introduction

<p><a href="https://moopa.live">Moopa</a> is an anime streaming website made possible by the <a href="https://github.com/consumet">Consumet API</a>, built with <a href="https://github.com/vercel/next.js/">Next.js</a> and <a href="https://github.com/tailwindlabs/tailwindcss">Tailwind</a>, featuring a sleek and modern design. It offers Anilist integration to help you keep track of your favorite anime series. Moopa is entirely free and does not display any ads, making it a great option for those who want an uninterrupted viewing experience.</p>

## Features

- General
  - Free ad-supported streaming service
  - Dub Anime support
  - User-friendly interface
  - Auto sync with AniList
  - Add Anime/Manga to your AniList
  - Scene Searching powered by [trace.moe](https://trace.moe)
  - PWA supported
  - Mobile responsive
  - Fast page load
- Watch Page
  - Player
    - Autoplay next episode
    - Skip op/ed button
    - Theater mode
  - Comment section
- Profile page to see your watch list

## To Do List

- [x] Add PWA support
- [x] Connect to consumet API to fetch episodes data
- [x] Implement skip op/ed button on supported anime
- [x] Create README file
- [x] Integrate Anilist API for anime tracking
  - [x] Ability to auto track anime after watching >= 90% through the video
  - [x] Create a user profile page to see lists of anime watched
  - [x] Ability to edit list inside detail page
- [x] Working on Manga pages

## Bug Report

If you encounter any issues or bug on the site please head to [issues](https://github.com/DevanAbinaya/Ani-Moopa/issues) and create a bug report there.

## For Local Development

> If you want to self-host this app, please note that it is only allowed for personal use. Commercial use is not permitted, and including ads on your self-hosted site may result in actions such as site takedown.

1. Clone this repository using :

```bash
git clone https://github.com/DevanAbinaya/Ani-Moopa.git
```

2. Install package using npm :

```bash
npm install
```

3. Create `.env` file in the root folder and put this inside the file :

```bash
## AniList
CLIENT_ID="get the id from here https://anilist.co/settings/developer"
CLIENT_SECRET="get the secret from here https://anilist.co/settings/developer"
GRAPHQL_ENDPOINT="https://graphql.anilist.co"

## NextAuth
NEXTAUTH_SECRET='run this cmd in your bash terminal (openssl rand -base64 32) with no bracket, and paste it here'
NEXTAUTH_URL="for development use http://localhost:3000/ and for production use your domain url"

## NextJS
PROXY_URI="This is what I use for proxying video https://github.com/chaycee/M3U8Proxy. Don't put / at the end of the url."
API_URI="host your own API from this repo https://github.com/consumet/api.consumet.org. Don't put / at the end of the url."
DISQUS_SHORTNAME='put your disqus shortname here (optional)'

## Prisma
DATABASE_URL="Your postgresql connection url"

## Redis
# If you don't want to use redis, just comment the REDIS_URL (press ctrl + / on windows or cmd + / on mac)
REDIS_URL="rediss://username:password@host:port"
```

4. Add this endpoint as Redirect Url on AniList Developer :

```bash
https://your-website-domain/api/auth/callback/AniListProvider
```

5. Generate Prisma :

```bash
npx prisma migrate dev
npx prisma generate
```

6. Start local server :

```bash
npm run dev
```

## Credits

- [Consumet API](https://github.com/consumet/api.consumet.org) for anime sources
- [AniList API](https://github.com/AniList/ApiV2-GraphQL-Docs) for anime details source
- [Anify API](https://anify.tv/discord) for manga sources
- [miru](https://github.com/ThaUnknown/miru/) for inspiring me making this site

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE.md](LICENSE.md) file for details.

> This means that if you choose to use or host this site for your own purposes, you are also required to release the source code of any modifications or improvements you make to this project. This open-source ethos is central to the project's philosophy.

## Contact

Thank You for passing by!!

If you have any questions or feedback, please reach out to us at [contact@moopa.live](mailto:contact@moopa.live?subject=[Moopa]%20-%20Your%20Subject), or you can join our [discord sever](https://discord.gg/4xTGhr85BG).
<br>
or you can DM me on Discord `Factiven#9110`.

[![Discord Banner](https://discordapp.com/api/guilds/822413263148285973/widget.png?style=banner2)](https://discord.gg/v5fjSdKwr2)

## Support This Project

✨ [Star this project](https://github.com/DevanAbinaya/Ani-Moopa)

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/E1E6F9XZ3)  
<a href="https://trakteer.id/factiven" target="_blank"><img id="wse-buttons-preview" src="https://cdn.trakteer.id/images/embed/trbtn-red-5.png" height="36" style="border: 0px; height: 36px;" alt="Trakteer Saya"></a>
