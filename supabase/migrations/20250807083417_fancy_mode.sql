/*
  # Create subscription and bill tracker schema

  1. New Tables
    - `trackers`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `amount` (decimal)
      - `category` (text)
      - `frequency` (text)
      - `due_date` (date)
      - `notes` (text, optional)
      - `icon` (text)
      - `color` (text)
      - `is_active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `trackers` table
    - Add policies for authenticated users to manage their own trackers
*/

CREATE TABLE IF NOT EXISTS trackers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  amount decimal(10,2) NOT NULL,
  category text NOT NULL,
  frequency text NOT NULL CHECK (frequency IN ('Monthly', 'Yearly', 'Custom')),
  due_date date NOT NULL,
  notes text DEFAULT '',
  icon text NOT NULL DEFAULT 'Package',
  color text NOT NULL DEFAULT 'bg-blue-500',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE trackers ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own trackers
CREATE POLICY "Users can read own trackers"
  ON trackers
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy for users to insert their own trackers
CREATE POLICY "Users can insert own trackers"
  ON trackers
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own trackers
CREATE POLICY "Users can update own trackers"
  ON trackers
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to delete their own trackers
CREATE POLICY "Users can delete own trackers"
  ON trackers
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_trackers_updated_at
  BEFORE UPDATE ON trackers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();