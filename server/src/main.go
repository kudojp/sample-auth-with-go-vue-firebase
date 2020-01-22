package main

import (
    "log"
    "net/http"

    "github.com/gorilla/mux"
    "github.com/gorilla/handlers"
)

func public(w http.ResponseWriter, r *http.Request) {
    w.Write([]byte("hello public!\n"))
}

func private(w http.ResponseWriter, r *http.Request) {
    w.Write([]byte("hello private!\n"))
}

func main() {

    allowedOrigins := handlers.AllowedOrigins([]string{"http://localhost:8080"})
    allowedMethods := handlers.AllowedMethods([]string{"GET", "POST", "DELETE", "PUT"})
    allowedHeaders := handlers.AllowedHeaders([]string{"Authorization"})

    r := mux.NewRouter()
    r.HandleFunc("/public", public)
    r.HandleFunc("/private", private)

    log.Fatal(http.ListenAndServe(":8000", handlers.CORS(allowedOrigins, allowedMethods, allowedHeaders)(r)))
}