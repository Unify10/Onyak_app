export type GoogleLoginButtonProps = {
  disabled: boolean;
  onCredential: (token: string) => Promise<void>;
  onError: (message: string) => void;
};
