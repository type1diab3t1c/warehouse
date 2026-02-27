# Warehouse Project - Session Notes

## What Was Built
Created a static rental listing website for a warehouse property at 22 A Street, Edgartown, Martha's Vineyard.

## Key Decisions
- **Multi-page layout**: Started as single-page, user requested splitting into separate pages for each area
- **Dark industrial theme**: CSS custom properties with gold accent (#d4a04a), Space Grotesk + Inter fonts
- **No build tools**: Pure HTML/CSS/JS, no frameworks
- **Spec cards made clickable**: User noticed hover-only tiles had no click action — wrapped in `<a>` tags linking to relevant pages/sections

## Docker Setup
- Image: `matthieujbraga/warehouse-22a:latest` on Docker Hub
- Docker context is **remote** (`ssh://matthieu@arrakis`) — login and builds happen on arrakis
- Username is `matthieujbraga` (with a **j**) — user initially said `matthieubraga` without the j, but the active login was `matthieujbraga`
- Dockerfile uses JSON array COPY syntax for the photos directory because the path contains spaces: `COPY ["pics/iCloud Photos from David Braga/", "/usr/share/nginx/html/images/"]`

## Kubernetes Deployment
- Manifests in `../k8s/warehouse-22a/` (namespace, deployment, service, ingress, issuer, tsig-secret)
- Follows existing cluster conventions found in `../k8s/` (one namespace per app, `nginx-ext` ingress class, `prd-dns-issuer` with TSIG/RFC2136)
- All resources applied successfully — pod running, service and ingress up
- **TLS certificate is PENDING**: DNS-01 challenge fails with SERVFAIL — the BIND server at 192.168.224.100 likely doesn't have a zone for `bragarealtyservices.com`. This needs to be resolved for HTTPS to work.
- Ingress external IP: `192.168.223.194` (MetalLB)

## Open Items
- [ ] Fix DNS for `bragarealtyservices.com` on BIND server (192.168.224.100) so cert-manager DNS-01 challenge can complete
- [ ] Verify TLS certificate issues after DNS fix
- [ ] Set up public DNS A record for `bragarealtyservices.com` pointing to the external IP or edge router

## Cluster Conventions Reference
- Namespaces: one per app
- Ingress naming: `{app}-ingress`
- Service naming: matches app name
- TLS secrets: `{app}-tls`
- Labels: `app: {appname}`
- Cert issuers: namespace-scoped `prd-dns-issuer` with TSIG to BIND at 192.168.224.100
- TSIG key: same across all namespaces (stored in `rndc-key-secret`)
