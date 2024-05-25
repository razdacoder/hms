package main

import (
	"fmt"
	"hms-api/internal/server"
	"log"
)

func main() {

	server := server.NewServer()
	log.Println("Listening on port ", server.Addr)

	err := server.ListenAndServe()
	if err != nil {
		panic(fmt.Sprintf("cannot start server: %s", err))
	}

}
