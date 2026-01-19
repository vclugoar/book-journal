import CollageClient from './CollageClient';

// Required for static export - returns empty array since IDs are dynamic
export async function generateStaticParams() {
  return [];
}

export default function CollagePage() {
  return <CollageClient />;
}
