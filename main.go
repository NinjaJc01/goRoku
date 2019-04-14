package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"io/ioutil"

	"log"
	"net/http"

	//xj "github.com/basgys/goxml2json"
	"github.com/gorilla/mux"
)

var channelList map[string]interface{}
var channelIcons map[string][]byte
//Config is a struct to be used in saving/loading the config file
type Config struct {
	IPAddr string `json:"ipaddr"`
}
var rokuURL = "http://192.168.1.10:8060"

func main() {
	channelIcons = make(map[string][]byte)
	buff, err := ioutil.ReadFile("config.json")
	if err != nil {
		log.Fatalln(err.Error())
	}
	var conf Config
	err = json.Unmarshal(buff, &conf)
	if err != nil {
		log.Fatalln(err.Error())
	}
	rokuURL = conf.IPAddr
	startServer()
}
func startServer() {
	portPtr := flag.Int("p", 8081, "Port number to run the server on")
	flag.Parse()
	port := *portPtr
	mr := mux.NewRouter()
	mr.NotFoundHandler = http.HandlerFunc(notFoundHandler)
	apiRouter := mr.PathPrefix("/api").Subrouter()
	//Setup a static router for HTML/CSS/JS
	mr.PathPrefix("/client/").Handler(http.StripPrefix("/client/", http.FileServer(http.Dir("./resources"))))
	//API routes
	rokuRouter := apiRouter.PathPrefix("/roku").Subrouter()
	//rokuRouter.HandleFunc("/apps", appsHandler)
	rokuRouter.HandleFunc("/image/{id}", appImageHandler)
	rokuRouter.PathPrefix("/proxy/").Handler(
		http.StripPrefix("/api/roku/proxy/",
		http.HandlerFunc(rokuProxy)))
	rokuRouter.HandleFunc("/ipaddr",ipHandler)
	//rokuRouter.HandleFunc("/proxy/", rokuProxy)
	log.Println("Listening for requests")
	http.ListenAndServe(fmt.Sprintf(":%v", port), mr)
}

func appImageHandler(w http.ResponseWriter, r *http.Request) {
	//TODO investigate caching these in a map!
	requestedIcon := mux.Vars(r)["id"]
	if channelIcons[requestedIcon] != nil { //If cached
		//log.Println("Image cache hit")
		w.Write(channelIcons[requestedIcon]) //send from cache
		return
	}
	res, err := http.Get(rokuURL + "/query/icon/" + requestedIcon)
	w.Header().Add("Content-type", "image/jpeg")
	if err != nil {
		log.Println(err.Error())
		w.WriteHeader(500)
		return
	}
	content, err := ioutil.ReadAll(res.Body)
	if len(content) == 0 {
		w.WriteHeader(404)
		return
	}

	if err != nil {
		log.Println(err.Error())
		w.WriteHeader(500)
		return
	}
	channelIcons[requestedIcon] = content //Add to cache if all works
	w.Write(content)
}
func rokuProxy(w http.ResponseWriter, r *http.Request) {
	destination := r.URL.String()
	switch r.Method {
		case "GET":
			resp, err := http.Get(rokuURL+"/"+destination)
			if err != nil {
				log.Println(err.Error())
				w.WriteHeader(500)
				return
			}
			if resp.StatusCode != 200 {
				log.Println("Proxy GET failed with status code:\t",resp.StatusCode)
				w.WriteHeader(resp.StatusCode)
				return
			}
			content, err := ioutil.ReadAll(resp.Body)
			if err != nil {
				log.Println(err.Error())
				w.WriteHeader(500)
				return
			}
			w.Write(content)
			return
		case "POST":
			resp, err := http.Post(rokuURL+"/"+destination,"text/plain",nil)
			if err != nil {
				log.Println(err.Error())
				w.WriteHeader(500)
				return
			}
			if resp.StatusCode != 200 {
				log.Println("Proxy POST failed with status code:\t",resp.StatusCode)
				w.WriteHeader(resp.StatusCode)
				return
			}
			content, err := ioutil.ReadAll(resp.Body)
			if err != nil {
				log.Println(err.Error())
				w.WriteHeader(500)
				return
			}
			w.Write(content)
			return
		default:
			w.WriteHeader(405)
			w.Header().Add("Allow", "GET, POST")
	}
}
func ipHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" { //If I need to update the Roku IP
		buffer, err := ioutil.ReadAll(r.Body)
		if err != nil {
			log.Println(err.Error())
			w.WriteHeader(500)
			return
		}
		log.Println("buf:",string(buffer))
		w.Write([]byte("OK"))
		conf := Config{IPAddr:string(buffer)}
		content, err := json.Marshal(conf)
		if err != nil {
			log.Println(err.Error())
			w.WriteHeader(500)
			return
		}
		err = ioutil.WriteFile("config.json",content, 0660)
		if err != nil {
			log.Println(err.Error())
			w.WriteHeader(500)
			return
		}
	} else if r.Method == "GET" {//If I need to send back the IP instead
		w.Header().Add("Content-type", "text/plain")
		w.Write([]byte(rokuURL))
	} else {
		w.WriteHeader(405)
		w.Header().Add("Allow", "GET, POST")
	}
}
func reqHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(404)
}
func notFoundHandler(w http.ResponseWriter, r *http.Request) { //Handle 404s
	w.WriteHeader(404)
}
