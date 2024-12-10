-- note: TIME uses HH:MM:SS format

set search_path to "Optimize";


select *
from shift -- SELECT column_name,
--        data_type
-- FROM information_schema.columns
-- WHERE table_name = 'shift'
--   AND table_schema = 'Optimize';
 -- DELETE FROM shift;
-- values (13,
--         2,
--         11,
--         111111111,
--         123456789,
--         5,
--         '09:00:00');
 -- insert into Shift
-- values (13,
--         2,
--         11,
--         222222222,
--         314159265,
--         5,
--         '11:00:00'), (14,
--                       2,
--                       11,
--                       222222222,
--                       314159265,
--                       5,
--                       '16:00:00'); -- insert into Shift
-- values (13, -- day
--  2, -- week (doubt we'll use it)
--  11, -- month (0-indexed)
--  111111111, -- msin
--  111111111, -- esin
--  5, -- length (hours)
--  '11:00:00'); -- start time hh:mm:ss
 -- delete everything from shift.
-- TRUNCATE table shift;
 -- ALTER TABLE department ADD COLUMN msin CHAR(9);
 -- ALTER TABLE department ADD CONSTRAINT fk_msin
-- FOREIGN KEY (msin) REFERENCES manager(sin);
 -- ALTER TABLE department ADD COLUMN msin char(9) REFERENCES manager(id);
