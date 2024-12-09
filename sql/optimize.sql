-- insert into
--   "Optimize".Shift
-- values
--   (2, 1, 12, 111111111, 123456789, 5);

-- set search_path to "Optimize";


-- select * from department
SELECT column_name,
       data_type
FROM information_schema.columns
WHERE table_name = 'employee'
  AND table_schema = 'Optimize';

-- ALTER TABLE department ADD COLUMN msin CHAR(9);
 -- ALTER TABLE department ADD CONSTRAINT fk_msin
-- FOREIGN KEY (msin) REFERENCES manager(sin);
 -- ALTER TABLE department ADD COLUMN msin char(9) REFERENCES manager(id);
 -- SELECT column_name,
--        data_type
-- FROM information_schema.columns
-- WHERE table_name = 'department'
--   AND table_schema = 'Optimize';
