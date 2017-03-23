# MEANStackApp
Backend authentication with json web token (CRUD)

### Version
1.0.0

## Usage

```bash
npm install
```

```bash
npm start
```

## API (Endpoints)
```bash
POST /users/register      //Registers a new user
```

```bash
POST /users/authenticate   // Gives back a token
```

```bash
GET /users/profile         // Needs json web token to authorize
```

```bash
DELETE /users/profile       // Needs a json web token to delete a user 
```

```bash
POST /users/update         // Needs json web token to update user field(s)
```
