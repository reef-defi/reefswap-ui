# Reefswap UI



## Developer guide

### Installation

Cloning the project and installing the dependencies.

```bash
git clone git@github.com:reef-defi/reefswap-ui.git
cd reefswap-ui
yarn
```

### Run

Run `yarn start` and visit `localhost:3000`

### Build docker container

```bash
cd reefswap-ui
docker build -t reefswap-ui .
```

### Run with docker

```bash
docker run -p 80:80 reefswap-ui
```

Visit application on `localhost`.