### Release Overview Dashboard ###

Developed during Hackathon 8 at Dealertrack.

Yusuf Songur <br/>
Shannon Barrett<br/>
Mark Lusby<br/>
Stephen England<br/>

#### Dependencies ####

* NodeJS (tested on the most recent versions)
* Git client - make sure that you've added the git executable to your environment path

================================

#### Running the app ####

1. Pull down the repository
2. Make sure you've got the node dependencies
> npm install

3. Update the config.json file so that it points to the location of your local git repository
> "git" : { "repoLocation": "<your local repository>"}

4. Run the following to start the web server (default listening port is 5000)
> node web.js

5. Navigate to http://localhost:5000 to run the app

================================

#### Run automation ####

Make sure you have latest dependencies

> npm install --dev

> grunt

This will open a browser, start the express server, and JS lint.
