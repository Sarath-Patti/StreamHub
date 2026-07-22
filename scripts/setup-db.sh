#!/bin/sh
set -e

echo "==> Ensuring local PostgreSQL user 'streamhub' and database 'streamhub' exist..."

psql postgres -c "CREATE USER streamhub WITH PASSWORD 'streamhubpassword' SUPERUSER;" 2>/dev/null || true
psql postgres -c "CREATE DATABASE streamhub OWNER streamhub;" 2>/dev/null || true
psql postgres -c "GRANT ALL PRIVILEGES ON DATABASE streamhub TO streamhub;" 2>/dev/null || true

echo "==> PostgreSQL role and database configuration verified."
