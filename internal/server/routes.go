package server

import (
	"encoding/json"
	"fmt"
	"hms-api/routes"
	"hms-api/utils"
	"io"
	"os"
	"path/filepath"
	"strings"

	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/google/uuid"
)

func (s *Server) RegisterRoutes() http.Handler {
	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))

	// fileServer := http.FileServer(http.Dir("./../../uploads"))
	// r.Handle("/uploads/*", fileServer)
	workDir, _ := os.Getwd()
	filesDir := http.Dir(filepath.Join(workDir, "uploads"))
	FileServer(r, "/uploads", filesDir)
	r.Get("/health", s.healthHandler)

	v1Router := chi.NewRouter()
	r.Mount("/api/v1", v1Router)
	v1Router.Post("/upload", s.uploadHandler)
	v1Router.Delete("/delete-file", s.deleteHandler)
	userHandler := routes.NewUserHandler(s.db)
	userHandler.RegisterUserRoutes(v1Router)
	roomsHandler := routes.NewRoomHandler(s.db)
	roomsHandler.RegisterUserRoutes(v1Router)
	bookingsHandler := routes.NewBookingHandler(s.db)
	bookingsHandler.RegisterUserRoutes(v1Router)

	return r
}

func (s *Server) HelloWorldHandler(w http.ResponseWriter, r *http.Request) {
	resp := make(map[string]string)
	resp["message"] = "Hello World"

	jsonResp, err := json.Marshal(resp)
	if err != nil {
		log.Fatalf("error handling JSON marshal. Err: %v", err)
	}

	_, _ = w.Write(jsonResp)
}

func (s *Server) healthHandler(w http.ResponseWriter, r *http.Request) {
	jsonResp, _ := json.Marshal(s.db.Health())
	_, _ = w.Write(jsonResp)
}

func (s *Server) uploadHandler(w http.ResponseWriter, r *http.Request) {
	file, header, err := r.FormFile("image")
	if err != nil {
		utils.APIError(w, http.StatusBadRequest, fmt.Errorf("bad request"))
		return
	}
	defer file.Close()
	uniqueId := uuid.New()
	filename := filepath.Base(uniqueId.String() + "-" + header.Filename)
	f, err := os.Create("uploads/" + filename)
	if err != nil {
		utils.ServerError(w, r, err)
		return
	}
	defer f.Close()

	_, err = io.Copy(f, file)
	if err != nil {
		utils.ServerError(w, r, err)
		return
	}

	imageUrl := os.Getenv("APP_URL") + "/uploads/" + filename

	utils.Encode(w, http.StatusOK, map[string]string{"image_url": imageUrl})
}

func (s *Server) deleteHandler(w http.ResponseWriter, r *http.Request) {
	url := r.URL.Query().Get("url")
	url = strings.Replace(url, os.Getenv("APP_URL"), "", 1)
	url = strings.TrimPrefix(url, "/")

	// Check if the file exists
	if _, err := os.Stat(url); err != nil {
		utils.APIError(w, http.StatusNotFound, fmt.Errorf("image not found"))
		return
	}

	// Delete the file
	if err := os.Remove(url); err != nil {
		utils.ServerError(w, r, err)
		return
	}

	utils.Encode(w, http.StatusOK, map[string]string{"message": "Image Deleted"})
}

func FileServer(r chi.Router, path string, root http.FileSystem) {
	if strings.ContainsAny(path, "{}*") {
		panic("FileServer does not permit any URL parameters.")
	}

	if path != "/" && path[len(path)-1] != '/' {
		r.Get(path, http.RedirectHandler(path+"/", http.StatusMovedPermanently).ServeHTTP)
		path += "/"
	}
	path += "*"

	r.Get(path, func(w http.ResponseWriter, r *http.Request) {
		rctx := chi.RouteContext(r.Context())
		pathPrefix := strings.TrimSuffix(rctx.RoutePattern(), "/*")
		fs := http.StripPrefix(pathPrefix, http.FileServer(root))
		fs.ServeHTTP(w, r)
	})
}
