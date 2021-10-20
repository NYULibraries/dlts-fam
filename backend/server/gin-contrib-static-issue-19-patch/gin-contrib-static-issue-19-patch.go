package gin_contrib_static_issue_19_patch

import (
	"embed"
	"github.com/gin-contrib/static"
	"io/fs"
	"net/http"
)

// https://github.com/gin-contrib/static/issues/19#issue-830589998
// https://github.com/gin-contrib/static/issues/19#issuecomment-883514258 (different author adding indexes param to the OP's code)
// [feat: Implement embed folder and a better organisation #20|https://github.com/gin-contrib/static/pull/20/files] (doesn't have indexes param)

type embedFileSystem struct {
	http.FileSystem
	indexes bool
}

func (e embedFileSystem) Exists(prefix string, path string) bool {
	f, err := e.Open(path)
	if err != nil {
		return false
	}

	// check if indexing is allowed
	s, _ := f.Stat()
	if s.IsDir() && !e.indexes {
		return false
	}

	return true
}

func EmbedFolder(fsEmbed embed.FS, targetPath string, index bool) static.ServeFileSystem {
	subFS, err := fs.Sub(fsEmbed, targetPath)
	if err != nil {
		panic(err)
	}
	return embedFileSystem{
		FileSystem: http.FS(subFS),
		indexes:    index,
	}
}
