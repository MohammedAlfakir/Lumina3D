-- CreateTable
CREATE TABLE "Tenant" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenantId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "basePrice" DECIMAL(10,2) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModelAsset" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "productId" UUID NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSizeMb" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ModelAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConfigurableNode" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "productId" UUID NOT NULL,
    "meshName" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ConfigurableNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaterialOption" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nodeId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "colorHex" TEXT,
    "textureUrl" TEXT,
    "priceModifier" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "MaterialOption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_domain_key" ON "Tenant"("domain");

-- CreateIndex
CREATE INDEX "Tenant_domain_idx" ON "Tenant"("domain");

-- CreateIndex
CREATE INDEX "Product_tenantId_idx" ON "Product"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "ModelAsset_productId_key" ON "ModelAsset"("productId");

-- CreateIndex
CREATE INDEX "ConfigurableNode_productId_idx" ON "ConfigurableNode"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "ConfigurableNode_productId_meshName_key" ON "ConfigurableNode"("productId", "meshName");

-- CreateIndex
CREATE INDEX "MaterialOption_nodeId_idx" ON "MaterialOption"("nodeId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModelAsset" ADD CONSTRAINT "ModelAsset_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfigurableNode" ADD CONSTRAINT "ConfigurableNode_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialOption" ADD CONSTRAINT "MaterialOption_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "ConfigurableNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
