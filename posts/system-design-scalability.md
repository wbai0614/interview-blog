<!--
title: System Design: Scalability
tags: system design, scalability, interview
description: Key concepts and patterns for designing scalable systems in interviews.
featured: true
-->

# System Design: Scalability

Scalable systems handle increasing load gracefully. Understanding scalability patterns is essential for system design interviews.

## Vertical vs Horizontal Scaling

- **Vertical scaling**: Increase server resources (CPU, RAM)  
  - Simple but limited by hardware  
- **Horizontal scaling**: Add more servers  
  - Requires load balancing and data partitioning  

```text
Vertical: Single large DB server
Horizontal: Multiple DB servers with sharding
