export type TestimonyRecord = {
  id: string;
  fullName: string;
  phone: string | null;
  location: string | null;
  session: string | null;
  testimony: string;
  consentToShare: boolean;
  anonymousMode: boolean;
  createdAt: string;
};

export type NewTestimonyInput = {
  fullName: string;
  phone?: string;
  location?: string;
  session?: string;
  testimony: string;
  consentToShare: boolean;
  anonymousMode: boolean;
};
