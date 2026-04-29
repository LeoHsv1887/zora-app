import AntragWizardLoader from "@/components/AntragWizardLoader";

interface Props {
  params: { programm: string };
}

export default function AntragPage({ params }: Props) {
  // Config (with functions) is loaded client-side in AntragWizardLoader
  // to avoid server→client function serialization error
  return <AntragWizardLoader programmId={params.programm} />;
}
