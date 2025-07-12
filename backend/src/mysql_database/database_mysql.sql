    use rr_food_corner;
	CREATE TABLE users (
		id INT AUTO_INCREMENT PRIMARY KEY,
		name VARCHAR(255),
		email VARCHAR(255) UNIQUE,
		mobile VARCHAR(20) UNIQUE,
		password_hash TEXT,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        role varchar(225),
        blocked BOOLEAN DEFAULT FALSE
		);
		select * from users; 

	CREATE TABLE otp_verifications (
		id INT AUTO_INCREMENT PRIMARY KEY,
		user_id INT,
		otp_code VARCHAR(10),
		expires_at DATETIME,
		verified BOOLEAN DEFAULT FALSE,
		FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
		);
		select * from otp_verifications;
    
    CREATE TABLE role_permissions (
		id INT AUTO_INCREMENT PRIMARY KEY,
        role VARCHAR(255), 
        page_key VARCHAR(255),
        can_view BOOLEAN DEFAULT FALSE,
        can_create BOOLEAN DEFAULT FALSE,
        can_edit BOOLEAN DEFAULT FALSE,
        can_delete BOOLEAN DEFAULT FALSE
		);
		select * from role_permissions;
	CREATE TABLE addresses (
		id INT AUTO_INCREMENT PRIMARY KEY,
	    user_id INT,
	    house_block_no VARCHAR(255),
	    area_road VARCHAR(255),
	    city VARCHAR(100),
	    district VARCHAR(100),
	    state VARCHAR(100),
	    country VARCHAR(100),
	    pincode VARCHAR(20),
	    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
		);
		select * from addresses;

	CREATE TABLE categories (
		id INT AUTO_INCREMENT PRIMARY KEY,
		name VARCHAR(100) UNIQUE NOT NULL,
		catimage_url VARCHAR(225)
		);
		SELECT * from categories;	

	CREATE TABLE food_items (
		id INT AUTO_INCREMENT PRIMARY KEY,
		item_code VARCHAR(20) UNIQUE NOT NULL,
		name VARCHAR(100) NOT NULL,
		category_id INT NOT NULL,
		food_type VARCHAR(50),
		combo_type VARCHAR(50),
		price DECIMAL(10, 2),
		subcontent VARCHAR(255),
		image_url VARCHAR(255),
		FOREIGN KEY (category_id) REFERENCES categories(id)
		);
		select * from food_items; 

        CREATE TABLE keywords (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);
        
        CREATE TABLE whats_new_items (
	id INT AUTO_INCREMENT PRIMARY KEY,
	category_id INT NOT NULL UNIQUE,
	food_item_id INT NOT NULL,
	FOREIGN KEY (category_id) REFERENCES categories(id),
	FOREIGN KEY (food_item_id) REFERENCES food_items(id)
);
select * from whats_new_items;	

    CREATE TABLE settings (
        id INT PRIMARY KEY,
        delivery_charge DECIMAL(10,2) NOT NULL,
        taxes DECIMAL(10,2) NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
		);
		select * from settings;

	CREATE TABLE order_status (
		id INT AUTO_INCREMENT PRIMARY KEY,
		user_id INT,
		items JSON,
		subtotal DECIMAL(10,2),
		discount DECIMAL(10,2),
		delivery_charge DECIMAL(10,2),
		taxes DECIMAL(10,2),
        total DECIMAL(10,2),
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) DEFAULT 'pending',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        address_id INT NULL
		);
		select * from order_status;


    CREATE TABLE deliveries (
		id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT,
        delivery_person_id INT,
		status VARCHAR(50),
		assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		delivered_at TIMESTAMP,
		FOREIGN KEY (order_id) REFERENCES order_status(id) ON DELETE CASCADE,
		FOREIGN KEY (delivery_person_id) REFERENCES users(id) ON DELETE SET NULL
		);
		select * from deliveries;
		
	CREATE TABLE coupons (
		id INT AUTO_INCREMENT PRIMARY KEY,
		code VARCHAR(50) NOT NULL UNIQUE,
		description TEXT,
		discount_type ENUM('flat', 'percent') NOT NULL,
		discount_value DECIMAL(10, 2) NOT NULL,
		min_order_value DECIMAL(10, 2) DEFAULT 0,
		max_discount DECIMAL(10, 2),
		expires_at DATETIME,
		is_active BOOLEAN DEFAULT true,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
		);
		select * from coupons;

CREATE TABLE feedback (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  name VARCHAR(100),
  rating INT CHECK (rating BETWEEN 1 AND 5),
  comments TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

select * from feedback;


