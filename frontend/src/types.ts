type SignUpForm = {
    fullName: string;
    email: string;
    password: string;
};

type LoginForm = {
    email: string;
    password: string;
};

type AuthStore = {
    authUser: any;
    isSigningUp: boolean;
    isLoggingIn: boolean;
    isUpdatingProfile: boolean;
    isCheckingAuth: boolean;

    checkAuth: () => Promise<void>;

    signup: (data: SignUpForm) => Promise<void>;

    logout: () => Promise<void>;

    login: (data: LoginForm) => Promise<void>;
};

type AuthImagePatternParams = {
    title: string;
    subtitle: string;
};

export type { SignUpForm, LoginForm, AuthStore, AuthImagePatternParams };
