# HedgeDenAI - H&D50

## Overview

## Features

### Current MVP Scope

### Market Research

### Business model

Management fee similar to traditional index funds (0.15-0.75%)

## Setup

### Portia AI agent

Setup env vars in `ai-agent` dir:

- `export OPENAI_API_KEY='your-api-key-here`
- `export PORTIA_API_KEY='your-api-key-here'`
- `export TAVILY_API_KEY='api_key'`

### Dapp

Setup in /Dapp dir:

- run `npm i` to install dependencies
- set your OPENAI api key
- run `npm run dev` to start dapp locally

### Solana MCP server

Download the installation script

`curl -fsSL https://raw.githubusercontent.com/sendaifun/solana-mcp/main/scripts/install.sh -o solana-mcp-install.sh`

Make it executable and run

`chmod +x solana-mcp-install.sh && ./solana-mcp-install.sh --backup`
