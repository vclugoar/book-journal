import EditBookClient from './EditBookClient';

// Required for static export - returns empty array since IDs are dynamic
export async function generateStaticParams() {
  return [];
}

export default function EditBookPage() {
  return <EditBookClient />;
}
