import type { PersonalInfo } from '../../utils/personalInfo';
import ProfileHero from './ProfileHero';
import ProfileInfoTable from './ProfileInfoTable';

type Props = { name: string; email: string; profile: PersonalInfo; showBirthDate?: boolean };

export default function ProfileOverview({ name, email, profile, showBirthDate }: Props) {
  return (
    <>
      <ProfileHero name={name} email={email} />
      <ProfileInfoTable profile={profile} showBirthDate={showBirthDate} />
    </>
  );
}
