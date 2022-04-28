# "To Do" alkalmazás mikroszolgáltatásokra építve

## Labor célja

A labor célja bemutatni a mikroszolgáltatásokra épülő rendszerek esetében gyakran használt _polyglot_ elvet: mikroszolgáltatásonként más-más platformot és nyelvet, valamint más adatbázis rendszer használunk. A szolgáltatásokat pedig egy _API gateway_ fogja össze.

## Előkövetelmények

Az alkalmazás teljes egészében platformfüggetlen. A kényelmes fejlesztéshez azonban a forráskód Microsoft Visual Studio-t feltételez.

- Visual Studio Code
- Visual Studio Code [Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension
- Docker WSL2 támogatással
- Postman

## Rendszer felépítése

A rendszer az alábbi mikroszolgáltatásokból épül fel:

- _todos_: A teendőket kezelő alkalmazás, ASP.NET Core platformon, REST API-t biztosítva. Elasticsearch adatbázist és Redis cache-t használ.
- _web_: React-ra épülő SPA webalkalmazás TypeScript-ben, NGINX webszerverrel kiszolgálva.
- _users_: Felhasználókat kezelő alkalmazás Python-ban, MongoDB adatbázisra épülve REST API-t biztosít.

```
                   +----+     +-------+      +---------+
                   |    +---->+ todos +--+-->+ elastic |
+-----------+      |API |     +-------+  |   +---------+
|  browser  +----->+gate|                |
+-----------+      |way |                |   +---------+
                   |    |     +-------+  +-->|  redis  |
                   |    +---->+  web  |      +---------+
                   |    |     +-------+
                   |    |
                   |    |     +-------+      +---------+
                   |    +---->+ users +----->+ mongodb |
                   +----+     +-------+      +---------+

```

## Futtatás

### Visual Studio Code Remote Container

VS Code-ban az F1 menüben _Remote Containers: Open Folder in Container_, majd az alábbi mappák egyikét kell megnyitni, attól függően, hogy melyik szolgáltatást akarjuk debuggolni:

- `src/Todos` a _Todos_ nevű .NET alkalmazáshoz,
- `src/Users` a _Users_ nevű Python alkalmazáshoz.

Mindkettőben a _Run and Debug_ panel alól elindítható a megfelelő debug profil, aminek hatására a .NET vagy a Python alkalmazás debug módban indul, míg a a többi konténer folyamatosan fut.

### Konzolból

Az `src` könyvtárban az alábbi parancsokkal fordítható és indítható az alkalmazás:

```bash
docker-compose build
docker-compose up
```

### URL-ek

Az egyes szolgáltatások az alábbi URL-eken érhetően el:

- Weboldal
  - <http://localhost:5080>
  - Visual Studio Code-ban futtatva közvetlenül <http://localhost:5082>
- Todos REST API
  - <http://localhost:5080/api/todos>
  - Visual Studio Code-ban futtatva közvetlenül <http://localhost:5081/api/todos>
- Users REST API
  - <http://localhost:5080/api/users>
  - Visual Studio Code-ban futtatva közvetlenül <http://localhost:5083/api/users>
- Traefik Dashboard: <http://localhost:5088>
- Mongodb: <mongodb://localhost:27017>
- Elasticsearch: <http://localhost:9200>

---

Az itt található oktatási segédanyagok a BMEVIAUAV42 tárgy hallgatóinak készültek. Az anyagok oly módú felhasználása, amely a tárgy oktatásához nem szorosan kapcsolódik, csak a szerző(k) és a forrás megjelölésével történhet.

Az anyagok a tárgy keretében oktatott kontextusban értelmezhetőek. Az anyagokért egyéb felhasználás esetén a szerző(k) felelősséget nem vállalnak.
