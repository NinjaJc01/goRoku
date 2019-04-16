# goRoku
A Roku streaming device controller for the browser using a Go server to host the static content and run a proxy to get around the restrictive CORS policy on the Roku API.

This is designed to allow you to control a Roku from a laptop or desktop without the physical remote. I created this as I spent several hours watching Netflix while using my Thinkpad, and wanted to control the channels and type a little easier!

For mobile devices, there are official and unofficial apps however goRoku can also be used as long as the host device has the correct firewall settings.

How to use:
1. Ideally, run the software on a machine like a Raspberry Pi that can be left running so that you don't have to manually start it on a desktop etc.
1. Start the program. If you run it from a terminal like PowerShell or bash, you will see any error messages, otherwise it will run in the background.
1. It hosts a web server on port 8081 by default. If you'd like to change that port, you will have to use command line flags (-p <port number to use>). 
Open in your browser: "localhost:8081/client/remote" (Assuming you're running it on the machine you're using)
1. Navigate to the settings page using the cog icon, and set the IP address of your Roku. This can be found from the settings menu within the Roku under Network. You will need to include the protocol (the "http://" prefix) and the port (the ":8060" suffix).
1. Then try the channels (represented by the squares icon), and the remote page to see if this works. Any issues, contact me.
  
Interface:
+There are three pages, Remote, Apps/Channels and Settings.
+From the Remote page, you can type into search boxes etc and navigate with arrow keys ("\`" to select, Esc as a back button). The keyboard button enables/disables keyboard input.
+From the Apps/Channels page, you can select a channel to switch to by clicking one of the images.
+From the Settings page, you can switch themes (Light or Dark themes) and also set the IP Address of the Roku to control.

API for power users:
+`/api/roku/proxy/` allows you to send/recieve requests to/from the Roku, such as `GET /api/roku/proxy/query/apps`. Error codes, request body etc are all echoed back via the Go server allowing you to make requests to just one origin.
+`/api/roku/image/<channel id>` allows you to GET a channel icon in JPEG format. Internally, these are cached in memory to save time and calls to the Roku with every Channel page load.
+`/api/roku/ipaddr/` allows you to GET or set the Roku's IP address, use a POST with a plaintext body with the URL in order to set the IP.

