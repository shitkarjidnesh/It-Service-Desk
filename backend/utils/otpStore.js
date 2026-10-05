const otpStore = new Map();

export const saveOTP = (email, role, otp) => {
  const key = `${role}:${email}`;

  otpStore.set(key, {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
  });
};

export const getOTP = (email, role) => {
  const key = `${role}:${email}`;

  const data = otpStore.get(key);

  if (!data) {
    return null;
  }

  // Automatically remove expired OTP
  if (Date.now() > data.expiresAt) {
    otpStore.delete(key);
    return null;
  }

  return data;
};

export const deleteOTP = (email, role) => {
  const key = `${role}:${email}`;

  otpStore.delete(key);
};
