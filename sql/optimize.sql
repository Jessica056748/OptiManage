-- note: TIME uses HH:MM:SS format

set search_path to "Optimize";

-- values (13,
--         2,
--         11,
--         111111111,
--         123456789,
--         5,
--         '09:00:00');
 -- insert into Shift
-- values (13, -- Date
--         2, -- Week (doubt we'll use it)
--         11, -- Month (0-indexed)
--         111111111,
--         111111111,
--         5,
--         '11:00:00');


-- delete everything from shift.
-- TRUNCATE table shift;
 -- ALTER TABLE department ADD COLUMN msin CHAR(9);
 -- ALTER TABLE department ADD CONSTRAINT fk_msin
-- FOREIGN KEY (msin) REFERENCES manager(sin);
 -- ALTER TABLE department ADD COLUMN msin char(9) REFERENCES manager(id);
--  SELECT column_name,
--        data_type
-- FROM information_schema.columns
-- WHERE table_name = 'shift'
--   AND table_schema = 'Optimize';
