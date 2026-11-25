package main

import (
	"net/http"
	"regexp"
	"strings"
	"time"
	"unicode/utf8"

	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/types"
)

// Origem da visita, lida da URL de entrada pelo site (lib/lead-source.ts).
type attributionInput struct {
	Campaign string `json:"campaign"`
	Ad       string `json:"ad"`
	Source   string `json:"source"`
	Medium   string `json:"medium"`
	Referrer string `json:"referrer"`
	Landing  string `json:"landing"`
}

type identityInput struct {
	Visitor     string           `json:"visitor"`
	Session     string           `json:"session"`
	Attribution attributionInput `json:"attribution"`
}

var (
	idPattern       = regexp.MustCompile(`^[A-Za-z0-9-]{8,64}$`)
	recordIdPattern = regexp.MustCompile(`^[a-z0-9]{15}$`)
	botPattern      = regexp.MustCompile(`(?i)bot|crawl|spider|slurp|preview|headless|lighthouse|facebookexternalhit|whatsapp|monitor|curl|wget|python|go-http`)
	spaces          = regexp.MustCompile(`\s+`)
)

var searchHosts = []string{"google.", "bing.", "duckduckgo.", "yahoo.", "ecosia.", "baidu.", "yandex."}
var socialHosts = []string{
	"facebook.", "instagram.", "linkedin.", "lnkd.in", "youtube.", "youtu.be", "tiktok.",
	"t.co", "twitter.", "x.com", "whatsapp.", "wa.me", "pinterest.", "threads.", "kwai.",
}
var socialSources = []string{"facebook", "fb", "instagram", "ig", "meta", "linkedin", "youtube", "tiktok", "twitter", "x", "whatsapp", "threads"}

// clean remove quebras de linha e espaços extras e limita o tamanho.
func clean(value string, max int) string {
	value = strings.TrimSpace(spaces.ReplaceAllString(value, " "))
	if utf8.RuneCountInString(value) > max {
		value = string([]rune(value)[:max])
	}
	return value
}

func validId(value string) string {
	if idPattern.MatchString(value) {
		return value
	}
	return ""
}

func hostMatches(host string, list []string) bool {
	for _, item := range list {
		if strings.Contains(host, item) {
			return true
		}
	}
	return false
}

// channelFor agrupa a origem em: campaign (anúncio/campanha), search, social,
// referral (outro site) ou direct.
func channelFor(a attributionInput) string {
	medium := strings.ToLower(a.Medium)
	source := strings.ToLower(a.Source)
	host := strings.ToLower(a.Referrer)

	switch {
	case a.Ad != "" || a.Campaign != "",
		strings.Contains(medium, "cpc"), strings.Contains(medium, "paid"), strings.Contains(medium, "ads"):
		return "campaign"
	case medium == "social" || containsWord(socialSources, source):
		return "social"
	case medium == "organic" || hostMatches(host, searchHosts):
		return "search"
	case hostMatches(host, socialHosts):
		return "social"
	case host != "" || source != "":
		return "referral"
	default:
		return "direct"
	}
}

func containsWord(list []string, value string) bool {
	for _, item := range list {
		if item == value {
			return true
		}
	}
	return false
}

func normalizePath(value string) string {
	value = strings.TrimSpace(value)
	if i := strings.IndexAny(value, "?#"); i >= 0 {
		value = value[:i]
	}
	if !strings.HasPrefix(value, "/") {
		return ""
	}
	if len(value) > 1 {
		value = strings.TrimRight(value, "/")
	}
	return clean(value, 200)
}

func setAttribution(record *core.Record, identity identityInput) {
	a := attributionInput{
		Campaign: clean(identity.Attribution.Campaign, 160),
		Ad:       clean(identity.Attribution.Ad, 160),
		Source:   clean(identity.Attribution.Source, 80),
		Medium:   clean(identity.Attribution.Medium, 80),
		Referrer: strings.TrimPrefix(strings.ToLower(clean(identity.Attribution.Referrer, 160)), "www."),
		Landing:  normalizePath(identity.Attribution.Landing),
	}
	record.Set("channel", channelFor(a))
	record.Set("campaign", a.Campaign)
	record.Set("ad", a.Ad)
	record.Set("utm_source", a.Source)
	record.Set("utm_medium", a.Medium)
	record.Set("referrer", a.Referrer)
	record.Set("landing", a.Landing)
	record.Set("visitor", validId(identity.Visitor))
	record.Set("session", validId(identity.Session))
}

func isBot(e *core.RequestEvent) bool {
	ua := e.Request.Header.Get("User-Agent")
	return ua == "" || botPattern.MatchString(ua)
}

type pageviewInput struct {
	identityInput
	Path   string `json:"path"`
	Device string `json:"device"`
	Lang   string `json:"lang"`
}

