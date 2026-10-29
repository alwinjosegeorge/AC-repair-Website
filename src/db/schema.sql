-- ====================================================================
-- EGS INDIA HVAC Platform - PostgreSQL Database Schema
-- Database: Neon Serverless PostgreSQL
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. AUTOMATIC UPDATED_AT TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- --------------------------------------------------------------------
-- 3. REGIONAL SERVICE HUBS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS regional_hubs (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    tag VARCHAR(128),
    coverage TEXT NOT NULL,
    is_hq BOOLEAN DEFAULT FALSE,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    phone VARCHAR(32) DEFAULT '+919895688833',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 4. TECHNICIANS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS technicians (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    city VARCHAR(128) NOT NULL,
    rating NUMERIC(3, 2) DEFAULT 4.90,
    experience_years INT DEFAULT 5,
    specialization TEXT[] DEFAULT '{}',
    status VARCHAR(32) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'on_job', 'off_duty')),
    active_jobs_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_technicians_updated_at ON technicians;
CREATE TRIGGER trg_technicians_updated_at
BEFORE UPDATE ON technicians
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- --------------------------------------------------------------------
-- 5. CUSTOMERS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS customers (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    mobile VARCHAR(32) NOT NULL,
    whatsapp VARCHAR(32),
    email VARCHAR(128),
    address TEXT,
    pin VARCHAR(16),
    location VARCHAR(128),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    previous_services TEXT[] DEFAULT '{}',
    ac_type VARCHAR(64),
    number_of_units VARCHAR(32) DEFAULT '1',
    amc_status VARCHAR(32) DEFAULT 'None' CHECK (amc_status IN ('Active', 'Expiring Soon', 'Expired', 'None')),
    amc_plan VARCHAR(128),
    total_spend NUMERIC(10, 2) DEFAULT 0.00,
    last_booking_date VARCHAR(64),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customers_mobile ON customers(mobile);
CREATE INDEX IF NOT EXISTS idx_customers_amc_status ON customers(amc_status);

DROP TRIGGER IF EXISTS trg_customers_updated_at ON customers;
CREATE TRIGGER trg_customers_updated_at
BEFORE UPDATE ON customers
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- --------------------------------------------------------------------
-- 6. SERVICE BOOKINGS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bookings (
    id VARCHAR(64) PRIMARY KEY,
    status VARCHAR(32) NOT NULL DEFAULT 'NEW' CHECK (
        status IN (
            'NEW',
            'CONTACTED',
            'CONFIRMED',
            'ASSIGNED',
            'TECHNICIAN ON THE WAY',
            'SERVICE STARTED',
            'COMPLETED',
            'PAYMENT RECEIVED',
            'CANCELLED'
        )
    ),
    service_category VARCHAR(64) NOT NULL,
    service_name VARCHAR(128) NOT NULL,
    sub_service VARCHAR(255),
    ac_type VARCHAR(64) NOT NULL,
    ac_brand VARCHAR(64),
    unit_count VARCHAR(32) NOT NULL DEFAULT '1',
    issue_description TEXT,
    preferred_date VARCHAR(64),
    preferred_slot VARCHAR(128),
    customer_name VARCHAR(128) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    whatsapp_number VARCHAR(32),
    alternate_phone VARCHAR(32),
    email VARCHAR(128),
    house_building VARCHAR(255),
    area VARCHAR(255),
    address TEXT NOT NULL,
    landmark VARCHAR(255),
    city VARCHAR(128) NOT NULL,
    pincode VARCHAR(16),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    special_notes TEXT,
    estimated_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    assigned_technician_id VARCHAR(64) REFERENCES technicians(id) ON DELETE SET NULL,
    assigned_technician_name VARCHAR(128),
    attribution JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_phone ON bookings(phone);
CREATE INDEX IF NOT EXISTS idx_bookings_city ON bookings(city);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);

DROP TRIGGER IF EXISTS trg_bookings_updated_at ON bookings;
CREATE TRIGGER trg_bookings_updated_at
BEFORE UPDATE ON bookings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- --------------------------------------------------------------------
-- 7. AMC CONTRACTS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS amc_contracts (
    id VARCHAR(64) PRIMARY KEY,
    contract_no VARCHAR(64) UNIQUE NOT NULL,
    amc_start_date DATE NOT NULL,
    amc_end_date DATE NOT NULL,
    customer_id VARCHAR(64) REFERENCES customers(id) ON DELETE SET NULL,
    customer_name VARCHAR(128) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    whatsapp VARCHAR(32),
    email VARCHAR(128),
    city VARCHAR(128) NOT NULL,
    address TEXT,
    number_of_units INT NOT NULL DEFAULT 1,
    service_frequency VARCHAR(64) NOT NULL DEFAULT 'Quarterly (4 Services/Year)',
    last_service_date DATE,
    last_service_details TEXT,
    last_service_technician VARCHAR(128),
    next_service_date DATE,
    next_service_slot VARCHAR(128),
    next_service_status VARCHAR(32) DEFAULT 'scheduled' CHECK (
        next_service_status IN ('scheduled', 'technician_dispatched', 'completed')
    ),
    plan_name VARCHAR(128) NOT NULL DEFAULT 'Residential Saver',
    services_included INT NOT NULL DEFAULT 4,
    services_completed INT NOT NULL DEFAULT 0,
    status VARCHAR(32) NOT NULL DEFAULT 'active' CHECK (
        status IN ('active', 'expiring_soon', 'expired', 'renewed')
    ),
    amount NUMERIC(10, 2) NOT NULL DEFAULT 1500.00,
    renewal_discount_percent INT DEFAULT 10,
    last_renewed_date DATE,
    renewal_history JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_amc_contract_no ON amc_contracts(contract_no);
CREATE INDEX IF NOT EXISTS idx_amc_status ON amc_contracts(status);
CREATE INDEX IF NOT EXISTS idx_amc_expiry ON amc_contracts(amc_end_date);

DROP TRIGGER IF EXISTS trg_amc_contracts_updated_at ON amc_contracts;
CREATE TRIGGER trg_amc_contracts_updated_at
BEFORE UPDATE ON amc_contracts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- --------------------------------------------------------------------
-- 8. PAYMENT TRANSACTIONS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payment_transactions (
    id VARCHAR(64) PRIMARY KEY,
    invoice_no VARCHAR(64) NOT NULL,
    booking_id VARCHAR(64) REFERENCES bookings(id) ON DELETE SET NULL,
    amc_contract_no VARCHAR(64),
    customer_name VARCHAR(128) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    whatsapp VARCHAR(32),
    amount NUMERIC(10, 2) NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    tax_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    payment_method VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'PAID' CHECK (status IN ('PAID', 'PENDING', 'REFUNDED')),
    transaction_ref VARCHAR(128),
    technician_id VARCHAR(64) REFERENCES technicians(id) ON DELETE SET NULL,
    technician_name VARCHAR(128),
    service_name VARCHAR(128) NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    paid_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payment_transactions(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_payments_invoice ON payment_transactions(invoice_no);

-- --------------------------------------------------------------------
-- 9. GST INVOICES
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS invoices (
    invoice_no VARCHAR(64) PRIMARY KEY,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE,
    booking_id VARCHAR(64) REFERENCES bookings(id) ON DELETE SET NULL,
    amc_contract_no VARCHAR(64),
    customer_name VARCHAR(128) NOT NULL,
    customer_phone VARCHAR(32) NOT NULL,
    customer_email VARCHAR(128),
    customer_address TEXT NOT NULL,
    customer_city VARCHAR(128) NOT NULL,
    customer_gstin VARCHAR(32),
    ac_type VARCHAR(64),
    technician_name VARCHAR(128),
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    cgst NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    sgst NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    tax_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    grand_total NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    payment_method VARCHAR(64) NOT NULL,
    payment_status VARCHAR(32) NOT NULL DEFAULT 'PAID' CHECK (payment_status IN ('PAID', 'PENDING', 'REFUNDED')),
    transaction_ref VARCHAR(128),
    warranty_period_days INT DEFAULT 30,
    warranty_valid_until DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invoices_date ON invoices(date DESC);
CREATE INDEX IF NOT EXISTS idx_invoices_booking_id ON invoices(booking_id);

-- --------------------------------------------------------------------
-- 10. CONTACT FORM INQUIRIES
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contact_inquiries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    email VARCHAR(128),
    phone VARCHAR(32),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'CONTACTED', 'RESOLVED')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 11. AUDIT & CRM ACTIVITY LOGS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    action VARCHAR(128) NOT NULL,
    entity_type VARCHAR(64) NOT NULL,
    entity_id VARCHAR(64) NOT NULL,
    actor VARCHAR(128) DEFAULT 'System',
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_logs(entity_type, entity_id);

-- --------------------------------------------------------------------
-- 12. HELPER VIEWS FOR CONTROL HUB CRM
-- --------------------------------------------------------------------
CREATE OR REPLACE VIEW v_dashboard_kpis AS
SELECT
    (SELECT COUNT(*) FROM bookings) AS total_bookings,
    (SELECT COUNT(*) FROM bookings WHERE status IN ('NEW', 'CONTACTED', 'CONFIRMED', 'ASSIGNED', 'TECHNICIAN ON THE WAY', 'SERVICE STARTED')) AS active_jobs,
    (SELECT COALESCE(SUM(amount), 0) FROM payment_transactions WHERE status = 'PAID') AS total_revenue,
    (SELECT COUNT(*) FROM amc_contracts WHERE status = 'active') AS active_amc_contracts,
    (SELECT COUNT(*) FROM technicians WHERE status = 'available') AS available_technicians;

CREATE OR REPLACE VIEW v_city_performance AS
SELECT 
    city,
    COUNT(*) AS total_bookings,
    COUNT(*) FILTER (WHERE status = 'COMPLETED') AS completed_bookings,
    COALESCE(SUM(estimated_amount), 0) AS total_value
FROM bookings
GROUP BY city
ORDER BY total_bookings DESC;
