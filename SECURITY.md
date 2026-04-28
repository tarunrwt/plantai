# Security Policy

## Supported Versions

| Version | Supported          |
|---------|--------------------|
| 2.x.x   | ✅ Current         |
| < 2.0   | ❌ No longer supported |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

1. **Do NOT** open a public GitHub issue
2. Email **tarunrwt@gmail.com** with:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
3. You will receive a response within **48 hours**
4. A fix will be deployed within **7 days** of confirmation

## Security Measures

- **Authentication**: Supabase Auth with Row Level Security (RLS)
- **API**: Server-side proxy route eliminates direct API exposure
- **Data**: All user data protected by Supabase RLS policies
- **Environment**: Secrets managed via environment variables, never committed
- **Dependencies**: Regular dependency audits via `npm audit`
