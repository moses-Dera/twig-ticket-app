# TicketApp — Twig (PHP + Twig) Implementation

## Overview
This is the Twig/PHP implementation of the Multi-Framework Ticket Web App. It uses server-rendered templates (Twig) while simulating authentication and ticket storage on the client using `localStorage` (key: `ticketapp_session` & `ticketapp_tickets_v1`).

## Features
- Landing page with wave hero & decorative circle
- Login & Signup with inline validation & toast notifications
- Dashboard: shows Total / Open / In Progress / Resolved counts
- Ticket Management: Create / Read / Update / Delete (with validation & confirmation)
- Protected routes: Dashboard & Tickets redirect to `/auth/login` if no token

## Requirements
- PHP 8+ (for built-in server)
- Composer (to install Twig)

## Setup & Run (local)
1. Install dependencies:
