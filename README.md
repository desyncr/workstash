# Workstash

![Screenshot](https://github.com/desyncr/workstash/blob/master/screenshot.png?raw=true)

## Description:
Workspace manager extension.

Generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.5.


#### Hacking

Install dependencies:
```
npm install web-ext
```
(See https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/)

Build with: `npm run watch:web-ext`

Load the extension: `cd dist/webext && web-ext run`

##### More documentation on web extensions:
- [Firefox web extension](https://developer.mozilla.org/fr/docs/Mozilla/Add-ons/WebExtensions)
- [Chrome extension](https://developer.chrome.com/extensions)

## Getting Started:

#### Configure extensions:
Clone repo and install dependencies:  
```bash 
git clone --depth 1 https://github.com/radiium/angular-web-extension
cd angular-web-extension
npm install
```
Find and replace ```angular-web-extension``` string by your app name.
May be adjust rules in src/manifest.json like permissions, content_security_policy, etc....

#### Run extension:

All commands create artifact in /dist folder.

##### For Firefox web extension
- dev: ```npm run watch:web-ext```
- prod: ```npm run build:web-ext```  
Go to page ```about:debugging#/runtime/this-firefox``` for install extension manually.

##### For chrome extension
- dev: ```npm run watch:chrome```
- prod: ```npm run build:chrome```  
Go to page ```chrome://extensions/``` for install extension manually.
