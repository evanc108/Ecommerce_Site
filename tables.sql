CREATE TABLE "products" (
	"id"	INTEGER,
	"url"	TEXT,
	"name"	TEXT,
	"sub_title"	TEXT,
	"brand"	TEXT,
	"model"	INTEGER,
	"color"	TEXT,
	"price"	REAL,
	"currency"	TEXT,
	"availability"	INTEGER,
	"description"	TEXT,
	"raw_description"	TEXT,
	"avg_rating"	TEXT,
	"review_count"	TEXT,
	"images"	TEXT,
	"available_sizes"	TEXT,
	"uniq_id"	TEXT,
	"scraped_at"	TEXT,
	PRIMARY KEY("id")
);

CREATE TABLE "users" (
	"username"	TEXT,
	"email"	TEXT,
	"password"	TEXT,
	PRIMARY KEY("username")
);

CREATE TABLE "history" (
	"id"	INTEGER,
	"user"	TEXT,
	"price"	REAL,
	"product_id"	INTEGER,
	"product_name"	TEXT,
	"size"	TEXT,
	"confirmation_code"	TEXT UNIQUE,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("product_name") REFERENCES "products"("name"),
	FOREIGN KEY("user") REFERENCES "users"("username")
);

CREATE TABLE "comments" (
	"id"	INTEGER,
	"username"	TEXT,
	"comment"	TEXT,
	"rating"	INTEGER,
	"product_id"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("username") REFERENCES "users"("username"),
	FOREIGN KEY("product_id") REFERENCES "products"("id")
);