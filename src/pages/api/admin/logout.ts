export async function POST({ session, redirect }) {
  await session.destroy();
  return redirect('/admin/login');
}
