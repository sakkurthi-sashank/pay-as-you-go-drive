-- Create the 'roles' enumeration type
CREATE TYPE roles AS ENUM ('user', 'judge', 'advocate');
-- Create the 'case_type' enumeration type
CREATE TYPE case_type AS ENUM (
  'Civil Cases',
  'Criminal Cases',
  'Constitutional Cases',
  'Administrative Cases',
  'Family Law Cases',
  'Labour and Employment Cases',
  'Property Cases',
  'Commercial Cases',
  'Tax Cases',
  'Environmental Cases',
  'Human Rights Cases',
  'Cybercrime Cases'
);
-- Create the 'case_status' enumeration type
CREATE TYPE case_status AS ENUM ('pending', 'in-progress', 'closed', 'archived');
-- Create the 'profiles' table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  profile_picture TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  role roles DEFAULT 'user'::roles
);
-- Index on email in 'profiles' table
CREATE INDEX idx_profiles_email ON profiles(email);
-- Create the 'addresses' table
CREATE TABLE IF NOT EXISTS addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  address TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- Create the 'registered_by_user' table
CREATE TABLE IF NOT EXISTS registered_by_user (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  address_id UUID NOT NULL REFERENCES addresses(id) ON DELETE CASCADE,
  phone_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- Create the 'registered_against_user' table
CREATE TABLE IF NOT EXISTS registered_against_user (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  address_id UUID NOT NULL REFERENCES addresses(id) ON DELETE CASCADE,
  phone_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- Create the 'case_details' table
CREATE TABLE IF NOT EXISTS case_details (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  registered_advocate UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  registered_by_user UUID NOT NULL REFERENCES registered_by_user(id) ON DELETE CASCADE,
  registered_against_user UUID NOT NULL REFERENCES registered_against_user(id) ON DELETE CASCADE,
  case_type case_type NOT NULL,
  case_status case_status NOT NULL DEFAULT 'pending'::case_status,
  case_title TEXT NOT NULL,
  case_description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- Create the 'case_documents' table
CREATE TABLE IF NOT EXISTS case_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES case_details(id) ON DELETE CASCADE,
  document_name TEXT NOT NULL,
  document_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- Create the 'judge_verdicts' table
CREATE TABLE IF NOT EXISTS judge_verdicts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES case_details(id) ON DELETE CASCADE,
  judge_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  verdict TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- Create the 'user_track_cases' table
CREATE TABLE IF NOT EXISTS user_track_cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  case_id UUID NOT NULL REFERENCES case_details(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- Indexes
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_case_details_registered_by_user ON case_details(registered_by_user);
CREATE INDEX idx_case_details_registered_advocate ON case_details(registered_advocate);
CREATE INDEX idx_case_details_email ON profiles(email);
CREATE INDEX idx_case_documents_case_id ON case_documents(case_id);
CREATE INDEX idx_judge_verdicts_case_id ON judge_verdicts(case_id);
CREATE INDEX idx_judge_verdicts_judge_id ON judge_verdicts(judge_id);
