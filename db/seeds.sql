INSERT INTO department (department_name)
VALUES
    ( 'Engineering'),
    ( 'Finance' ),
    ( 'Legal' ),
    ( 'Sales' );


INSERT INTO employee_role ( title, salary, department_id)
VALUES
    ('Engineer', '4000', 1),
    ('Accountant', '3000', 2),
    ('Lawyer', '5000', 3),
    ('Digital Marketer', '3000', 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
    ('Tom', 'Lane', 1, 1),
    ('James', 'Won', 4, 1),
    ('Tabby', 'Kent', 3, 1);

