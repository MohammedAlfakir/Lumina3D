Project Brief: 3D E-Commerce Configurator SaaS

1. The Vision
   We are building a multi-tenant "Configurator-as-a-Service." Our platform allows e-commerce store owners (Tenants) to upload 3D models (.glb files) of their products and define customizable parts. Their customers (End-Users) will interact with a highly optimized, real-time WebGL canvas to configure materials, colors, and add-ons before checkout.

This requires strict data isolation, high-performance rendering, and a seamless asset pipeline.

2. The Tech Stack & Tooling
   We are keeping the stack modern, strictly typed, and optimized for 3D web delivery.

Framework: Next.js (App Router) for both the admin dashboard and the API endpoints.

Language: TypeScript across the entire stack to share types between the database, API, and 3D canvas.

Database: PostgreSQL for relational data integrity.

ORM: Prisma for type-safe database queries and schema management.

Auth & Storage: Supabase. We will use it to handle tenant authentication and serve as our bucket for storing heavy 3D assets and textures.

3D Engine: React Three Fiber (R3F) and Three.js for declarative 3D rendering, state-driven meshes, and WebGL optimization.

Styling: Tailwind CSS combined with Shadcn UI for rapid, accessible dashboard development.

State Management (3D): Zustand. We will avoid React Context for the 3D canvas to prevent unnecessary re-renders that drop frame rates.

Infrastructure: Docker to containerize the application for consistent deployment.

3. Database Architecture (PostgreSQL + Prisma)
   Our relational model needs to support multiple stores and complex product variations. Here is the conceptual blueprint for our Prisma schema:

Core Entities
Tenant (The Store Owner)

id (UUID), companyName, domain, createdAt

Relations: Has many Products.

Product (The Item)

id (UUID), tenantId, name, basePrice, description

Relations: Belongs to one Tenant, Has one ModelAsset, Has many ConfigurableNodes.

ModelAsset (The 3D File)

id (UUID), productId, fileUrl (Supabase bucket link), fileSize, format (always GLB).

ConfigurableNode (The Customization Zones)

id (UUID), productId, meshName (must exactly match the node name inside the GLB file, e.g., "Seat_Cushion"), displayName (e.g., "Cushion Fabric").

Relations: Has many MaterialOptions.

MaterialOption (The Choices)

id (UUID), nodeId, name (e.g., "Red Leather"), colorHex (for basic materials), textureUrl (for complex materials), priceModifier (e.g., +$50.00).

4. The 3D Asset Pipeline
   Handling 3D files dynamically is the biggest technical hurdle. Here is our pipeline:

Upload: Tenant uploads a standard .glb file via the Next.js dashboard.

Storage: The file is pushed directly to a Supabase storage bucket.

Parsing: We will use gltfjsx conceptually. The Next.js frontend fetches the .glb, parses the scene graph, and maps the database ConfigurableNodes to the physical meshes in the file.

Rendering: R3F handles the display. When a user selects a MaterialOption, Zustand updates the state, and the specific mesh dynamically swaps its material-color or material-map (texture) without reloading the scene.

5. Phase 1 Execution Plan (Where We Start)
   To get this off the ground without getting overwhelmed, we need to hit these milestones first:

Repo Setup: Initialize Next.js, configure Tailwind/Shadcn, and set up Docker.

Database Provisioning: Write the initial schema.prisma based on the entities above and push it to a development PostgreSQL database.

Storage Auth: Connect Supabase and verify we can upload and retrieve a .glb file programmatically.

Canvas Proof of Concept: Hardcode a GLB URL into an R3F canvas and successfully change the color of one specific mesh via a UI button.
