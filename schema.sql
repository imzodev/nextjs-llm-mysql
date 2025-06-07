-- Store Table
CREATE TABLE Store (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  userId VARCHAR(255) NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Category Table
CREATE TABLE Category (
  id CHAR(36) PRIMARY KEY,
  storeId CHAR(36),
  name VARCHAR(255) NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (storeId) REFERENCES Store(id),
  INDEX idx_storeId (storeId)
);

-- Size Table
CREATE TABLE Size (
  id CHAR(36) PRIMARY KEY,
  storeId CHAR(36),
  name VARCHAR(255) NOT NULL,
  value VARCHAR(255) NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (storeId) REFERENCES Store(id),
  INDEX idx_storeId (storeId)
);

-- Color Table
CREATE TABLE Color (
  id CHAR(36) PRIMARY KEY,
  storeId CHAR(36),
  name VARCHAR(255) NOT NULL,
  value VARCHAR(255) NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (storeId) REFERENCES Store(id),
  INDEX idx_storeId (storeId)
);

-- Product Table
CREATE TABLE Product (
  id CHAR(36) PRIMARY KEY,
  storeId CHAR(36),
  categoryId CHAR(36),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255),
  sku VARCHAR(50),
  barcode VARCHAR(20),
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  comparePrice DECIMAL(10,2),
  cost DECIMAL(10,2),
  stock INT DEFAULT 0,
  weight DECIMAL(10,2),
  material VARCHAR(255),
  countryOfOrigin CHAR(2),
  isFeatured BOOLEAN DEFAULT FALSE,
  isArchived BOOLEAN DEFAULT FALSE,
  freeShipping BOOLEAN DEFAULT FALSE,
  isConfigurable BOOLEAN DEFAULT FALSE, -- Nuevo
  taxClass ENUM('standard', 'reduced', 'exempt') DEFAULT 'standard',
  status ENUM('draft', 'published', 'out_of_stock') DEFAULT 'draft',
  publishedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  expiresAt DATETIME,
  sizeId CHAR(36),
  colorId CHAR(36),
  supplierId CHAR(36),
  views INT DEFAULT 0,
  sales INT DEFAULT 0,
  videoUrl VARCHAR(512), -- Nuevo
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (storeId) REFERENCES Store(id),
  FOREIGN KEY (categoryId) REFERENCES Category(id),
  FOREIGN KEY (sizeId) REFERENCES Size(id),
  FOREIGN KEY (colorId) REFERENCES Color(id),
  FOREIGN KEY (supplierId) REFERENCES Supplier(id),

  INDEX idx_storeId (storeId),
  INDEX idx_categoryId (categoryId),
  INDEX idx_sizeId (sizeId),
  INDEX idx_colorId (colorId),
  INDEX idx_slug (slug),
  INDEX idx_sku (sku),
  INDEX idx_status (status),
  INDEX idx_barcode (barcode),
  INDEX idx_supplierId (supplierId),
  INDEX idx_expiresAt (expiresAt),
  INDEX idx_countryOfOrigin (countryOfOrigin),
  INDEX idx_videoUrl (videoUrl),
  INDEX idx_isConfigurable (isConfigurable)
);

-- Supplier Table
CREATE TABLE Supplier (
  id CHAR(36) PRIMARY KEY,
  storeId CHAR(36),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address VARCHAR(255),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (storeId) REFERENCES Store(id),
  INDEX idx_storeId (storeId)
);


-- Image Table
CREATE TABLE Image (
  id CHAR(36) PRIMARY KEY,
  productId CHAR(36),
  url TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (productId) REFERENCES Product(id) ON DELETE CASCADE,
  INDEX idx_productId (productId)
);

-- Order Table
CREATE TABLE `Order` (
  id CHAR(36) PRIMARY KEY,
  storeId CHAR(36),
  isPaid BOOLEAN DEFAULT FALSE,
  phone VARCHAR(20) DEFAULT '',
  address VARCHAR(255) DEFAULT '',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (storeId) REFERENCES Store(id),
  INDEX idx_storeId (storeId)
);

-- OrderItem Table
CREATE TABLE OrderItem (
  id CHAR(36) PRIMARY KEY,
  orderId CHAR(36),
  productId CHAR(36),
  FOREIGN KEY (orderId) REFERENCES `Order`(id),
  FOREIGN KEY (productId) REFERENCES Product(id),
  INDEX idx_orderId (orderId),
  INDEX idx_productId (productId)
);