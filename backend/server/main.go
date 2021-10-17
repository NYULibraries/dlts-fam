package main

import (
	"embed"
	_ "embed"
	"io/fs"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

//go:embed ui/*
var uiFS embed.FS

func initRouter() *gin.Engine {
	// Disable Console Color
	// gin.DisableConsoleColor()
	router := gin.Default()

	uiContentsFS, err := fs.Sub(uiFS, "ui")
	if err != nil {
		log.Fatalln(err)
	}
	router.StaticFS("/", http.FS(uiContentsFS))

	return router
}

func main() {
	r := initRouter()
	r.Run(":8081")
}
