<!--
title: SQL
tags: sql, database, interview
description: SQL basics, joins, aggregations, and common interview queries.
featured: true
-->

# SQL

SQL (Structured Query Language) is used to query and manage relational databases. Understanding SQL is essential for data and backend interviews.

## Joins

- **INNER JOIN**: returns rows with matching keys in both tables  
- **LEFT JOIN**: returns all rows from the left table and matching rows from the right table  
- **RIGHT JOIN**: returns all rows from the right table and matching rows from the left table  

```sql
SELECT u.name, o.amount
FROM Users u
LEFT JOIN Orders o ON u.id = o.user_id;
