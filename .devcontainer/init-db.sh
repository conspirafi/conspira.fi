#!/bin/bash
set -e

# This script runs when the PostgreSQL container is first created
echo "Initializing database..."

# The database is already created via POSTGRES_DB env var
# This script can be used for additional initialization if needed
echo "Database initialization complete"



