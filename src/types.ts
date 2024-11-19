export interface Policyholder {
  code: string;
  name: string;
  introducer_code: string | null;
  l?: Policyholder[];
  r?: Policyholder[];
}

export interface RelationshipChartProps {
  policyholder: Policyholder | null;
  onNodeSelect: (holder: Policyholder) => void;
}
