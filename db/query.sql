 select *
    from employee e
    inner join employee_role r on e.role_id = r.id
    inner join department d on r.department_id = d.id;

     select *
    from employee e
    join employee_role r on e.role_id = r.id
    join department d on r.department_id = d.id;