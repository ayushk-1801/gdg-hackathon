import { authClient } from "@/lib/auth-client"; //import the auth client

export const signUpUser = async (
  emailParam: string,
  passwordParam: string,
  nameParam: string,
  imageParam?: string,
  callbackURLParam: string = "/dashboard"
) => {
  const email = emailParam;
  const password = passwordParam;
  const name = nameParam;
  const image = imageParam;
  const callbackURL = callbackURLParam;

  try {
    const { data, error } = await authClient.signUp.email(
      {
        email,
        password,
        name,
        image,
        callbackURL,
      },
      {
        onRequest: (ctx) => {
          //show loading
        },
        onSuccess: (ctx) => {
          window.location.href = callbackURLParam;
        },
        onError: (ctx) => {
          // display the error message
          alert(ctx.error.message);
        },
      }
    );

    return { data, error };
  } catch (err) {
    console.error("Sign up error:", err);
    return { data: null, error: err };
  }
};


export const signInUser = async (
    emailParam: string,
    passwordParam: string,
    rememberMe: boolean = true, // Default to true since we removed the checkbox
    callbackURLParam: string = "/dashboard"
  ) => {
    const email = emailParam;
    const password = passwordParam;
    const callbackURL = callbackURLParam;
  
    try {
      const { data, error } = await authClient.signIn.email(
        {
          email,
          password,
          callbackURL,
          rememberMe
        },
        {
          onRequest: (ctx) => {
            // Show loading state
          },
          onSuccess: (ctx) => {
            window.location.href = callbackURL;
          },
          onError: (ctx) => {
            // We'll handle errors in the component
          },
        }
      );
  
      return { data, error };
    } catch (err) {
      console.error("Sign in error:", err);
      return { data: null, error: err };
    }
  };
  