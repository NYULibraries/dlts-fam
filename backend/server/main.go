package main

import (
	"embed"
	"net/http"

	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"

	gin_contrib_static_issue_19_patch "github.com/nyulibraries/dlts-fam/server/gin-contrib-static-issue-19-patch"
)

//go:embed ui
var uiFS embed.FS

func initRouter() *gin.Engine {
	// Disable Console Color
	// gin.DisableConsoleColor()
	router := gin.Default()

	// Serve the embedded UI from root
	// https://github.com/gin-gonic/gin/issues/75#issuecomment-223592440
	router.Use(static.Serve("/",
		gin_contrib_static_issue_19_patch.EmbedFolder(uiFS, "ui", true)))

	// API routes
	router.GET("/api/v0/login", func (context *gin.Context) {
		// Temporary dummy handling to test Vue dev server proxy solution for
		// avoiding CORS errors when using the http://localhost:8080 dev server
		// instance against a running FAM server on a different port.
		context.String(http.StatusOK, "{ \"username\": \"archivist\" }" )
	} )

	return router
}

func main() {
	r := initRouter()
	r.Run(":8081")
}
