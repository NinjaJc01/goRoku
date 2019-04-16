# goRoku
A roku controller with a Golang based backend that acts as a proxy to avoid the awful CORS policy from the Roku API.

How to use:
1. Ideally, run the software on a machine like a Raspberry Pi that can be left running so that you don't have to manually start it on a desktop etc.
1. Start the program. If you run it from a terminal like PowerShell or bash, you will see any error messages, otherwise it will run in the background.
1. It hosts a web server on port 8081 by default. If you'd like to change that port, you will have to use command line flags (-p <port number to use>). 
Open in your browser: "localhost:8081/client/remote" (Assuming you're running it on the machine you're using)
1. Navigate to the settings page using the cog icon, and set the IP address of your Roku. This can be found from the settings menu within the Roku under Network. You will need to include the protocol (The "http://" prefix) and the port (The ":8060" suffix).
1. Then try the channels (represented by the squares icon), and the remote page to see if this works. Any issues, contact me.
