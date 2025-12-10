export const validatePassword = (password: string, confirmPassword?: string): string | null => {
    if (!password) return 'Password is required.';
    if (confirmPassword !== undefined && password !== confirmPassword) return 'Passwords do not match.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    return null;
};

export const validateEmail = (email: string): string | null => {
    if (!email) return null; // Optional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Invalid email format';
    return null;
};

export const validateSolanaAddress = (address: string): string | null => {
    if (!address) return 'Address is required';
    try {
        // Basic check, in a real app import PublicKey from @solana/web3.js
        // But we want this file to be lightweight/pure JS if possible, 
        // strictly speaking PublicKey validation belongs here but might force imports.
        // For now, let's keep strict Solana validation in the component or make this file .ts and import web3
        return null;
    } catch {
        return 'Invalid address';
    }
};
