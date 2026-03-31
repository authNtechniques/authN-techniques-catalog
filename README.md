[![Website](https://img.shields.io/website?url=https%3A%2F%2Fswc-public.pages.rwth-aachen.de%2Fsecurity-patterns%2Fauthentication-methods-catalog%3Fdown_message%3Doffline%26up_message%3Donline)](https://swc-public.pages.rwth-aachen.de/security-patterns/authentication-methods-catalog/)
[![Contributions welcome](https://img.shields.io/badge/contributions-welcome-orange.svg)](https://git.rwth-aachen.de/swc-public/security-patterns/authentication-methods-catalog/-/blob/main/CONTRIBUTING.md)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

# Authentication Techniques

This repository serves as a knowledge base for authentication techniques, available at [https://swc-public.pages.rwth-aachen.de/security-patterns/authentication-methods-catalog/](https://swc-public.pages.rwth-aachen.de/security-patterns/authentication-methods-catalog/).

The catalog is based on the ontology and classification framework introduced in [A FACETED CLASSIFICATION OF AUTHENTICATOR-CENTRIC AUTHENTICATION TECHNIQUES](#TODO).
The web application was first developed by Bogner et al. and is now adapted to provide information on authentication techniques. It is directly based on the [Enterprise Architecture Refactoring repository](https://git.rwth-aachen.de/swc-public/ea-refactoring-solutions/web-catalog).

**Goals of this repository:**
- Collect and browse authentication techniques in a structured and uniform way (JSON format)
- Give researchers and practitioners an easy way to access the collection and contribute new entries
- Version the results over time

## Catalog Structure

The catalog is organized into two types of entries:

- **Techniques** — descriptions of authentication techniques (stored in `./authentication-techniques/`)
- **Authenticators** — concrete authenticator classes used by techniques (stored in `./authenticators/`)

Each entry consists of a populated JSON file and a Checklist file that justifies its inclusion in the catalog. See [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to add new entries.

## Contributing

Contributions through merge requests are welcome. Feel free to add new techniques, authenticators, or improve existing entries. Please refer to [CONTRIBUTING.md](CONTRIBUTING.md) for the full contribution process.

## Building the Web Application

This web application is built using Node 22. It is recommended to use Docker.

**Build for production:**
```bash
docker run --rm -v $PWD:/app -it node:22 bash -c "cd /app && npm install && npm ci && npm run build"
```

This produces a `dist` folder containing the built web application.

**Run a local development server:**
```bash
docker run --rm -v $PWD:/app -p 8080:8080 -it node:22 bash -c "cd /app && npm install && npm ci && npm run serve"
```

This starts a local development server at `http://localhost:8080`.

**Without Docker**, you can run the following commands directly after cloning the repository:

```bash
npm install       # Install dependencies
npm run serve     # Start development server with hot-reload
npm run build     # Compile and minify for production
npm run lint      # Run static code analysis
serve -s dist     # Preview the built dist directory locally
```
