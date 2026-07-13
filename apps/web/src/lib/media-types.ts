export type MediaRightsStatus =
  | 'UNVERIFIED'
  | 'CLIENT_PROVIDED'
  | 'OWNED'
  | 'LICENSED'
  | 'PROHIBITED';

export type MediaUsageContext =
  | 'HERO'
  | 'AIRCRAFT_EXTERIOR'
  | 'AIRCRAFT_CABIN'
  | 'SERVICE'
  | 'EMPTY_LEG'
  | 'DESTINATION'
  | 'NEWS'
  | 'CARGO'
  | 'MEDEVAC'
  | 'MEMBERSHIP'
  | 'ABOUT'
  | 'CONTACT'
  | 'MAP'
  | 'PLACEHOLDER';

export type JetVinaMediaRecord = {
  id: string;
  sourceUrl: string;
  sourcePageUrl?: string;
  wordpressMediaId?: number;
  localPath?: string;
  mimeType: string;
  width: number;
  height: number;
  fileSize: number;
  checksum: string;
  altText?: string;
  caption?: string;
  usageContexts: MediaUsageContext[];
  rightsStatus: MediaRightsStatus;
  approvedForStaging: boolean;
  approvedForProduction: boolean;
  reviewedBy?: string;
  reviewedAt?: string;
  sourceModifiedAt?: string;
  syncedAt: string;
  focalPointX?: number;
  focalPointY?: number;
  objectPositionDesktop?: string;
  objectPositionMobile?: string;
};

export type JetVinaMediaManifest = {
  version: 1;
  generatedAt: string;
  rightsNote: string;
  records: JetVinaMediaRecord[];
};

export type ResolveMediaInput = {
  context: MediaUsageContext;
  preferredId?: string;
  seed?: string;
  fallbackKind?: 'aircraft' | 'service' | 'destination' | 'news' | 'cabin' | 'hero' | 'membership' | 'map' | 'generic';
  environment?: 'development' | 'staging' | 'production';
};

export type ResolvedMedia = {
  src: string;
  alt: string;
  width: number;
  height: number;
  source: 'CLIENT' | 'LOCAL_JETVINA' | 'REMOTE_JETVINA_REVIEW' | 'PLACEHOLDER';
  rightsStatus: MediaRightsStatus | 'N/A';
  objectPosition?: string;
};
