<!--
title: System Design
tags: system design, scalability, interview
description: Notes on designing scalable systems and common patterns.
featured: false
-->

# System Design

System design interviews evaluate your ability to build scalable, reliable, and maintainable systems. Focus on architecture, trade-offs, and best practices.

## Load Balancers

- Distribute traffic across multiple servers  
- Improve availability and fault tolerance  
- Common types: Round-robin, Least Connections, IP Hash  

```text
User --> LB --> Web Server Cluster --> Database
