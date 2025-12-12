import { describe, it, expect } from 'vitest';
import { validatePassword, validateEmail } from '../validation';

describe('Validation Utils', () => {
    describe('validatePassword', () => {
        it('should require a password', () => {
            expect(validatePassword('')).toBe('Password is required.');
        });

        it('should require minimum length', () => {
            expect(validatePassword('12345')).toBe('Password must be at least 6 characters.');
            expect(validatePassword('123456')).toBeNull();
        });

        it('should validate matching passwords', () => {
            expect(validatePassword('password', 'password')).toBeNull();
            expect(validatePassword('password', 'misMatch')).toBe('Passwords do not match.');
        });
    });

    describe('validateEmail', () => {
        it('should allow empty email (optional)', () => {
            expect(validateEmail('')).toBeNull();
        });

        it('should validate correct email formats', () => {
            expect(validateEmail('test@example.com')).toBeNull();
            expect(validateEmail('user.name+tag@domain.co.uk')).toBeNull();
        });

        it('should reject invalid email formats', () => {
            expect(validateEmail('invalid-email')).toBe('Invalid email format');
            expect(validateEmail('user@domain')).toBe('Invalid email format'); // Missing TLD
            expect(validateEmail('@domain.com')).toBe('Invalid email format');
        });
    });
});
