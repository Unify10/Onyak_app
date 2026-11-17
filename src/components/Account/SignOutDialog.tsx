import ConfirmationDialog, { type ConfirmationDialogProps } from '../Dialogs/ConfirmationDialog';

type Props = Omit<ConfirmationDialogProps, 'title' | 'confirmLabel'>;

export default function SignOutDialog(props: Props) {
  return <ConfirmationDialog {...props} title="로그아웃하시겠습니까?" confirmLabel="로그아웃" />;
}