func handlePageview(e *core.RequestEvent) error {
	var input pageviewInput
	if err := e.BindBody(&input); err != nil {
		return e.BadRequestError("Dados inválidos.", err)
	}
	path := normalizePath(input.Path)
	if path == "" || validId(input.Visitor) == "" || isBot(e) {
		return e.NoContent(http.StatusNoContent)
	}

	collection, err := e.App.FindCachedCollectionByNameOrId("pageviews")
	if err != nil {
		return err
	}
	record := core.NewRecord(collection)
	record.Set("path", path)
	switch input.Device {
	case "mobile", "tablet", "desktop":
		record.Set("device", input.Device)
	}
	record.Set("lang", clean(input.Lang, 8))
	setAttribution(record, input.identityInput)

	if err := e.App.Save(record); err != nil {
		return e.BadRequestError("Não foi possível registrar a visita.", err)
	}
	return e.NoContent(http.StatusNoContent)
}

type leadAnswer struct {
	Section string `json:"section"`
	Label   string `json:"label,omitempty"`
	Value   string `json:"value"`
}

type leadInput struct {
	identityInput
	Id       string       `json:"id"`
	Origin   string       `json:"origin"`
	Name     string       `json:"name"`
	Company  string       `json:"company"`
	Email    string       `json:"email"`
	Phone    string       `json:"phone"`
	City     string       `json:"city"`
	Profile  string       `json:"profile"`
	Locale   string       `json:"locale"`
	Answers  []leadAnswer `json:"answers"`
	Message  string       `json:"message"`
	WhatsApp bool         `json:"whatsapp"`
}

func handleLead(e *core.RequestEvent) error {
	var input leadInput
	if err := e.BindBody(&input); err != nil {
		return e.BadRequestError("Dados inválidos.", err)
	}
	if input.Origin != "diagnosis" && input.Origin != "form" {
		return e.BadRequestError("Origem inválida.", nil)
	}
	if clean(input.Company, 160) == "" && clean(input.Name, 160) == "" {
		return e.BadRequestError("Informe o nome ou a empresa.", nil)
	}
	if clean(input.Phone, 40) == "" && clean(input.Email, 200) == "" {
		return e.BadRequestError("Informe um contato.", nil)
	}
	if isBot(e) {
		return e.NoContent(http.StatusNoContent)
	}

	collection, err := e.App.FindCachedCollectionByNameOrId("leads")
	if err != nil {
		return err
	}

	// O navegador envia o id do lead: reenvios do mesmo diagnóstico atualizam
	// o registro em vez de duplicar.
	var record *core.Record
	if recordIdPattern.MatchString(input.Id) {
		if existing, err := e.App.FindRecordById(collection, input.Id); err == nil {
			record = existing
		}
	}
	if record == nil {
		record = core.NewRecord(collection)
		if recordIdPattern.MatchString(input.Id) {
			record.Id = input.Id
		}
	}

	answers := make([]leadAnswer, 0, len(input.Answers))
	for _, answer := range input.Answers {
		if len(answers) == 80 {
			break
		}
		value := clean(answer.Value, 1200)
		if value == "" {
			continue
		}
		answers = append(answers, leadAnswer{
			Section: clean(answer.Section, 20),
			Label:   clean(answer.Label, 300),
			Value:   value,
		})
	}

	record.Set("origin", input.Origin)
	record.Set("name", clean(input.Name, 160))
	record.Set("company", clean(input.Company, 160))
	record.Set("email", strings.ToLower(clean(input.Email, 200)))
	record.Set("phone", clean(input.Phone, 40))
	record.Set("city", clean(input.City, 160))
	record.Set("profile", clean(input.Profile, 200))
	record.Set("locale", clean(input.Locale, 16))
	record.Set("answers", answers)
	message := strings.TrimSpace(input.Message)
	if utf8.RuneCountInString(message) > 12000 {
		message = string([]rune(message)[:12000])
	}
	record.Set("message", message)
	if input.WhatsApp && !record.GetBool("whatsapp") {
		record.Set("whatsapp", true)
		record.Set("whatsapp_at", types.NowDateTime())
	}
	if record.IsNew() {
		setAttribution(record, input.identityInput)
	}

	if err := e.App.Save(record); err != nil {
		return e.BadRequestError("Não foi possível salvar o lead.", err)
	}
	return e.JSON(http.StatusOK, map[string]string{"id": record.Id})
}

// handleLeadWhatsApp marca que a pessoa abriu o WhatsApp com a mensagem.
func handleLeadWhatsApp(e *core.RequestEvent) error {
	id := e.Request.PathValue("id")
	if !recordIdPattern.MatchString(id) {
		return e.NoContent(http.StatusNoContent)
	}
	record, err := e.App.FindRecordById("leads", id)
	if err != nil || record.GetBool("whatsapp") {
		return e.NoContent(http.StatusNoContent)
	}
	// Só vale para leads recentes.
	if time.Since(record.GetDateTime("created").Time()) > 24*time.Hour {
		return e.NoContent(http.StatusNoContent)
	}
	record.Set("whatsapp", true)
	record.Set("whatsapp_at", types.NowDateTime())
	if err := e.App.Save(record); err != nil {
		return err
	}
	return e.NoContent(http.StatusNoContent)
}
