# syntax=docker/dockerfile:1

FROM golang:1.27-alpine AS builder
WORKDIR /src
COPY go.mod go.sum ./
RUN --mount=type=cache,id=atcchinabrasil-main-go-mod,target=/go/pkg/mod \
    go mod download
COPY . .
# SQLite em Go puro (modernc): binário estático, sem CGO.
RUN --mount=type=cache,id=atcchinabrasil-main-go-mod,target=/go/pkg/mod \
    --mount=type=cache,id=atcchinabrasil-main-go-build,target=/root/.cache/go-build \
    CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o /out/atc-backend .

FROM alpine:3.22
RUN apk add --no-cache ca-certificates \
    && addgroup -S pocketbase && adduser -S -G pocketbase pocketbase \
    && mkdir -p /pb/pb_data && chown -R pocketbase:pocketbase /pb
WORKDIR /pb
COPY --from=builder /out/atc-backend /pb/atc-backend
USER pocketbase

# Dados (SQLite, configurações) ficam no volume montado em /pb/pb_data.
VOLUME /pb/pb_data

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD ["wget", "-q", "-O", "/dev/null", "http://127.0.0.1:8090/api/health"]

CMD ["/pb/atc-backend", "serve", "--http=0.0.0.0:8090", "--dir=/pb/pb_data"]
