# Money Brilliant Extension

An ionic app built to extend the [Money Brilliant](https://moneybrilliant.com.au/) service.

## Components

### App

An ionic app that retrieves the data from the Money Brilliant server and provides summaries to the user. May also store details such as income, target savings goals, etc. if Money Brilliant handle it in a way I don't want to work with, if they handle it at all

### Server

A lightweight API needed for two purposes:

1. To retrieve a session token to authenticate requests to the Money Brilliant API. I wasn't able to retrieve the token from outside of a browser, so the best way I could think to get the key was by running pupeteer in an API endpoint to generate the session token. I'd like to find a better way to authenticate, ideally by logging in from an in-app browser, and sending the token info from the in-app browser back to the app.
2. As a proxy to work around cors issues
