# Scrowl Editor

---

## Getting Started
### Requirements
- Node (Tested with v16.16.0)
- npm (Tested with v8.11.0)

#### Lerna

```
npx lerna

or

npm install --global lerna
```

---

## Initializing The Project
### Bootstrap command runs npm init on all packages

```
lerna bootstrap
```

## Building
### Builds
- Core templates
- Core themes
- Core blueprints
- Player
- Host
- Editor
- Electron platform builds

```
./build.sh
```

---

## Development
### Run in multiple tabs

React app
```
cd packages/editor/
npm run start:server
```

Electron app
```
cd packages/editor/
npm run start
```

---

### Running only the player
```
cd packages/player/
npm run start
```

#### Open URL In Browser
[http://localhost:3001/dev.html](http://localhost:3001/dev.html)