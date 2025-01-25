import { SignIn } from "@clerk/clerk-react";
import "./signInPage.css";

const signInAppearance = {
  elements: {
    footer: null,
  },
};

const SignInPage = () => {
  return (
    <div className="signInPage">
      <SignIn
        path="/sign-in"
        signUpUrl="/sign-up"
        forceRedirectUrl="/dashboard"
        appearance={signInAppearance}
      />
    </div>
  );
};

export default SignInPage;
