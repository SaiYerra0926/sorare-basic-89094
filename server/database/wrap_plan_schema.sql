-- WRAP Plan Form Database Schema
-- Database: Worx
-- Run this script to create all required tables for WRAP Plan forms

-- Main WRAP Plan table
CREATE TABLE IF NOT EXISTS wrap_plans (
    id SERIAL PRIMARY KEY,
    daily_maintenance_plan TEXT,
    triggers_action_plan TEXT,
    early_warning_signs_action_plan TEXT,
    breaking_down_action_plan TEXT,
    crisis_plan TEXT,
    post_crisis_plan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_wrap_plans_created_at ON wrap_plans(created_at);

