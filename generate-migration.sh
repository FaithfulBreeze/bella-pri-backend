#!/bin/bash
read -p "Enter migration name: " MIGRATION_NAME
npx ts-node node_modules/.bin/typeorm migration:generate ./migrations/$MIGRATION_NAME -d typeorm.config.ts
