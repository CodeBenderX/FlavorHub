const signin = async (user) => {
    try {
        let response = await fetch('/auth/signin/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(user)
        })
        return await response.json()
    } catch (err) {
        console.log(err)
    }
}
const signout = async () => {
    try {
        let response = await fetch('/auth/signout/', { method: 'GET' })
        return await response.json()
    } catch (err) {
        console.log(err)
    }
}
const forgotPassword = async (user) => {
    try {
      let response = await fetch('/auth/forgot-password/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      });
      return await response.json();
    } catch (err) {
      console.log(err);
    }
  }
// Verify the user's security answer
const verifySecurityAnswer = async ({ email, securityAnswer }) => {
  try {
    const response = await fetch('/auth/verify-security-answer', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, securityAnswer })
    });
    return await response.json();
  } catch (err) {
    console.log(err);
    return { error: "Network error" };
  }
}

// Reset the user's password
const resetPassword = async ({ email, newPassword }) => {
  try {
    const response = await fetch('/auth/reset-password', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, newPassword })
    });
    return await response.json();
  } catch (err) {
    console.log(err);
    return { error: "Network error" };
  }
}

export { signin, signout, forgotPassword, verifySecurityAnswer, resetPassword }

