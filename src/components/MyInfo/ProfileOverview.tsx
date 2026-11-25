import type { ReactNode } from 'react';
import type { PersonalInfo } from '../../utils/personalInfo';
import ProfileHero from './ProfileHero';
import ProfileInfoTable from './ProfileInfoTable';

type Props = { name: string; subtitle: string; profile?: PersonalInfo; feedback?: ReactNode };

export default function ProfileOverview({ name, subtitle, profile, feedback }: Props) {
  return (
    <>
      <ProfileHero name={name} subtitle={subtitle} />
      <ProfileInfoTable profile={profile} showBirthDate />
      {feedback}
    </>
  );
}
