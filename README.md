How to contribute to free and Open Source software
==================================================

## What is it?
An Open Web App showing a todo list for getting involved in Free and Open Source
software, to check off as you go.

## Server Setup
The server has to serve the Open Web App and Appcache manifests with the right
Content-Type header.

With Apache, add the following to a .htaccess
<pre>AddType application/x-web-app-manifest+json .webapp
AddType text/cache-manifest .appcache</pre>

With Nginx, add the following to the types{ … } section of your config file
<pre>application/x-web-app-manifest+json   webapp;
text/cache-manifest    appcache</pre>

## Update
When you modify some files, you have to modify howtofoss.appcache too, so the
cache is updated.
Just increment the version number at the beginning of the file. You should
update the version number in manifest.webapp accordingly.
