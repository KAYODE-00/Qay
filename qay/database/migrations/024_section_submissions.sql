-- Alter table to add new columns required for community/Kay submissions
ALTER TABLE qay_section_designs ADD COLUMN IF NOT EXISTS keywords TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE qay_section_designs ADD COLUMN IF NOT EXISTS rank INTEGER NOT NULL DEFAULT 50;
ALTER TABLE qay_section_designs ADD COLUMN IF NOT EXISTS is_approved BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE qay_section_designs ADD COLUMN IF NOT EXISTS submitted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE qay_section_designs ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'qay';

-- GIN index for keyword search
CREATE INDEX IF NOT EXISTS idx_qay_section_designs_keywords ON qay_section_designs USING GIN(keywords);

-- Policy check and creation
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'qay_section_designs' AND policyname = 'Anyone reads approved sections'
  ) THEN
    CREATE POLICY "Anyone reads approved sections"
      ON qay_section_designs FOR SELECT
      USING (is_active = true AND is_approved = true);
  END IF;
END
$$;
