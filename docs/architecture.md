# Architecture Decisions

## Why a modular monolith

This project is intentionally built as a modular monolith. The domain is small enough that microservices would add networking, deployment, and observability complexity without improving clarity. A modular monolith keeps the development model simple while still making boundaries, ownership, and future extraction points explicit.

## Why package-by-domain with controller/service/repository inside

The top-level package layout mirrors the business capabilities of the system: authentication, projects, experience, media, contact, and site settings. Inside each module, the code uses familiar Spring layering so that the structure remains easy to explain to Java interviewers while preserving domain cohesion.

## Why services are concrete classes

Most application services in this project have a single implementation. Creating `Service` and `ServiceImpl` pairs for each use-case would add boilerplate without improving substitutability or testability. Instead, services are concrete classes and true variation points are modeled explicitly as ports such as storage or mail.

## Why ports exist only at external boundaries

Ports are introduced only where the application depends on systems outside the core domain, such as object storage or outbound messaging. This keeps the code honest: abstractions exist because there is a boundary, not because the framework encourages ceremony.
