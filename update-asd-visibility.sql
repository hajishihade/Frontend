-- Update ASD content from personal to public visibility
-- This will make the content accessible to all users

-- Update the subject (Neurodevelopmental Disorders)
UPDATE subjects 
SET visibility = 'public'
WHERE id = '848c9220-3bed-4404-9842-b3521af527eb'
   OR name LIKE '%Neurodevelopmental%'
   OR name LIKE '%ASD%';

-- Update all chapters related to this subject
UPDATE chapters 
SET visibility = 'public'
WHERE subject_id = '848c9220-3bed-4404-9842-b3521af527eb';

-- Update all lectures (General Overview, Epidemiology, Etiology, etc.)
UPDATE lectures 
SET visibility = 'public'
WHERE id IN (
    '083a5dff-cc55-4302-aff0-91dc76c7f879',  -- General Overview
    '21844392-be17-4493-bfbe-58f7ad8e106e',  -- Epidemiology
    '97b79973-a5cb-4c50-81e5-77495b7ae785',  -- Etiology
    '1db23d02-2dd8-4ef1-ad0f-6e7f65dad0f6',  -- Clinical Features
    '134f8d67-f16f-46e6-b7aa-e5a9f7bee142',  -- Diagnosis
    '1a96497d-0b85-405a-b4b9-b0b4d0b9b7f2',  -- Differential Diagnosis
    '2738bf82-534e-43df-b30c-8b77dc0170d7',  -- Treatment
    '8ee3f835-441c-409b-aa15-7dba863f50e6'   -- Prognosis
);

-- Also update any sections, points, and spoints related to these
UPDATE sections 
SET visibility = 'public'
WHERE lecture_id IN (
    SELECT id FROM lectures 
    WHERE subject_id = '848c9220-3bed-4404-9842-b3521af527eb'
);

UPDATE points 
SET visibility = 'public'
WHERE section_id IN (
    SELECT id FROM sections 
    WHERE lecture_id IN (
        SELECT id FROM lectures 
        WHERE subject_id = '848c9220-3bed-4404-9842-b3521af527eb'
    )
);

UPDATE spoints 
SET visibility = 'public'
WHERE point_id IN (
    SELECT id FROM points 
    WHERE section_id IN (
        SELECT id FROM sections 
        WHERE lecture_id IN (
            SELECT id FROM lectures 
            WHERE subject_id = '848c9220-3bed-4404-9842-b3521af527eb'
        )
    )
);

-- Also update status from 'draft' to 'published' to make it fully available
UPDATE subjects 
SET status = 'published'
WHERE id = '848c9220-3bed-4404-9842-b3521af527eb';

UPDATE chapters 
SET status = 'published'
WHERE subject_id = '848c9220-3bed-4404-9842-b3521af527eb';

UPDATE lectures 
SET status = 'published'
WHERE id IN (
    '083a5dff-cc55-4302-aff0-91dc76c7f879',
    '21844392-be17-4493-bfbe-58f7ad8e106e',
    '97b79973-a5cb-4c50-81e5-77495b7ae785',
    '1db23d02-2dd8-4ef1-ad0f-6e7f65dad0f6',
    '134f8d67-f16f-46e6-b7aa-e5a9f7bee142',
    '1a96497d-0b85-405a-b4b9-b0b4d0b9b7f2',
    '2738bf82-534e-43df-b30c-8b77dc0170d7',
    '8ee3f835-441c-409b-aa15-7dba863f50e6'
);

-- Verify the updates
SELECT 'Updated Subjects:' as info;
SELECT id, name, visibility, status FROM subjects 
WHERE id = '848c9220-3bed-4404-9842-b3521af527eb';

SELECT 'Updated Lectures:' as info;
SELECT id, name, visibility, status FROM lectures 
WHERE id IN (
    '083a5dff-cc55-4302-aff0-91dc76c7f879',
    '21844392-be17-4493-bfbe-58f7ad8e106e',
    '97b79973-a5cb-4c50-81e5-77495b7ae785',
    '1db23d02-2dd8-4ef1-ad0f-6e7f65dad0f6',
    '134f8d67-f16f-46e6-b7aa-e5a9f7bee142',
    '1a96497d-0b85-405a-b4b9-b0b4d0b9b7f2',
    '2738bf82-534e-43df-b30c-8b77dc0170d7',
    '8ee3f835-441c-409b-aa15-7dba863f50e6'
);