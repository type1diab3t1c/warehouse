# Warehouse - 22 A Street Property Website

## Project Overview
Static website for a warehouse rental property at 22 A Street, Edgartown, Martha's Vineyard. Served via nginx in a Docker container, deployed to Kubernetes.

## Architecture
- **Pure static site**: HTML, CSS, vanilla JS — no frameworks or build step
- **Multi-page layout**: Landing page (`index.html`) + 6 dedicated area subpages
- **Containerized**: nginx:alpine Docker image serving static files
- **Deployed**: Kubernetes cluster with external nginx ingress, TLS via cert-manager

## Directory Structure
```
warehouse/
├── site/                  # Website source files
│   ├── index.html         # Landing page (hero, overview, area cards, map, contact)
│   ├── semi-bay-1.html    # Semi-trailer loading bay 1
│   ├── semi-bay-2.html    # Semi-trailer loading bay 2
│   ├── drive-in.html      # Drive-in loading bay
│   ├── office-1.html      # Office 1 - ground floor
│   ├── office-2.html      # Office 2 - upstairs with kitchen
│   ├── office-3.html      # Office 3 - upstairs with bay overlook
│   ├── style.css          # All styling (dark theme, responsive, lightbox)
│   └── script.js          # Lightbox, nav toggle, scroll animations
├── pics/                  # Property photos (51 JPEGs)
│   └── iCloud Photos from David Braga/
├── docs/                  # Source listing document
│   └── listing.docx
├── nginx.conf             # Nginx config (gzip, caching, server_name)
├── Dockerfile             # nginx:alpine, copies site + photos
└── docker-compose.yml     # Local development/testing
```

## Docker
```bash
# Build and run locally (serves on port 80)
docker compose up --build -d

# Image is published to Docker Hub
docker tag warehouse-web matthieujbraga/warehouse-22a:latest
docker push matthieujbraga/warehouse-22a:latest
```

## Kubernetes
Manifests live in `../k8s/warehouse-22a/` and follow the cluster conventions:
- **Namespace**: `warehouse-22a`
- **Image**: `matthieujbraga/warehouse-22a:latest`
- **Ingress**: `nginx-ext` class, host `22a.bragarealtyservices.com`
- **TLS**: cert-manager with DNS-01 validation (prd-dns-issuer, TSIG/RFC2136)

```bash
# Apply all manifests
kubectl apply -f ../k8s/warehouse-22a/namespace.yaml
kubectl apply -f ../k8s/warehouse-22a/tsig-secret.yaml
kubectl apply -f ../k8s/warehouse-22a/prd-dns-issuer.yaml
kubectl apply -f ../k8s/warehouse-22a/deployment.yaml
kubectl apply -f ../k8s/warehouse-22a/service.yaml
kubectl apply -f ../k8s/warehouse-22a/ingress.yaml
```

## Photo-to-Page Mapping
| Page | Photo prefixes |
|------|---------------|
| Landing / overview | all_three_loading_bays, north_side*, south_side*, semi_parking*, electrical*, radiant_heat* |
| semi-bay-1.html | semi_bay_1*, semi_loading_bay_1 |
| semi-bay-2.html | semi_bay_2*, semi_loading_bay_2 |
| drive-in.html | drive_in_bay* |
| office-1.html | office_1*, office_entry* |
| office-2.html | office_upstairs_2* |
| office-3.html | office_upstairs_3* |

## Contact (on-site)
- **Agent**: David Braga
- **Email**: david.jr@bragarealtyservices.com
- **Phone**: (619) 878-4144

## Notes
- Photos are copied into `/usr/share/nginx/html/images/` at build time
- The Docker context is remote (`ssh://matthieu@arrakis`) — `docker login` must be done on arrakis
- The TLS certificate requires `bragarealtyservices.com` to be resolvable via the BIND server at 192.168.224.100 with TSIG key auth
