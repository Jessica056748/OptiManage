-- SCHEMA: Optimize

-- DROP SCHEMA IF EXISTS "Optimize" ;

CREATE SCHEMA IF NOT EXISTS "Optimize"
    AUTHORIZATION postgres;
set search_path to "Optimize";

CREATE TABLE "Optimize".Employee (  
SIN CHAR (9) primary key,  
Name VARCHAR (15) NOT NULL,  
Phone CHAR(10),  
Address  VARCHAR (100) NOT NULL,  
DepartmentId INT NOt null,   
Email VARCHAR (50) NOT NULL, 
Password VARCHAR(100) NOT NULL, 
MSIN Varchar(9) NOT NULL,
Rate Decimal(6,2) NOT NULL);

CREATE TABLE "Optimize".Manager(  
SIN CHAR (9) Primary Key,  
Name VARCHAR (15) NOT NULL,  
Phone CHAR(10),  
Address  VARCHAR (100) NOT NULL,  
DepartmentId INT	NOT NULL,   
Email VARCHAR (50) NOT NULL, 
Password VARCHAR(100) NOT NULL); 

Alter Table "Optimize".Employee
Add foreign key (MSIN) References "Optimize".Manager(SIN);

CREATE TABLE "Optimize".Department (  
DepartmentId INT Primary Key);

Alter Table "Optimize".Employee
Add Foreign key (DepartmentID) references "Optimize".Department(DepartmentID);

Alter Table "Optimize".Manager
Add Foreign key (DepartmentID) references "Optimize".Department(DepartmentID);

CREATE TABLE "Optimize".DEPENDANT (  
Name VARCHAR (15) Not null,  
ESIN CHAR (9)	Not null,
primary key (Name, ESIN),
FOREIGN KEY (ESIN) REFERENCES "Optimize".Employee(SIN)); 

CREATE TABLE PAYROLL (  
SIN CHAR (9) NOT NULL,  
Week INT CHECK(Week>=1 AND Week <= 52) not null, 
Quantity Decimal(6,2),
Primary key (SIN, Week),
FOREIGN key (SIN) REFERENCES Employee(SIN));

CREATE TABLE TIP (  
Date  DATE  NOT NULL,  
SIN  CHAR (9)  NOT NULL, 
Quantity  DECIMAL (6,2),  
PRIMARY KEY (Date, SIN),
FOREIGN KEY (SIN) REFERENCES EMPLOYEE(SIN));

CREATE TABLE SCHEDULE (  
Week INT CHECK(Week>=1 AND Week <= 52),                            
SIN  CHAR(9) NOT NULL,  
Update_SIN CHAR (9) NOT NULL,  
PRIMARY KEY (SIN, Week),
FOREIGN KEY (SIN) REFERENCES EMPLOYEE(SIN),
Foreign key (Update_SIN) REFERENCES MANAGER (SIN));

CREATE TABLE Shift (  
Day INT Check(Day >= 1 AND day <=31) NOT NULL,  
Week INT CHECK(Week>=1 AND Week <= 52) NOT NULL,
Month VARCHAR(9) NOT NULL, 
MSIN CHAR(9) NOT NULL,  
ESIN CHAR(9) NOT NULL,  
LENGTH DECIMAL(6,2),                                             
PRIMARY KEY (Day, Week, Month, ESIN),
FOREIGN KEY (ESIN) REFERENCES EMPLOYEE(SIN),
FOREIGN KEY (MSIN) REFERENCES MANAGER (SIN));

CREATE TABLE Availability(
SIN Char(9) NOT NULL,
Weekday CHAR(10) NOT NULL,
EMP_START TIME NOT NULL,
EMP_END TIME NOT NULL,
Primary key (SIN, Weekday),
Foreign key (SIN) references EMPLOYEE(SIN));

CREATE TABLE Supplier (  
SupplierName VARCHAR (50) NOT NULL,  
PRIMARY KEY (SupplierName)); 

CREATE TABLE Item (  
ItemCode INT  NOT NULL,  
SupplierName VARCHAR (50),  
Price DECIMAL(6,2),                                              
PRIMARY KEY (ItemCode),
FOREIGN KEY (SupplierName) REFERENCES SUPPLIER(SUPPLIERNAME));

CREATE TABLE SOLD_BY (  
ItemCode INT NOT NULL,  
SIN CHAR (9)  NOT NULL,  
PRIMARY KEY (ItemCode, SIN),
FOREIGN KEY (SIN) REFERENCES EMPLOYEE(SIN),
FOREIGN KEY (ITEMCODE) REFERENCES ITEM (ITEMCODE));

Create table Task (
TaskId	int Not Null,
Primary key (TaskId));

CREATE TABLE CATEGORIES (  
ItemCode INT NOT NULL,  
Categories VARCHAR(30) NOT NULL,  
PRIMARY KEY (ItemCode),
FOREIGN KEY (ITEMCODE) REFERENCES ITEM (ITEMCODE));

CREATE TABLE PERFORMED_BY (  
SIN CHAR (9) NOT NULL,   
TaskID Int NOT NULL,   
PRIMARY KEY (SIN, TaskId),
FOREIGN KEY (SIN) REFERENCES EMPLOYEE(SIN),
FOREIGN KEY (TASKID) REFERENCES TASK (TASKID));

Create table Request (
ID int NOt Null, 
Week INT CHECK (Week>=1 AND Week <= 52) not null,
Day	 int check(day >= 1 AND day<=31) not null, 
month varchar(9) not null,
FromSIN	CHar(9)	NOt null, 
ToSIN Char(9) Not null, 
Type	varchar(30) not null, 
Acknowledged	boolean not null,
Primary key (ID),
Foreign key (ToSIN) references Manager(SIN),
Foreign key (FromSIN, week, day, month) references shift(ESIN, week, day, month));


Insert into Department
Values (3);

Insert into Manager
Values (111111111, 'Peter Parker', 4032345677, '2717 Hocus Pocus Drive, Calgary, Alberta, T2A45K', 3, 'PParker@optimanage.ca', 'PeterParker');



Insert into Employee
Values (123456789, 'Victoria Parker', 4031233456, '2716 Hocus Pocus Drive, Calgary, Alberta, T2A45K', 3, 'VParker@optimanage.ca', 'VictoriaParker', 111111111, 19.50);


Select *
From Schedule as S
Join Shift as H on S.Week = H.Week
Where S.SIN = $s1;






