# VoiceWallet

## Overview

VoiceWallet is completely new type of crypto wallet which uses voice commands for control.

<p align="center">
<br />
    <img src="/images/app1.png" alt="logo"/>
<br />
</p>

## Features

### Current MVP Scope

- Voice to text recognition using state of the art Whisper model
- Integration with OpenAI for NLP
- Solana MCP for onchain actions
- Solana wallet integration
- Wormhole integration for easy bridging

### Market Research

I've reached out to end users of Solana on few tg chats/discord servers and some wweb3 friends - reactions to the app were overwhelmingly positive. Seems like the app is especially good idea for people new to crypto.

### Business model

Management fee similar to traditional index funds (0.15-0.75%) for all transactions

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
