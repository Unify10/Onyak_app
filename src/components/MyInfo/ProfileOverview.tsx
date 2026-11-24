import type { PersonalInfo } from '../../utils/personalInfo';
import ProfileHero from './ProfileHero';
import ProfileInfoTable from './ProfileInfoTable';

type Props = { name: string; email: string; profile: PersonalInfo };

export default function ProfileOverview({ name, email, profile }: Props) {
  return (
    <>
      <ProfileHero name={name} email={email} />
      <ProfileInfoTable profile={profile} />
    </>
  );
}
