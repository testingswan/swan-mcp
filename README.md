# Escape the Fiat Matrix

A simple maze game where you navigate through the maze, collect Bitcoin, avoid shitcoins, and try to escape the fiat matrix.

## Game Overview

- Use arrow keys to navigate the maze
- Collect Bitcoin (orange squares) to increase your stack
- Avoid shitcoins (light orange squares) which will reduce your Bitcoin stack
- Reach the EXIT to escape the fiat matrix
- Watch out for inflation reducing your USD purchasing power over time

## Development

This game is built using [Phaser 3](https://phaser.io/phaser3), a powerful HTML5 game framework.

## Deployment

The game can be easily deployed using [Surge](https://surge.sh/), a simple static web publishing platform.

### Using the Deploy Script

We've included a convenient deploy script that:

1. Pulls the latest code from the main branch
2. Deploys the game to Surge

#### Prerequisites

- [Surge](https://surge.sh/) installed globally: `npm install -g surge`
- Git installed and configured

#### Basic Usage

```bash
./deploy.sh
```

This will deploy the game to the default domain: `swan-mcp.surge.sh`

#### Custom Domain

You can specify a custom domain for deployment:

```bash
./deploy.sh --domain your-custom-domain.surge.sh
```

#### Options

- `-d, --domain DOMAIN`: Specify a custom domain for deployment
- `-h, --help`: Show help message

#### Notes

- The script will check for uncommitted changes before deployment
- It will automatically switch to the main branch, pull the latest changes, and then return to your original branch
- Error handling is included to ensure a smooth deployment process

## License

This project is open source and available under the MIT License.
