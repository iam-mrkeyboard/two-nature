export async function POST({ cookies, redirect }) {
  cookies.delete('auth_session', { path: '/' });
  return redirect('/admin/login');
}
