- - - Here's the base URL to use for Authentication Processes
      "https://sso.tradesync.software"

And I want to Implement the Logins and OTP Verification Mechanism for this project

Here's the endpoint for the Login '/api/v1/auth/login and the required form payload
(i.e Login using Email or Phone Number as username)
Request body \*Required
{
"username": "string",
"password": "string",
}

<!-- After sending the Login Request Redirect to the OTP Verification page so that the
user should enter the OTP and only redirect to the home page once the OTP verification it successful
i.e when the user's OTP is verified OK
 -->

- - - Here's the endpoint to send the OTP verification along with the user's username (i.e phone or email)
      /api/v1/auth/otp/verify (Verify OTP and login)
      Request body (required)
      {
      "username": "string",
      "otp": "string",
      }
