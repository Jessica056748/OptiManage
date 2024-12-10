-- SCHEMA: Optimize
-- DROP SCHEMA IF EXISTS "Optimize" ;
 -- select * from "Optimize".employee, "Optimize".manager;
-- select current_database();
-- select
--   table_name
-- from
--   information_schema.tables;
-- insert into
--   shift
-- values
--   (2, 1, 12, 111111111, 123456789, 5);
-- set search_path to Optimize;

create SCHEMA IF not exists "Optimize"
authorization postgres;


set search_path to "Optimize";


create table "Optimize".Employee ( sin char(9) primary key, Name varchar(15) not null, Phone char(10), Address varchar(100) not null, DepartmentId int, Email varchar(50) not null, Password varchar(30) not null, MSIN varchar(9) not null, Rate decimal(6, 2) not null );


create table "Optimize".Manager ( sin char(9) primary Key, Name varchar(15) not null, Phone char(10), Address varchar(100) not null, DepartmentId int, Email varchar(50) not null, Password varchar(30) not null );


alter table "Optimize".Employee Add
foreign key (MSIN) references "Optimize".Manager (sin);


create table "Optimize".Department (DepartmentId int primary Key);


alter table "Optimize".Employee Add
foreign key (DepartmentID) references "Optimize".Department (DepartmentID);


alter table "Optimize".Manager Add
foreign key (DepartmentID) references "Optimize".Department (DepartmentID);


create table "Optimize".DEPENDANT ( Name varchar(15), ESIN char(9), primary key (Name, ESIN),
                                   foreign KEY (ESIN) references "Optimize".Employee (sin) );


create table PAYROLL ( sin char(9) not null, Week int check ( Week >= 1
                                                             and Week <= 52 ), Quantity decimal(6, 2), primary key (sin, Week),
                      foreign key (sin) references Employee (sin) );


create table TIP ( date date not null, sin char(9) not null, Quantity decimal(6, 2), primary KEY (date, sin),
                  foreign KEY (sin) references EMPLOYEE (sin) );


create table SCHEDULE ( Week int check ( Week >= 1
                                        and Week <= 52 ), sin char(9) not null, Update_SIN char(9) not null, primary KEY (sin, Week),
                       foreign KEY (sin) references EMPLOYEE (sin),
                       foreign key (Update_SIN) references MANAGER (sin) );


create table Shift
  ( day int check ( day >= 1
                   and day <= 31 ) not null, Week int check ( Week >= 1
                                                             and Week <= 52 ) not null, month varchar(9) not null, MSIN char(9) not null, ESIN char(9) not null, start time not null, LENGTH decimal(6, 2), primary KEY (day, Week, month, ESIN),
   foreign KEY (ESIN) references EMPLOYEE (sin),
   foreign KEY (MSIN) references MANAGER (sin) );
  

create table Availability ( sin char(9) not null, Weekday char(10) not null, EMP_START time not null, EMP_END time not null, primary key (sin, Weekday),
                           foreign key (sin) references EMPLOYEE (sin) );


create table Supplier ( SupplierName varchar(50) not null, primary KEY (SupplierName) );


create table Item ( ItemCode int not null, SupplierName varchar(50), Price decimal(6, 2), primary KEY (ItemCode),
                   foreign KEY (SupplierName) references SUPPLIER (SUPPLIERNAME) );


create table SOLD_BY ( ItemCode int not null, sin char(9) not null, primary KEY (ItemCode, sin),
                      foreign KEY (sin) references EMPLOYEE (sin),
                      foreign KEY (ITEMCODE) references ITEM (ITEMCODE) );


create table Task (TaskId int not null, primary key (TaskId));


create table CATEGORIES ( ItemCode int not null, Categories varchar(30) not null, primary KEY (ItemCode),
                         foreign KEY (ITEMCODE) references ITEM (ITEMCODE) );


create table PERFORMED_BY ( sin char(9) not null, TaskID int not null, primary KEY (sin, TaskId),
                           foreign KEY (sin) references EMPLOYEE (sin),
                           foreign KEY (TASKID) references TASK (TASKID) );

-- Create table Request_FROMMSIN (
-- ID int NOt Null,
-- Week INT CHECK(Week>=1 AND Week <= 52),
-- Day	 int check(day >= 1 AND day<=31),
-- FromSIN	CHar(9)	NOt null,
-- ToSIN Char(9) Not null,
-- Type	varchar(30),
-- Acknowledged	boolean not null,
-- Primary key (ID));
-- Create table Request_ESIN (
-- ID int NOt Null,
-- Week INT CHECK(Week>=1 AND Week <= 52),
-- Day	 int check(day >= 1 AND day<=31),
-- FromSIN	CHar(9)	NOt null,
-- ToSIN Char(9) Not null,
-- Type	varchar(30),
-- Acknowledged	boolean not null,
-- Primary key (ID));

insert into Department
values (3);


insert into Manager
values ( 111111111,
         'Peter Parker',
         4032345677,
         '2717 Hocus Pocus Drive, Calgary, Alberta, T2A45K',
         3,
         'PParker@optimanage.ca',
         'PeterParker' );


insert into Employee
values ( 123456789,
         'Victoria Parker',
         4031233456,
         '2716 Hocus Pocus Drive, Calgary, Alberta, T2A45K',
         3,
         'VParker@optimanage.ca',
         'VictoriaParker',
         111111111,
         19.50 );