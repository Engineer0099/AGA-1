import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/(auth)/splash" />;
  //return <Redirect href={"/admin/subjects" as unknown as any} />;
}