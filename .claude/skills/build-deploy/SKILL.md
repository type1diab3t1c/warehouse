---
name: build-deploy
description: Build the Docker image and deploy the warehouse website to Kubernetes. This skill should be used when the user asks to "build and deploy", "deploy the site", "push to production", "rebuild the image", "redeploy", or mentions deploying the warehouse website.
user-invocable: true
---

# Build & Deploy — 22A Street Warehouse Site

Build the Docker image on the remote Docker host (arrakis), push to Docker Hub, and roll out the updated deployment on Kubernetes.

## Prerequisites

- Docker context `arrakis` must be the active context (it already is — do NOT pass `--context`)
- Docker Hub login must be active on arrakis
- kubectl must have access to the cluster with the `warehouse-22a` namespace

## Build & Deploy Steps

### 1. Build the Docker Image

Build from the project root (`/home/matthieu/github/warehouse/`):

```bash
docker build -t matthieujbraga/warehouse-22a:latest .
```

**Important notes:**
- The Dockerfile uses JSON array COPY syntax for the photos directory because the path contains spaces: `COPY ["pics/iCloud Photos from David Braga/", "/usr/share/nginx/html/images/"]`
- The Docker context is already set to `arrakis` (ssh://matthieu@arrakis) — never specify `--context`
- The build runs remotely on arrakis, not locally

### 2. Push to Docker Hub

```bash
docker push matthieujbraga/warehouse-22a:latest
```

Note the Docker Hub username is `matthieujbraga` (with a **j**).

### 3. Roll Out the Deployment

Restart the Kubernetes deployment to pull the updated image:

```bash
kubectl rollout restart deployment/warehouse-22a -n warehouse-22a
```

### 4. Verify Deployment

Wait for the rollout to complete and confirm pods are healthy:

```bash
kubectl rollout status deployment/warehouse-22a -n warehouse-22a
kubectl get pods -n warehouse-22a
```

If pods are not starting, check logs:

```bash
kubectl logs -n warehouse-22a -l app=warehouse-22a --tail=20
```

## Kubernetes Manifests

Manifests live in `k8s/` within this repo. If the namespace or manifests need to be applied (first-time setup or changes), apply in this order:

1. `kubectl apply -f k8s/namespace.yaml`
2. `kubectl apply -f k8s/tsig-secret.yaml` (gitignored — must exist on disk)
3. `kubectl apply -f k8s/prd-dns-issuer.yaml`
4. `kubectl apply -f k8s/deployment.yaml`
5. `kubectl apply -f k8s/service.yaml`
6. `kubectl apply -f k8s/ingress.yaml`

## Quick Reference

| Item | Value |
|------|-------|
| Docker image | `matthieujbraga/warehouse-22a:latest` |
| Docker context | `arrakis` (active — do not specify) |
| K8s namespace | `warehouse-22a` |
| K8s deployment | `warehouse-22a` |
| Ingress class | `nginx-ext` |
| Ingress host | `bragarealtyservices.com` |
| TLS | cert-manager, DNS-01 via TSIG/RFC2136 |
